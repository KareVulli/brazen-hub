import {
  ruleTable,
  scoreTable,
  weeklyScoreTable,
  weeklyTable,
} from "../database/schema";

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
