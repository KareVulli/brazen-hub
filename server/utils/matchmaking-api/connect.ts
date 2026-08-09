import { getMatchmakingApiClient } from "./client";

export interface ConnectRequest {
  hubSessionId: number;
  marsHost: string;
  marsPort: number;
  marsSessionId: number;
  marsRoomId: string;
  marsCryptKey: string;
  marsToken: string;
  voiceChatClientId: string;
  voiceChatToken: string;
  userKey: string;
  stageId: number;
  ruleId: number;
  hostToken: string;
  privateMatchRoomId: string;
  public: boolean;
  players: { userKey: string; teamIndex: number }[];
}

export async function connect(request: ConnectRequest): Promise<void> {
  await getMatchmakingApiClient()("api/room/connect", {
    method: "POST",
    body: request,
  });
}
