import type { UserStat } from "~~/server/utils/ranking";
import { getRankingByADR } from "~~/server/utils/ranking";

export default cachedEventHandler(
  async (): Promise<UserStat[]> => {
    return await getRankingByADR();
  },
  {
    maxAge: 300,
    swr: false,
  },
);
