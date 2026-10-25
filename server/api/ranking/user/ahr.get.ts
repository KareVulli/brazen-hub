export default cachedEventHandler(
  async (): Promise<UserHealingStat[]> => {
    return await getRankingByAHR();
  },
  {
    maxAge: 300,
    swr: false,
  },
);
