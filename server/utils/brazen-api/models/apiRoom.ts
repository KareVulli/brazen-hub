export interface BrazenAPIRoom {
  id: string;
  leaderUserKey: string;
  state: string;
  invitationCode: string;
  players: BrazenAPIUser[];
}
