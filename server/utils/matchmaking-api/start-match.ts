import { getMatchmakingApiClient } from "./client";

export interface StartMatchRequest {
  sessionId: number;
}

export interface StartMatchResponse {
  success: boolean;
  message: string;
}

export async function startMatch(
  request: StartMatchRequest,
): Promise<StartMatchResponse> {
  return getMatchmakingApiClient()<StartMatchResponse>("api/room/start-match", {
    method: "POST",
    body: request,
  });
}
