import { getMatchmakingApiClient } from "./client";

export interface DisconnectRequest {
  marsRoomId: string;
}

export interface DisconnectResponse {
  message: string;
}

export async function disconnect(
  request: DisconnectRequest,
): Promise<DisconnectResponse> {
  return getMatchmakingApiClient()<DisconnectResponse>(
    "api/room/disconnect",
    {method: "POST", body: request}
  );
}
