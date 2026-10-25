export default cachedEventHandler(
  async (): Promise<UserWLRStat[]> => {
    return await getRankingByWLR();
  },
  {
    maxAge: 300,
    swr: false,
  },
);
