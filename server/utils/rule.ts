export interface RuleDto {
  id: number;
  name: string;
  colorCode: string;
  ruleId: number;
  subRuleId: number;
  stageId: number;
  stageName: string;
  subRuleType: string;
}

export async function replaceRulesInDB(rules: RuleDto[]) {
  await useDrizzle().delete(tables.rule);
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    await writeRuleToDB(rule);
  }
}

export async function writeRuleToDB(rule: RuleDto) {
  await useDrizzle().insert(tables.rule).values({
    id: rule.id,
    name: rule.name,
    colorCode: rule.colorCode,
    ruleId: rule.ruleId,
    subRuleId: rule.subRuleId,
    stageId: rule.stageId,
    stageName: rule.stageName,
    subRuleType: rule.subRuleType,
  });
}
