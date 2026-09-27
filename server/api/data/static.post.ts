import { z } from "zod";
import type { AdditionalEffectDto } from "~~/server/utils/additionalEffect";
import { replaceAdditionalEffectsInDB } from "~~/server/utils/additionalEffect";
import { checkAllowedToUpdate } from "~~/server/utils/auth";
import type { GameRuleDto } from "~~/server/utils/gameRule";
import { replaceGameRulesInDB } from "~~/server/utils/gameRule";
import type { ItemDto } from "~~/server/utils/item";
import type { StageDto } from "~~/server/utils/stage";
import { replaceStagesInDB } from "~~/server/utils/stage";
import type { DetailedCharacterDto } from "../../utils/character";
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
  punchDamage: z.coerce.number().int().nullable(),
  passivePunchDamage: z.coerce.number().int().nullable(),
  boostPunchDamage: z.coerce.number().int().nullable(),
}) satisfies z.ZodType<DetailedCharacterDto>;

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

const additionalEffectSchema = z.object({
  id: z.coerce.number().positive().int(),
  categoryType: z.string(),
  additionalEffectType: z.string(),
  enchantGroup: z.string(),
  priority: z.coerce.number().int(),
  validStun: z.boolean(),
  validFinisher: z.boolean(),
  cancelCondition: z.string(),
  assetName: z.string(),
  time: z.coerce.number(),
  val1: z.coerce.number().int(),
  val2: z.coerce.number().int(),
  val3: z.coerce.number().int(),
  val4: z.coerce.number().int(),
}) satisfies z.ZodType<AdditionalEffectDto>;

const requestSchema = z.object({
  gameVersion: z.string(),
  soloRules: z.array(ruleSchema),
  characters: z.array(characterSchema),
  items: z.array(itemSchema),
  rules: z.array(gameRuleSchema),
  stages: z.array(stageSchema),
  additionalEffects: z.array(additionalEffectSchema),
});

export default eventHandler(async (event): Promise<void> => {
  await checkAllowedToUpdate(event);
  const staticData = await readValidatedBody(event, requestSchema.parse);
  await replaceRulesInDB(staticData.soloRules);
  await replaceCharactersInDB(staticData.gameVersion, staticData.characters);
  await replaceitemsInDB(staticData.gameVersion, staticData.items);
  await replaceGameRulesInDB(staticData.gameVersion, staticData.rules);
  await replaceStagesInDB(staticData.stages);
  await replaceAdditionalEffectsInDB(
    staticData.gameVersion,
    staticData.additionalEffects,
  );
});
