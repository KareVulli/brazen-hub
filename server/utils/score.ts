import { isNull } from "drizzle-orm";
import { getColumns } from "../database/getColumns";
import { ruleTable, scoreTable, userTable } from "../database/schema";
import { getLatestCharactersSubquery } from "./character";
import type { DBScoreInsert } from "./drizzle";
import { getLatestItemsSubquery } from "./item";
import type { RuleDto } from "./rule";

export interface Score extends BaseScore {
  place: number;
  user: BrazenUser;
}

export interface UserScore extends BaseScore {
  rule: RuleDto;
}

export interface CustomScore extends BaseScore {
  rule: RuleDto;
  user: BrazenUser;
}

export interface BaseScore {
  time: number;
  score: number;
  attempts: number;
  setAt: number | null;
  character: Character | null;
  subWeapon: ItemDto | null;
}

export async function getUserTopScores(userId: number): Promise<UserScore[]> {
  const scoresSubquery = useDrizzle()
    .$with("scores")
    .as(
      useDrizzle()
        .select({
          ...getColumns(scoreTable),
          rowNumber: sql<number>`ROW_NUMBER() OVER (
          PARTITION BY ${scoreTable.ruleId}
          ORDER BY 
            ${scoreTable.score} DESC, 
            ${scoreTable.time} DESC, 
            ${scoreTable.setAt} DESC
          )`.as("row_number"),
        })
        .from(scoreTable)
        .where(eq(scoreTable.userId, userId))
    );

  const charactersSubquery = getLatestCharactersSubquery();
  const itemsSubquery = getLatestItemsSubquery();

  const scores = await useDrizzle()
    .with(scoresSubquery, charactersSubquery, itemsSubquery)
    .select({
      ...getColumns(scoresSubquery),
      character: getColumns(charactersSubquery),
      subWeapon: getColumns(itemsSubquery),
      rule: getColumns(ruleTable),
    })
    .from(scoresSubquery)
    .leftJoin(
      charactersSubquery,
      eq(charactersSubquery.characterId, scoresSubquery.characterId)
    )
    .leftJoin(
      itemsSubquery,
      eq(itemsSubquery.itemId, scoresSubquery.subWeaponId)
    )
    .innerJoin(ruleTable, eq(ruleTable.id, scoresSubquery.ruleId))
    .orderBy(asc(ruleTable.name))
    .where(eq(scoresSubquery.rowNumber, 1));
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

export async function getCustomScores(): Promise<CustomScore[]> {
  const charactersSubquery = getLatestCharactersSubquery();
  const itemsSubquery = getLatestItemsSubquery();

  const scores = await useDrizzle()
    .with(charactersSubquery, itemsSubquery)
    .select({
      ...getColumns(scoreTable),
      user: getColumns(userTable),
      character: getColumns(charactersSubquery),
      subWeapon: getColumns(itemsSubquery),
      rule: getColumns(ruleTable),
    })
    .from(scoreTable)
    .innerJoin(userTable, eq(userTable.id, scoreTable.userId))
    .leftJoin(
      charactersSubquery,
      eq(charactersSubquery.characterId, scoreTable.characterId)
    )
    .leftJoin(itemsSubquery, eq(itemsSubquery.itemId, scoreTable.subWeaponId))
    .innerJoin(ruleTable, eq(ruleTable.id, scoreTable.ruleId))
    .orderBy(desc(scoreTable.score))
    .where(isNull(scoreTable.place));

  return scores;
}

export async function writeScore(score: DBScoreInsert): Promise<void> {
  await useDrizzle().insert(scoreTable).values(score);
}
