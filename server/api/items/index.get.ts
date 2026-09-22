import { getLatestItems, type Item } from "~~/server/utils/item";

export default cachedEventHandler(
  async (): Promise<Item[]> => {
    return await getLatestItems();
  },
  {
    maxAge: 300,
    swr: false,
  },
);
