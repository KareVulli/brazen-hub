import type { UserStat } from "~~/server/utils/ranking";
import { getRankingByRating } from "~~/server/utils/rating";

export default cachedEventHandler(
  async (): Promise<UserStat[]> => {
    return await getRankingByRating();
  },
  {
    maxAge: 300,
    swr: false,
  },
);
