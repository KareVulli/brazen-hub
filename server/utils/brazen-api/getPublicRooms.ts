import { getBrazenApiClient } from "./client";

export interface BrazenApiPublicRoom {
  roomId: string;
  invitationCode: string;
  state: "active" | "closed";
  maxPlayers: number;
  playerCount: number;
  visibility: number;
  stageId: number;
  gameRuleId: number;
  voiceEnabled: boolean;
  supportItems: boolean;
  createdByUserKey: string;
  createdByUserName: string;
  createdAt: number;
}

interface BrazenApiPublicRoomDto {
  private_match_room_id: string;
  invitation_code: string;
  state: "active" | "closed";
  capacity: number;
  players_count: number;
  visibility: number;
  stage_id: number;
  game_rule_id: number;
  room_tag_id: number;
  voice_chat_settings: number;
  support_items_settings: number;
  leader_user_key: string;
  leader_user_name: string;
  created_at: number;
}

interface PublicRoomsDto {
  rooms: BrazenApiPublicRoomDto[];
}

function publicRoomsFromDto(
  publicRooms: PublicRoomsDto
): BrazenApiPublicRoom[] {
  return publicRooms.rooms.map((room) => ({
    roomId: room.private_match_room_id,
    invitationCode: room.invitation_code,
    state: room.state,
    maxPlayers: room.capacity,
    playerCount: room.players_count,
    visibility: room.visibility,
    stageId: room.stage_id,
    gameRuleId: room.game_rule_id,
    voiceEnabled: room.voice_chat_settings === 0,
    supportItems: room.support_items_settings === 1,
    createdByUserKey: room.leader_user_key,
    createdByUserName: room.leader_user_name,
    createdAt: room.created_at,
  }));
}

export async function getPublicRooms(
  token: string
): Promise<BrazenApiPublicRoom[]> {
  const response = await getBrazenApiClient()<PublicRoomsDto>(
    "match/v1/private_match_room/list_public_rooms",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return publicRoomsFromDto(response);
}
