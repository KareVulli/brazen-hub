import { getColumns } from "../database/getColumns";
import {
  ruleTable,
  scoreTable,
  userTable,
  weeklyScoreTable,
  weeklyTable,
} from "../database/schema";
import { getLatestCharactersSubquery } from "./character";
import { getLatestItemsSubquery } from "./item";

export interface Score {
  place: number;
  user: BrazenUser;
  time: number;
  score: number;
  attempts: number;
  setAt: number | null;
  character: Character | null;
  subWeapon: ItemDto | null;
}

export interface DBTopScore {
  stage_name: string;
  name: string;
  score_id: number;
  weekly_id: number;
  rule_id: number;
  score: number;
  time: number;
  created_at: number;
}

export async function getTopScoresByUserId(
  userId: number
): Promise<DBTopScore[]> {
  const scores = await useDrizzle().all<DBTopScore>(sql`
    WITH cte AS (
      SELECT 
        ${scoreTable.id} as score_id, 
        ${weeklyTable.id} as weekly_id, 
        ${weeklyTable.ruleId} as rule_id, 
        ${scoreTable.score} as score, 
        ${scoreTable.time} as time, 
        ${weeklyTable.createdAt} as created_at, 
        ROW_NUMBER() OVER (
          PARTITION BY ${weeklyTable.ruleId} 
          ORDER BY 
            ${scoreTable.score} DESC, 
            ${scoreTable.time} DESC, 
            ${weeklyTable.createdAt} ASC
          ) row_number
        FROM ${scoreTable}
        LEFT JOIN ${weeklyScoreTable} ON ${weeklyScoreTable.scoreId} = ${scoreTable.id}
        LEFT JOIN ${weeklyTable} ON ${weeklyTable.id} = ${weeklyScoreTable.weeklyId}
        WHERE ${weeklyScoreTable.id} is not NULL and ${scoreTable.userId} = ${userId}
      )
    SELECT ${ruleTable.stageName} as stage_name, ${ruleTable.name} as name, cte.* 
      FROM cte
      LEFT JOIN ${ruleTable} ON ${ruleTable.id} = cte.rule_id
      WHERE cte.row_number = 1; 
  `);
  return scores;
}

export async function getTopScoresByRuleId(
  ruleId: number,
  limit: number = 100
): Promise<Score[]> {
  const scoresSubquery = useDrizzle()
    .$with("scores")
    .as(
      useDrizzle()
        .select({
          ...getColumns(scoreTable),
          rowNumber: sql<number>`ROW_NUMBER() OVER (
          PARTITION BY ${scoreTable.userId}
          ORDER BY 
            ${scoreTable.score} DESC, 
            ${scoreTable.time} DESC, 
            ${scoreTable.setAt} DESC
          )`.as("row_number"),
        })
        .from(scoreTable)
        .where(eq(scoreTable.ruleId, ruleId))
    );

  const charactersSubquery = getLatestCharactersSubquery();
  const itemsSubquery = getLatestItemsSubquery();

  const scores = await useDrizzle()
    .with(scoresSubquery, charactersSubquery, itemsSubquery)
    .select({
      ...getColumns(scoresSubquery),
      user: getColumns(userTable),
      character: getColumns(charactersSubquery),
      subWeapon: getColumns(itemsSubquery),
      place:
        sql<number>`ROW_NUMBER() OVER (ORDER BY ${scoresSubquery.score} DESC)`.as(
          "row_number"
        ),
    })
    .from(scoresSubquery)
    .innerJoin(userTable, eq(userTable.id, scoresSubquery.userId))
    .leftJoin(
      charactersSubquery,
      eq(charactersSubquery.characterId, scoresSubquery.characterId)
    )
    .leftJoin(
      itemsSubquery,
      eq(itemsSubquery.itemId, scoresSubquery.subWeaponId)
    )
    .orderBy(desc(scoresSubquery.score))
    .where(eq(scoresSubquery.rowNumber, 1))
    .limit(limit);

  return scores;
}
