import { brazenMessagePackApiRequest } from "./client";
import type { BrazenAPIUser } from "./models/apiUser";

interface PrivateMatchRoomCreateDto {
  PrivateMatchRoom: PrivateMatchRoomDto;
}

interface PrivateMatchRoomDto {
  PrivateMatchRoomId: string;
  LeaderUserKey: string;
  Players: PrivateMatchRoomPlayerDto[];
  State: string;
  RoomTagId: number;
  InvitationCode: string;
}

interface PrivateMatchRoomPlayerDto {
  UserKey: string;
  UserState: string;
  Profile: PrivateMatchRoomPlayerProfileDto;
  PlayZone: string;
}

interface PrivateMatchRoomPlayerProfileDto {
  Badge01Id: number;
  Badge02Id: number;
  Badge03Id: number;
  BannerId: number;
  DisplayPlayerGrade: boolean;
  IconFrameId: number;
  IconId: number;
  Name: string;
}

export interface BrazenAPIRoom {
  id: string;
  leaderUserKey: string;
  state: string;
  invitationCode: string;
  players: BrazenAPIUser[];
}

function brazenApiRoomFromDto(user: PrivateMatchRoomCreateDto): BrazenAPIRoom {
  return {
    id: user.PrivateMatchRoom.PrivateMatchRoomId,
    leaderUserKey: user.PrivateMatchRoom.LeaderUserKey,
    state: user.PrivateMatchRoom.State,
    invitationCode: user.PrivateMatchRoom.InvitationCode,
    players: user.PrivateMatchRoom.Players.map((player) => ({
      name: player.Profile.Name,
      userKey: player.UserKey,
      iconId: player.Profile.IconId,
      iconFrameId: player.Profile.IconFrameId,
    })),
  };
}

async function createRoomRequest(
  token: string
): Promise<PrivateMatchRoomCreateDto> {
  return await brazenMessagePackApiRequest<PrivateMatchRoomCreateDto>(
    "match/v1/private_match_room/create",
    "POST",
    {
      Authorization: `Bearer ${token}`,
    },
    { PlayZone: "us", Latency: 100 }
  );
}

export async function createPrivateMatchRoom(
  token: string
): Promise<BrazenAPIRoom> {
  return brazenApiRoomFromDto(await createRoomRequest(token));
}
