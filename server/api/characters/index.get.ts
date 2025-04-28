import type { DetailedCharacter } from "~~/server/utils/character";

export default cachedEventHandler(
  async (): Promise<DetailedCharacter[]> => {
    return await getDetailedCharactersByGameVersion(
      process.env.NUXT_GAME_VERSION_CODE || "not-found"
    );
  },
  {
    maxAge: 60,
    swr: false,
  }
);
