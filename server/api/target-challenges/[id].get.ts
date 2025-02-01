import { z } from "zod";
import { getRuleById } from "~~/server/utils/rule";
import { getTopScoresByRuleId, type Score } from "~~/server/utils/score";

const requestSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export default cachedEventHandler(
  async (event): Promise<{ rule: RuleDto; scores: Score[] }> => {
    const { id } = await getValidatedRouterParams(event, requestSchema.parse);

    const rule = await getRuleById(id);

    if (rule === null) {
      throw createError({
        statusCode: 404,
        message: `Did not find event with id ${id}.`,
      });
    }
    return {
      rule: rule,
      scores: await getTopScoresByRuleId(id, 100),
    };
  },
  {
    maxAge: 60,
    swr: false,
  }
);
