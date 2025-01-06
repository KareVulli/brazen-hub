import { z } from "zod";
import { checkAllowedToUpdate } from "~~/server/utils/auth";
import type { RuleDto } from "../../utils/rule";
import { replaceRulesInDB } from "../../utils/rule";
import type { CharacterDto } from "../../utils/character";
import type { ItemDto } from "~~/server/utils/item";

const ruleSchema = z.object({
  id: z.coerce.number().positive().int(),
  name: z.coerce.string(),
  colorCode: z.coerce.string(),
  ruleId: z.coerce.number().positive().int(),
  subRuleId: z.coerce.number().positive().int(),
  stageId: z.coerce.number().positive().int(),
  stageName: z.coerce.string(),
  stageThumbnail: z.coerce.string(),
  subRuleType: z.coerce.string(),
}) satisfies z.ZodType<RuleDto>;

const characterSchema = z.object({
  id: z.coerce.number().positive().int(),
  name: z.coerce.string(),
  displayName: z.coerce.string(),
  hp: z.coerce.number().positive().int(),
  largeIconName: z.coerce.string(),
  boostRecovery: z.coerce.number(),
  boostMax: z.coerce.number(),
  skillName: z.coerce.string(),
  skillDescription: z.coerce.string(),
  skillRange: z.coerce.number(),
  skillRecastTime: z.coerce.number(),
  ultimateName: z.coerce.string(),
  ultimateDescription: z.coerce.string(),
  ultimateRange: z.coerce.number(),
  ultimatePoints: z.coerce.number().int(),
  ultimatePointsDamageMultiplier: z.coerce.number(),
  ultimatePointsAttackMultiplier: z.coerce.number(),
}) satisfies z.ZodType<CharacterDto>;

const itemSchema = z.object({
  id: z.coerce.number().positive().int(),
  name: z.coerce.string(),
  description: z.coerce.string(),
  icon: z.coerce.string(),
  hudIcon: z.coerce.string(),
  count: z.coerce.number().int(),
}) satisfies z.ZodType<ItemDto>;

const requestSchema = z.object({
  gameVersion: z.coerce.string(),
  soloRules: z.array(ruleSchema),
  characters: z.array(characterSchema),
  items: z.array(itemSchema),
});
export default eventHandler(async (event): Promise<void> => {
  checkAllowedToUpdate(event);
  const staticData = await readValidatedBody(event, requestSchema.parse);
  await replaceRulesInDB(staticData.soloRules);
  await replaceCharactersInDB(staticData.gameVersion, staticData.characters);
  await replaceitemsInDB(staticData.gameVersion, staticData.items);
});
