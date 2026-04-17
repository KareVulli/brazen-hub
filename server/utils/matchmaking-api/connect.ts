import { getMatchmakingApiClient } from "./client";

export interface ConnectRequest {
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
  matchId: string;
  public: boolean;
}

export interface ConnectResponse {
  roomId: string;
  message: string;
}

export async function connect(
  request: ConnectRequest,
): Promise<ConnectResponse> {
  return await getMatchmakingApiClient()<ConnectResponse>(
    "api/room/connect",
    { method: "POST", body: request }
  );
}
