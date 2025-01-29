import { z } from "zod";
import { checkAllowedToUpdate } from "~~/server/utils/auth";
import {
  replaceGameRulesInDB,
  type GameRuleDto,
} from "~~/server/utils/gameRule";
import type { ItemDto } from "~~/server/utils/item";
import type { StageDto } from "~~/server/utils/stage";
import { replaceStagesInDB } from "~~/server/utils/stage";
import type { CharacterDto } from "../../utils/character";
import type { RuleDto } from "../../utils/rule";
import { replaceRulesInDB } from "../../utils/rule";

const ruleSchema = z.object({
  id: z.coerce.number().positive().int(),
  name: z.string(),
  colorCode: z.string(),
  ruleId: z.coerce.number().positive().int(),
  subRuleId: z.coerce.number().positive().int(),
  stageId: z.coerce.number().positive().int(),
  stageName: z.string(),
  stageThumbnail: z.string(),
  subRuleType: z.string(),
}) satisfies z.ZodType<RuleDto>;

const characterSchema = z.object({
  id: z.coerce.number().positive().int(),
  name: z.string(),
  displayName: z.string(),
  hp: z.coerce.number().positive().int(),
  largeIconName: z.string(),
  boostRecovery: z.coerce.number(),
  boostMax: z.coerce.number(),
  skillName: z.string(),
  skillDescription: z.string(),
  skillRange: z.coerce.number(),
  skillRecastTime: z.coerce.number(),
  ultimateName: z.string(),
  ultimateDescription: z.string(),
  ultimateRange: z.coerce.number(),
  ultimatePoints: z.coerce.number().int(),
  ultimatePointsDamageMultiplier: z.coerce.number(),
  ultimatePointsAttackMultiplier: z.coerce.number(),
}) satisfies z.ZodType<CharacterDto>;

const itemSchema = z.object({
  id: z.coerce.number().positive().int(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  hudIcon: z.string(),
  count: z.coerce.number().int(),
}) satisfies z.ZodType<ItemDto>;

const gameRuleSchema = z.object({
  id: z.coerce.number().positive().int(),
  ruleDetailsId: z.coerce.number().nonnegative().int(),
  name: z.string(),
  description: z.string(),
  gameDescription: z.string(),
  teamCount: z.coerce.number().nonnegative().int(),
  minTeamCount: z.coerce.number().nonnegative().int(),
  playersPerTeam: z.coerce.number().nonnegative().int(),
  killUltimateBonus: z.coerce.number().nonnegative().int(),
  teammateDeathUltimateBonus: z.coerce.number().nonnegative().int(),
  ultimateRate: z.coerce.number(),
  gameRuleType: z.string(),
  collapseTime1: z.coerce.number().nonnegative().int(),
  collapseTime2: z.coerce.number().nonnegative().int(),
  collapseTime3: z.coerce.number().nonnegative().int(),
  collapseTime4: z.coerce.number().nonnegative().int(),
  collapseTime5: z.coerce.number().nonnegative().int(),
  collapseTimeAll: z.coerce.number().nonnegative().int(),
  collapseSteps: z.coerce.number().nonnegative().int(),
}) satisfies z.ZodType<GameRuleDto>;

const stageSchema = z.object({
  id: z.coerce.number().positive().int(),
  name: z.string(),
  description: z.string(),
  thumbnailName: z.string(),
}) satisfies z.ZodType<StageDto>;

const requestSchema = z.object({
  gameVersion: z.string(),
  soloRules: z.array(ruleSchema),
  characters: z.array(characterSchema),
  items: z.array(itemSchema),
  rules: z.array(gameRuleSchema),
  stages: z.array(stageSchema),
});
export default eventHandler(async (event): Promise<void> => {
  checkAllowedToUpdate(event);
  const staticData = await readValidatedBody(event, requestSchema.parse);
  await replaceRulesInDB(staticData.soloRules);
  await replaceCharactersInDB(staticData.gameVersion, staticData.characters);
  await replaceitemsInDB(staticData.gameVersion, staticData.items);
  await replaceGameRulesInDB(staticData.gameVersion, staticData.rules);
  await replaceStagesInDB(staticData.stages);
});
