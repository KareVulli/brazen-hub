import type { UserKDRStat } from "~~/server/utils/ranking";

export default cachedEventHandler(
  async (): Promise<UserKDRStat[]> => {
    return await getRankingByKDR();
  },
  {
    maxAge: 300,
    swr: false,
  },
);
