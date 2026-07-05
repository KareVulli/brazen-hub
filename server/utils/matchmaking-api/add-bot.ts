import { getMatchmakingApiClient } from "./client";

export interface AddBotRequest {
  marsRoomId: string;
}

export interface AddBotResponse {
  success: boolean;
  message: string;
}

export async function addBot(request: AddBotRequest): Promise<AddBotResponse> {
  return getMatchmakingApiClient()<AddBotResponse>("api/room/add-bot", {
    method: "POST",
    body: request,
  });
}
