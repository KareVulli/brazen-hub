export interface PrivateMatchRoomDto {
  PrivateMatchRoomId: string;
  LeaderUserKey: string;
  Players: PrivateMatchRoomPlayerDto[];
  State: string;
  RoomTagId: number;
  InvitationCode: string;
}

export interface PrivateMatchRoomPlayerDto {
  UserKey: string;
  UserState: string;
  Profile: PrivateMatchRoomPlayerProfileDto;
  PlayZone: string;
}

export interface PrivateMatchRoomPlayerProfileDto {
  Badge01Id: number;
  Badge02Id: number;
  Badge03Id: number;
  BannerId: number;
  DisplayPlayerGrade: boolean;
  IconFrameId: number;
  IconId: number;
  Name: string;
}

export function brazenApiRoomFromPrivateMatchRoomDto(
  response: PrivateMatchRoomDto
): BrazenAPIRoom {
  return {
    id: response.PrivateMatchRoomId,
    leaderUserKey: response.LeaderUserKey,
    state: response.State,
    invitationCode: response.InvitationCode,
    players: response.Players.map((player) => ({
      name: player.Profile.Name,
      userKey: player.UserKey,
      iconId: player.Profile.IconId,
      iconFrameId: player.Profile.IconFrameId,
    })),
  };
}
