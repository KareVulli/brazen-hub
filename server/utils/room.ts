import { getColumns } from "../database/getColumns";
import { roomTable, stageTable } from "../database/schema";
import type { DBRoomInsert } from "./drizzle";
import {
  gameRuleToDto,
  getLatestGameRulesSubquery,
  type GameRuleDto,
} from "./gameRule";
import type { StageDto } from "./stage";

export interface Room {
  id: number;
  matchId: string;
  stage: Stage;
  gameRule: GameRule;
  public: boolean;
  invitationCode: string;
  createdAt: Date;
}

export interface RoomDto {
  id: number;
  matchId: string;
  stage: StageDto;
  gameRule: GameRuleDto;
  public: boolean;
  invitationCode: string;
  createdAt: number;
}

export function roomToDto(room: Room): RoomDto {
  return {
    id: room.id,
    matchId: room.matchId,
    stage: room.stage,
    gameRule: gameRuleToDto(room.gameRule),
    public: room.public,
    invitationCode: room.invitationCode,
    createdAt: Math.floor(room.createdAt.getTime() / 1000),
  };
}

export async function getRooms(): Promise<Room[]> {
  const gameRulesSubquery = getLatestGameRulesSubquery();
  return await useDrizzle()
    .with(gameRulesSubquery)
    .select({
      ...getColumns(roomTable),
      gameRule: getColumns(gameRulesSubquery),
      stage: getColumns(stageTable),
    })
    .from(roomTable)
    .innerJoin(stageTable, eq(stageTable.id, roomTable.stageId))
    .innerJoin(
      gameRulesSubquery,
      eq(gameRulesSubquery.gameRuleId, roomTable.gameRuleId)
    )
    .orderBy(desc(roomTable.id));
}

export async function createRoom(room: DBRoomInsert): Promise<void> {
  await useDrizzle().insert(roomTable).values(room);
}

export async function deleteRoomById(id: number): Promise<void> {
  await useDrizzle().delete(roomTable).where(eq(roomTable.id, id));
}
