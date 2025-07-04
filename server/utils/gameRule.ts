import { getColumns } from "../database/getColumns";
import { gameRuleTable } from "../database/schema/gameRule";
import type { DBGameRule } from "./drizzle";

export interface GameRuleDto {
  id: number;
  ruleDetailsId: number;
  name: string;
  description: string;
  gameDescription: string;
  teamCount: number;
  minTeamCount: number;
  playersPerTeam: number;
  killUltimateBonus: number;
  teammateDeathUltimateBonus: number;
  ultimateRate: number;
  gameRuleType: string;
  collapseTime1: number;
  collapseTime2: number;
  collapseTime3: number;
  collapseTime4: number;
  collapseTime5: number;
  collapseTimeAll: number;
  collapseSteps: number;
}

export interface GameRule {
  id: number;
  gameVersion: string;
  gameRuleId: number;
  ruleDetailsId: number;
  name: string;
  description: string;
  gameDescription: string;
  teamCount: number;
  minTeamCount: number;
  playersPerTeam: number;
  killUltimateBonus: number;
  teammateDeathUltimateBonus: number;
  ultimateRate: number;
  gameRuleType: string;
  collapseTime1: number;
  collapseTime2: number;
  collapseTime3: number;
  collapseTime4: number;
  collapseTime5: number;
  collapseTimeAll: number;
  collapseSteps: number;
}

export function gameRuleToDto(gameRule: GameRule): GameRuleDto {
  return {
    id: gameRule.gameRuleId,
    ruleDetailsId: gameRule.ruleDetailsId,
    name: gameRule.name,
    description: gameRule.description,
    gameDescription: gameRule.gameDescription,
    teamCount: gameRule.teamCount,
    minTeamCount: gameRule.minTeamCount,
    playersPerTeam: gameRule.playersPerTeam,
    killUltimateBonus: gameRule.killUltimateBonus,
    teammateDeathUltimateBonus: gameRule.teammateDeathUltimateBonus,
    ultimateRate: gameRule.ultimateRate,
    gameRuleType: gameRule.gameRuleType,
    collapseTime1: gameRule.collapseTime1,
    collapseTime2: gameRule.collapseTime2,
    collapseTime3: gameRule.collapseTime3,
    collapseTime4: gameRule.collapseTime4,
    collapseTime5: gameRule.collapseTime5,
    collapseTimeAll: gameRule.collapseTimeAll,
    collapseSteps: gameRule.collapseSteps,
  };
}

export async function replaceGameRulesInDB(
  gameVersion: string,
  gameRules: GameRuleDto[]
) {
  await useDrizzle()
    .delete(gameRuleTable)
    .where(eq(gameRuleTable.gameVersion, gameVersion));
  for (let i = 0; i < gameRules.length; i++) {
    const gameRule = gameRules[i];
    await writeGameRuleToDB(gameVersion, gameRule);
  }
}

export async function writeGameRuleToDB(
  gameVersion: string,
  gameRuleDto: GameRuleDto
) {
  await useDrizzle().insert(gameRuleTable).values({
    gameVersion: gameVersion,
    gameRuleId: gameRuleDto.id,
    ruleDetailsId: gameRuleDto.ruleDetailsId,
    name: gameRuleDto.name,
    description: gameRuleDto.description,
    gameDescription: gameRuleDto.gameDescription,
    teamCount: gameRuleDto.teamCount,
    minTeamCount: gameRuleDto.minTeamCount,
    playersPerTeam: gameRuleDto.playersPerTeam,
    killUltimateBonus: gameRuleDto.killUltimateBonus,
    teammateDeathUltimateBonus: gameRuleDto.teammateDeathUltimateBonus,
    ultimateRate: gameRuleDto.ultimateRate,
    gameRuleType: gameRuleDto.gameRuleType,
    collapseTime1: gameRuleDto.collapseTime1,
    collapseTime2: gameRuleDto.collapseTime2,
    collapseTime3: gameRuleDto.collapseTime3,
    collapseTime4: gameRuleDto.collapseTime4,
    collapseTime5: gameRuleDto.collapseTime5,
    collapseTimeAll: gameRuleDto.collapseTimeAll,
    collapseSteps: gameRuleDto.collapseSteps,
  });
}

export function gameRuleFromDB(gameRule: DBGameRule): GameRule {
  return {
    id: gameRule.id,
    gameVersion: gameRule.gameVersion,
    gameRuleId: gameRule.gameRuleId,
    ruleDetailsId: gameRule.ruleDetailsId,
    name: gameRule.name,
    description: gameRule.description,
    gameDescription: gameRule.gameDescription,
    teamCount: gameRule.teamCount,
    minTeamCount: gameRule.minTeamCount,
    playersPerTeam: gameRule.playersPerTeam,
    killUltimateBonus: gameRule.killUltimateBonus,
    teammateDeathUltimateBonus: gameRule.teammateDeathUltimateBonus,
    ultimateRate: gameRule.ultimateRate,
    gameRuleType: gameRule.gameRuleType,
    collapseTime1: gameRule.collapseTime1,
    collapseTime2: gameRule.collapseTime2,
    collapseTime3: gameRule.collapseTime3,
    collapseTime4: gameRule.collapseTime4,
    collapseTime5: gameRule.collapseTime5,
    collapseTimeAll: gameRule.collapseTimeAll,
    collapseSteps: gameRule.collapseSteps,
  };
}

export async function getGameRuleByGameRuleId(
  gameRuleId: number
): Promise<GameRule | null> {
  const dbGameRule = await useDrizzle().query.gameRuleTable.findFirst({
    where: eq(gameRuleTable.gameRuleId, gameRuleId),
    orderBy: [desc(gameRuleTable.gameVersion)],
  });
  if (dbGameRule) {
    return gameRuleFromDB(dbGameRule);
  }
  return null;
}

async function getDBGameRulesByGameVersion(
  gameVersion: string | number
): Promise<DBGameRule[]> {
  return await useDrizzle().query.gameRuleTable.findMany({
    where: eq(gameRuleTable.gameVersion, gameVersion + ""),
    orderBy: [asc(gameRuleTable.gameRuleId)],
  });
}

export async function getGameRulesByGameVersion(
  gameVersion: string | number
): Promise<GameRule[]> {
  const dbGameRules = await getDBGameRulesByGameVersion(gameVersion);
  return dbGameRules.map((gameRule) => gameRuleFromDB(gameRule));
}

export function getLatestGameRulesSubquery() {
  const subQuery = useDrizzle()
    .$with("gamerules_with_row_number")
    .as(
      useDrizzle()
        .select({
          ...getColumns(gameRuleTable),
          rowNumber: sql<number>`ROW_NUMBER() OVER (
          PARTITION BY ${gameRuleTable.gameRuleId}
          ORDER BY ${gameRuleTable.gameVersion} DESC
        )`.as("row_number"),
        })
        .from(gameRuleTable)
    );

  const { rowNumber, ...subQueryColumns } = getColumns(subQuery);
  return useDrizzle()
    .$with("latest_gamerules")
    .as(
      useDrizzle()
        .with(subQuery)
        .select(subQueryColumns)
        .from(subQuery)
        .where(eq(subQuery.rowNumber, 1))
    );
}
