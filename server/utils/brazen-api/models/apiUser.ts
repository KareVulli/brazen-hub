export interface BrazenAPIUser {
  name: string;
  userKey: string;
  iconId: number;
  iconFrameId: number;
}

export interface BrazenAPIDetailedUser extends BrazenAPIUser {
  online: boolean;
  updatedAt: number;
}
