import type { RTMLeaderboard } from "~~/server/utils/static-api/getWeeklyLeaderboard";
import { getWeeklyLeaderboard } from "~~/server/utils/static-api/getWeeklyLeaderboard";

export default cachedEventHandler(
  async (): Promise<RTMLeaderboard> => {
    return await getWeeklyLeaderboard();
  },
  {
    maxAge: 60,
    swr: false,
  }
);
