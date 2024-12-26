import { z } from "zod";
import { checkAllowedToUpdate } from "~~/server/utils/auth";
import type { RuleDto } from "../../utils/rule";
import { replaceRulesInDB } from "../../utils/rule";

const ruleSchema = z.object({
  id: z.coerce.number().positive().int(),
  name: z.coerce.string(),
  colorCode: z.coerce.string(),
  ruleId: z.coerce.number().positive().int(),
  subRuleId: z.coerce.number().positive().int(),
  stageId: z.coerce.number().positive().int(),
  stageName: z.coerce.string(),
  subRuleType: z.coerce.string(),
}) satisfies z.ZodType<RuleDto>;

const requestSchema = z.object({
  soloRules: z.array(ruleSchema),
});
export default eventHandler(async (event): Promise<void> => {
  checkAllowedToUpdate(event);
  const rules = await readValidatedBody(event, requestSchema.parse);
  replaceRulesInDB(rules.soloRules);
});
