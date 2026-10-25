import type { UserStat } from "~~/server/utils/ranking";

export default cachedEventHandler(
  async (): Promise<UserStat[]> => {
    return await getRankingByAKR();
  },
  {
    maxAge: 300,
    swr: false,
  },
);
