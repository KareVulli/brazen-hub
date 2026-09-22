import { gameRuleToDto, getLatestGameRules } from "~~/server/utils/gameRule";

export default cachedEventHandler(
  async (): Promise<GameRuleDto[]> => {
    return (await getLatestGameRules()).map((gameRule) =>
      gameRuleToDto(gameRule),
    );
  },
  {
    maxAge: 300,
    swr: false,
  },
);
