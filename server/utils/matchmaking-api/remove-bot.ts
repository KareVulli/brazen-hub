import { getMatchmakingApiClient } from "./client";

export interface RemoveBotRequest {
  marsRoomId: string;
}

export interface RemoveBotResponse {
  success: boolean;
  message: string;
}

export async function removeBot(
  request: RemoveBotRequest,
): Promise<RemoveBotResponse> {
  return getMatchmakingApiClient()<RemoveBotResponse>("api/room/remove-bot", {
    method: "POST",
    body: request,
  });
}
