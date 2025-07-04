import {
  gameRuleToDto,
  getGameRulesByGameVersion,
} from "~~/server/utils/gameRule";

export default cachedEventHandler(
  async (): Promise<GameRuleDto[]> => {
    return (
      await getGameRulesByGameVersion(
        process.env.NUXT_GAME_VERSION_CODE || "not-found"
      )
    ).map((gameRule) => gameRuleToDto(gameRule));
  },
  {
    maxAge: 300,
    swr: false,
  }
);
