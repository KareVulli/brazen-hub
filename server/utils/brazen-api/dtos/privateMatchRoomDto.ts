export interface PrivateMatchRoomDto {
  PrivateMatchRoomId: string;
  LeaderUserKey: string;
  Players: PrivateMatchRoomPlayerDto[];
  State: string;
  RoomTagId: number;
  InvitationCode: string;
  MarsRoom: RoomInfoDto;
}

export interface RoomInfoDto {
  RoomId: string;
  MarsId: string;
  MarsHost: string;
  MarsPort: number;
  RoomType: string;
  MarsCryptKey: string;
  HostUserKey: string;
  CreatedAt: number;
}

export interface PrivateMatchRoomPlayerDto {
  UserKey: string;
  UserState: string;
  Profile: PrivateMatchRoomPlayerProfileDto;
  PlayZone: string;
  MarsToken: string;
  MarsSessionId: number;
  VoiceChatClientId: string;
  VoiceChatToken: string;
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
    marsCryptKey: response.MarsRoom.MarsCryptKey,
    marsHost: response.MarsRoom.MarsHost,
    marsPort: response.MarsRoom.MarsPort,
    marsRoomId: response.MarsRoom.RoomId,
    marsHostUserKey: response.MarsRoom.HostUserKey,
    players: response.Players.map((player) => ({
      name: player.Profile.Name,
      userKey: player.UserKey,
      userState: player.UserState,
      iconId: player.Profile.IconId,
      iconFrameId: player.Profile.IconFrameId,
      marsSessionId: player.MarsSessionId,
      marsToken: player.MarsToken,
      voiceChatClientId: player.VoiceChatClientId,
      voiceChatToken: player.VoiceChatToken
    })),
  };
}
