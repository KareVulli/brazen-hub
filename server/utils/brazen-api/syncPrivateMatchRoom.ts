import { brazenMessagePackApiRequest } from "./client";
import type { PrivateMatchRoomDto } from "./dtos/privateMatchRoomDto";
import { brazenApiRoomFromPrivateMatchRoomDto } from "./dtos/privateMatchRoomDto";

export enum RoomVisibility {
  Private = 0,
  Public = 1,
}

interface PrivateMatchRoomSyncDto {
  KickedUserKeys: string[];
  PrivateMatchRoom: PrivateMatchRoomDto;
}

export interface SyncRoomRequest {
  PrivateMatchRoomId: string;
  LeaderUserKey: string;
  Players: { UserKey: string }[];
  Visibility?: RoomVisibility;
  VoiceChatSettings?: number;
  GameRuleId?: number;
  StageId?: number;
  SupportItemsSettings?: number;
  RoomTagId?: number;
}

async function syncRoomRequest(
  token: string,
  request: SyncRoomRequest
): Promise<PrivateMatchRoomSyncDto> {
  return await brazenMessagePackApiRequest<PrivateMatchRoomSyncDto>(
    "match/v1/private_match_room/sync_status",
    "POST",
    { Authorization: `Bearer ${token}` },
    request
  );
}

export async function syncPrivateMatchRoom(
  token: string,
  request: SyncRoomRequest
): Promise<BrazenAPIRoom> {
  return brazenApiRoomFromPrivateMatchRoomDto(
    (await syncRoomRequest(token, request)).PrivateMatchRoom
  );
}
