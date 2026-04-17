export interface BrazenAPIRoom {
  id: string;
  leaderUserKey: string;
  state: string;
  invitationCode: string;
  players: BrazenAPIRoomUser[];
  marsHost: string;
  marsPort: number;
  marsRoomId: string;
  marsCryptKey: string;
  marsHostUserKey: string;
}

export interface BrazenAPIRoomUser extends BrazenAPIUser {
  marsToken: string;
  marsSessionId: number;
  voiceChatClientId: string;
  voiceChatToken: string;
  userState: string;
}
