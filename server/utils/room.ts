import { getTableColumns } from "drizzle-orm";
import { getColumns } from "../database/getColumns";
import {
  matchTable,
  roomSessionTable,
  roomTable,
  roomUserTable,
  stageTable,
  teamTable,
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
import { matchToDto } from "./match";

interface RoomUser {
  user: BrazenUser;
  team: number;
}

export interface RoomSession {
  id: number;
  matchId: string;
  marsRoomId: string;
  invitationCode: string;
  active: boolean;
}

export interface Room {
  id: number;
  stage: Stage;
  gameRule: GameRule;
  public: boolean;
  createdAt: Date;
  users: RoomUser[];
  roomSessions: RoomSession[];
  matches: Match[];
}

interface RoomUserDto {
  user: BrazenUser;
  team: number;
}

export interface RoomDto {
  id: number;
  stage: StageDto;
  gameRule: GameRuleDto;
  public: boolean;
  createdAt: number;
  users: RoomUserDto[];
  roomSessions: RoomSession[];
  matches: MatchDto[];
}

export function roomToDto(room: Room): RoomDto {
  return {
    id: room.id,
    stage: room.stage,
    gameRule: gameRuleToDto(room.gameRule),
    public: room.public,
    users: room.users,
    matches: room.matches.map(matchToDto),
    roomSessions: room.roomSessions,
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
      match: getColumns(matchTable),
      team: getColumns(teamTable),
      roomSession: getColumns(roomSessionTable),
    })
    .from(roomTable)
    .innerJoin(stageTable, eq(stageTable.id, roomTable.stageId))
    .innerJoin(
      gameRulesSubquery,
      eq(gameRulesSubquery.gameRuleId, roomTable.gameRuleId),
    )
    .leftJoin(roomUserTable, eq(roomUserTable.roomId, roomTable.id))
    .leftJoin(userTable, eq(userTable.id, roomUserTable.userId))
    .leftJoin(matchTable, eq(matchTable.roomId, roomTable.id))
    .leftJoin(teamTable, eq(teamTable.matchId, matchTable.id))
    .leftJoin(roomSessionTable, eq(roomSessionTable.roomId, roomTable.id))
    .orderBy(desc(roomTable.id));
}

function mergeRows(rows: Awaited<ReturnType<typeof getRoomsQuery>>): Room[] {
  const result = rows.reduce<Record<number, Room>>((acc, row) => {
    const { user, roomUser, match, team, roomSession, ...rest } = row;

    let room = acc[rest.id];
    if (!room) {
      room = { users: [], matches: [], roomSessions: [], ...rest };
      acc[rest.id] = room;
    }
    if (
      roomUser &&
      user &&
      !room.users.find((value) => value.user.id === user.id)
    ) {
      room.users.push({ user: user, team: roomUser.team });
    }

    if (match) {
      let existingMatch = room.matches.find((m) => m.id === match.id);
      if (!existingMatch) {
        existingMatch = { stage: room.stage, ...match, teams: [] };
        // TODO: Fetch correct stage when random stage support is added
        room.matches.push(existingMatch);
      }
      if (team && !existingMatch.teams.find((value) => value.id === team.id)) {
        existingMatch.teams.push(team);
      }
    }

    if (
      roomSession &&
      !room.roomSessions.find((value) => value.id === roomSession.id)
    ) {
      room.roomSessions.push(roomSession);
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
  stageId: number,
  gameRuleId: number,
  publicRoom: boolean,
  users: { userId: number; userKey: string; name: string; team: number }[],
): Promise<void> {
  const room: DBRoomInsert = {
    stageId: stageId,
    gameRuleId: gameRuleId,
    public: publicRoom,
  };

  const roomId = (
    await useDrizzle()
      .insert(roomTable)
      .values(room)
      .returning({ id: roomTable.id })
  )[0]?.id;
  if (roomId === undefined) {
    throw new Error("Failed to create room");
  }

  await useDrizzle()
    .insert(roomUserTable)
    .values(users.map((user) => ({ roomId: roomId, ...user })));
}

export async function openRoom(room: Room, host: DBHost): Promise<void> {
  const privateMatchRoom = await createPrivateMatchRoom(host.token);

  await openPrivateMatchRoom(host.token, privateMatchRoom.id);

  await syncPrivateMatchRoom(host.token, {
    PrivateMatchRoomId: privateMatchRoom.id,
    LeaderUserKey: host.userKey,
    Players: [{ UserKey: host.userKey }],
    Visibility: room.public ? RoomVisibility.Public : RoomVisibility.Private,
    VoiceChatSettings: 0,
    GameRuleId: room.gameRule.gameRuleId,
    StageId: room.stage.id,
    SupportItemsSettings: 0,
    RoomTagId: 1,
  });

  const sessionId = (
    await useDrizzle()
      .insert(roomSessionTable)
      .values({
        roomId: room.id,
        hostId: host.id,
        matchId: privateMatchRoom.id,
        invitationCode: privateMatchRoom.invitationCode,
        marsRoomId: privateMatchRoom.marsRoomId,
        active: true,
      })
      .returning({ id: roomTable.id })
  )[0]?.id;
  if (sessionId === undefined) {
    throw new Error("Failed to create room session");
  }

  if (!privateMatchRoom.players[0]) {
    throw new Error("No host player info found in private match room data");
  }

  await connect({
    hubRoomId: room.id,
    marsHost: privateMatchRoom.marsHost,
    marsPort: privateMatchRoom.marsPort,
    marsSessionId: privateMatchRoom.players[0].marsSessionId,
    marsRoomId: privateMatchRoom.marsRoomId,
    marsCryptKey: privateMatchRoom.marsCryptKey,
    marsToken: privateMatchRoom.players[0].marsToken,
    voiceChatClientId: privateMatchRoom.players[0].voiceChatClientId,
    voiceChatToken: privateMatchRoom.players[0].voiceChatToken,
    userKey: privateMatchRoom.players[0].userKey,
    stageId: room.stage.id,
    ruleId: room.gameRule.gameRuleId,
    hostToken: host.token,
    privateMatchRoomId: privateMatchRoom.id,
    public: room.public,
    players: room.users.map((user) => ({
      userKey: user.user.userKey,
      teamIndex: user.team,
    })),
  });
}

export async function closeRoom(id: number): Promise<void> {
  const room = await getRoomById(id);

  if (room === null) {
    return;
  }

  const activeSession = room.roomSessions.find((value) => value.active);
  if (activeSession === undefined) {
    return;
  }

  await disconnect({ marsRoomId: activeSession.marsRoomId });

  await useDrizzle()
    .update(roomSessionTable)
    .set({ active: false })
    .where(eq(roomSessionTable.id, activeSession.id));
}

export async function deleteRoomById(id: number): Promise<void> {
  await useDrizzle().delete(roomUserTable).where(eq(roomUserTable.roomId, id));
  await useDrizzle().delete(roomTable).where(eq(roomTable.id, id));
}
