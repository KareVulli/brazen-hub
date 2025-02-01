import { ruleTable } from "../database/schema";

export interface RuleDto {
  id: number;
  name: string;
  colorCode: string;
  ruleId: number;
  subRuleId: number;
  stageId: number;
  stageName: string;
  stageThumbnail: string;
  subRuleType: string;
}

export async function getRulesList(): Promise<RuleDto[]> {
  return await useDrizzle().query.ruleTable.findMany({
    orderBy: [desc(ruleTable.name), desc(ruleTable.stageId)],
  });
}

export async function getRuleById(id: number): Promise<RuleDto | null> {
  return (
    (await useDrizzle().query.ruleTable.findFirst({
      where: eq(ruleTable.id, id),
    })) || null
  );
}

export async function replaceRulesInDB(rules: RuleDto[]) {
  await useDrizzle().delete(ruleTable);
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    await writeRuleToDB(rule);
  }
}

export async function writeRuleToDB(rule: RuleDto) {
  await useDrizzle().insert(ruleTable).values({
    id: rule.id,
    name: rule.name,
    colorCode: rule.colorCode,
    ruleId: rule.ruleId,
    subRuleId: rule.subRuleId,
    stageId: rule.stageId,
    stageName: rule.stageName,
    stageThumbnail: rule.stageThumbnail,
    subRuleType: rule.subRuleType,
  });
}
