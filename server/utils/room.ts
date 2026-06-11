import { getTableColumns } from "drizzle-orm";
import { getColumns } from "../database/getColumns";
import {
  roomTable,
  roomUserTable,
  stageTable,
  userTable,
} from "../database/schema";
import { createPrivateMatchRoom } from "./brazen-api/createPrivateMatchRoom";
import { openPrivateMatchRoom } from "./brazen-api/openPrivateMatchRoom";
import {
  RoomVisibility,
  syncPrivateMatchRoom,
} from "./brazen-api/syncPrivateMatchRoom";
import type { DBRoomInsert } from "./drizzle";
import type { GameRuleDto } from "./gameRule";
import { gameRuleToDto, getLatestGameRulesSubquery } from "./gameRule";
import { connect } from "./matchmaking-api/connect";
import { disconnect } from "./matchmaking-api/disconnect";
import type { StageDto } from "./stage";
import type { BrazenUser } from "./user";

interface RoomUser {
  user: BrazenUser;
  team: number;
}

export interface Room {
  id: number;
  matchId: string;
  marsRoomId: string;
  stage: Stage;
  gameRule: GameRule;
  public: boolean;
  invitationCode: string;
  createdAt: Date;
  users: RoomUser[];
}

interface RoomUserDto {
  user: BrazenUser;
  team: number;
}

export interface RoomDto {
  id: number;
  matchId: string;
  marsRoomId: string;
  stage: StageDto;
  gameRule: GameRuleDto;
  public: boolean;
  invitationCode: string;
  createdAt: number;
  users: RoomUserDto[];
}

export function roomToDto(room: Room): RoomDto {
  return {
    id: room.id,
    matchId: room.matchId,
    marsRoomId: room.marsRoomId,
    stage: room.stage,
    gameRule: gameRuleToDto(room.gameRule),
    public: room.public,
    invitationCode: room.invitationCode,
    users: room.users,
    createdAt: Math.floor(room.createdAt.getTime() / 1000),
  };
}

function getRoomsQuery() {
  const gameRulesSubquery = getLatestGameRulesSubquery();

  return useDrizzle()
    .with(gameRulesSubquery)
    .select({
      ...getColumns(roomTable),
      gameRule: getColumns(gameRulesSubquery),
      stage: getColumns(stageTable),
      roomUser: getColumns(roomUserTable),
      user: getTableColumns(userTable),
    })
    .from(roomTable)
    .innerJoin(stageTable, eq(stageTable.id, roomTable.stageId))
    .innerJoin(
      gameRulesSubquery,
      eq(gameRulesSubquery.gameRuleId, roomTable.gameRuleId),
    )
    .leftJoin(roomUserTable, eq(roomUserTable.roomId, roomTable.id))
    .leftJoin(userTable, eq(userTable.id, roomUserTable.userId))
    .orderBy(desc(roomTable.id));
}

function mergeRows(rows: Awaited<ReturnType<typeof getRoomsQuery>>): Room[] {
  const result = rows.reduce<Record<number, Room>>((acc, row) => {
    const { user, roomUser, ...room } = row;

    if (acc[room.id] === undefined) {
      acc[room.id] = { users: [], ...room };
    }
    if (roomUser && user) {
      acc[room.id]?.users.push({ user: user, team: roomUser.team });
    }

    return acc;
  }, {});

  return Object.values(result);
}

export async function getRooms(): Promise<Room[]> {
  const rows = await getRoomsQuery();
  return mergeRows(rows);
}

export async function getRoomById(id: number): Promise<Room | null> {
  const rows = await getRoomsQuery().where(eq(roomTable.id, id));
  const result = mergeRows(rows);
  return Object.values(result)[0] || null;
}

export async function createRoom(
  host: DBHost,
  stageId: number,
  gameRuleId: number,
  publicRoom: boolean,
  users: { userId: number; userKey: string; name: string; team: number }[],
): Promise<void> {
  const privateMatchRoom = await createPrivateMatchRoom(host.token);

  const room: DBRoomInsert = {
    hostId: host.id,
    matchId: privateMatchRoom.id,
    stageId: stageId,
    gameRuleId: gameRuleId,
    public: publicRoom,
    invitationCode: privateMatchRoom.invitationCode,
    marsRoomId: privateMatchRoom.marsRoomId,
  };

  await openPrivateMatchRoom(host.token, privateMatchRoom.id);

  await syncPrivateMatchRoom(host.token, {
    PrivateMatchRoomId: privateMatchRoom.id,
    LeaderUserKey: host.userKey,
    Players: [{ UserKey: host.userKey }],
    Visibility: publicRoom ? RoomVisibility.Public : RoomVisibility.Private,
    VoiceChatSettings: 0,
    GameRuleId: gameRuleId,
    StageId: stageId,
    SupportItemsSettings: 0,
    RoomTagId: 1,
  });

  const roomId = (
    await useDrizzle()
      .insert(roomTable)
      .values(room)
      .returning({ id: roomTable.id })
  )[0];
  if (!roomId) {
    throw new Error("Failed to create room");
  }

  await useDrizzle()
    .insert(roomUserTable)
    .values(users.map((user) => ({ roomId: roomId.id, ...user })));

  if (!privateMatchRoom.players[0]) {
    throw new Error("No host player info found in private match room data");
  }

  await connect({
    marsHost: privateMatchRoom.marsHost,
    marsPort: privateMatchRoom.marsPort,
    marsSessionId: privateMatchRoom.players[0].marsSessionId,
    marsRoomId: privateMatchRoom.marsRoomId,
    marsCryptKey: privateMatchRoom.marsCryptKey,
    marsToken: privateMatchRoom.players[0].marsToken,
    voiceChatClientId: privateMatchRoom.players[0].voiceChatClientId,
    voiceChatToken: privateMatchRoom.players[0].voiceChatToken,
    userKey: privateMatchRoom.players[0].userKey,
    stageId: stageId,
    ruleId: gameRuleId,
    hostToken: host.token,
    matchId: privateMatchRoom.id,
    public: publicRoom,
    players: users.map((user) => ({
      userKey: user.userKey,
      teamIndex: user.team + 1,
    })),
  });
}

export async function closeRoom(id: number): Promise<void> {
  const room = await getRoomById(id);

  if (room === null) {
    return;
  }

  await disconnect({ marsRoomId: room.marsRoomId });

  return await deleteRoomById(id);
}

export async function deleteRoomById(id: number): Promise<void> {
  await useDrizzle().delete(roomUserTable).where(eq(roomUserTable.roomId, id));
  await useDrizzle().delete(roomTable).where(eq(roomTable.id, id));
}
