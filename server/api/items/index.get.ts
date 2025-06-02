import type { Item } from "~~/server/utils/item";

export default cachedEventHandler(
  async (): Promise<Item[]> => {
    return await getItemsByGameVersion(
      process.env.NUXT_GAME_VERSION_CODE || "not-found"
    );
  },
  {
    maxAge: 300,
    swr: false,
  }
);
