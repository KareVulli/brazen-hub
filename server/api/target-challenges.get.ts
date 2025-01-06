import { ruleTable } from "../database/schema";
import type { RuleDto } from "../utils/rule";

export default cachedEventHandler(
  async (): Promise<{ rulesets: RuleDto[] }> => {
    return {
      rulesets: await useDrizzle().query.ruleTable.findMany({
        orderBy: [desc(ruleTable.name), desc(ruleTable.stageId)],
      }),
    };
  },
  {
    maxAge: 300,
    swr: false,
  }
);
