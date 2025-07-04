import { getStages } from "~~/server/utils/stage";

export default cachedEventHandler(
  async (): Promise<StageDto[]> => {
    return await getStages();
  },
  {
    maxAge: 300,
    swr: false,
  }
);
