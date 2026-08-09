import { getMatchmakingApiClient } from "./client";

export interface ConnectWatcherRequest {
  hubSessionId: number;
  userKey: string;
  hostToken: string;
  privateMatchRoomId: string;
}

export async function connectWatcher(
  request: ConnectWatcherRequest,
): Promise<void> {
  await getMatchmakingApiClient()("api/watcher/connect", {
    method: "POST",
    body: request,
  });
}
