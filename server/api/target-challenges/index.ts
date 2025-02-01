import { getRulesList, type RuleDto } from "../../utils/rule";

export default cachedEventHandler(
  async (): Promise<{ rulesets: RuleDto[] }> => {
    return {
      rulesets: await getRulesList(),
    };
  },
  {
    maxAge: 300,
    swr: false,
  }
);
