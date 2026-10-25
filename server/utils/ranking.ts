import { count, gte, inArray, isNotNull, notExists, sum } from "drizzle-orm";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";
import { getColumns } from "../db/getColumns";
import {
  gameRuleTable,
  matchEventTable,
  matchTable,
  teamTable,
  teamUserTable,
  userTable,
} from "../db/schema";
import { MULTIPLAYER_GAMERULES } from "~~/shared/constants";

export interface UserStat {
  user: BrazenUser;
  statPerRound: number;
  matches: number;
}

export interface UserHealingStat extends UserStat {
  totalHealingReceived: number;
}

export interface UserWLRStat {
  user: BrazenUser;
  wlr: number;
  wins: number;
  losses: number;
  matches: number;
}

export interface UserKDRStat {
  user: BrazenUser;
  kdr: number;
  kills: number;
  deaths: number;
  matches: number;
}

function getRoundsPerMatchSubquery() {
  return useDrizzle()
    .select({
      matchId: matchEventTable.matchId,
      rounds: count().as("rounds"),
    })
    .from(matchEventTable)
    .where(eq(matchEventTable.name, "round-end"))
    .groupBy(matchEventTable.matchId)
    .as("sq");
}

function getRTMFilter() {
  return and(
    isNotNull(matchTable.endedAt),
    eq(gameRuleTable.gameRuleType, "RoundMatch"),
    notExists(
      useDrizzle()
        .select({
          matchId: matchEventTable.matchId,
        })
        .from(matchEventTable)
        .where(
          and(
            eq(matchEventTable.name, "disconnect"),
            eq(matchEventTable.matchId, teamTable.matchId),
          ),
        )
        .limit(1),
    ),
  );
}

async function getRankingByRoundStat(field: SQLiteColumn): Promise<UserStat[]> {
  const roundsPerMatch = getRoundsPerMatchSubquery();

  const statsSubquery = useDrizzle()
    .select({
      userId: teamUserTable.userId,
      statPerRound:
        sql`cast(sum(${field}) as real) / cast(sum(${roundsPerMatch.rounds}) as real)`
          .mapWith(Number)
          .as("statPerRound"),
      matches: count().as("matches"),
    })
    .from(teamUserTable)
    .innerJoin(teamTable, eq(teamTable.id, teamUserTable.teamId))
    .innerJoin(matchTable, eq(matchTable.id, teamTable.matchId))
    .innerJoin(roundsPerMatch, eq(roundsPerMatch.matchId, matchTable.id))
    .innerJoin(gameRuleTable, eq(gameRuleTable.id, matchTable.gameRuleId))
    .groupBy(teamUserTable.userId)
    .where(getRTMFilter())
    .as("stats");

  const statsByUser = await useDrizzle()
    .select({
      user: getColumns(userTable),
      statPerRound: statsSubquery.statPerRound,
      matches: statsSubquery.matches,
    })
    .from(statsSubquery)
    .innerJoin(userTable, eq(userTable.id, statsSubquery.userId))
    .orderBy(desc(statsSubquery.statPerRound))
    .where(gte(statsSubquery.matches, 10))
    .limit(100);

  return statsByUser;
}

export async function getRankingByADR(): Promise<UserStat[]> {
  return await getRankingByRoundStat(teamUserTable.damage);
}

export async function getRankingByAKR(): Promise<UserStat[]> {
  return await getRankingByRoundStat(teamUserTable.kills);
}

export async function getRankingByKDR(): Promise<UserKDRStat[]> {
  const statsSubquery = useDrizzle()
    .select({
      userId: teamUserTable.userId,
      kills: sum(teamUserTable.kills).mapWith(Number).as("kills"),
      deaths: sum(teamUserTable.deaths).mapWith(Number).as("deaths"),
      kdr: sql`case when 
sum(${teamUserTable.deaths}) > 0 then
  cast(sum(${teamUserTable.kills}) as real) / cast(sum(${teamUserTable.deaths}) as real)
else
  sum(${teamUserTable.kills})
end`
        .mapWith(Number)
        .as("kdr"),
      matches: count().as("matches"),
    })
    .from(teamUserTable)
    .groupBy(teamUserTable.userId)
    .as("stats");

  const statsByUser = await useDrizzle()
    .select({
      user: getColumns(userTable),
      kills: statsSubquery.kills,
      deaths: statsSubquery.deaths,
      kdr: statsSubquery.kdr,
      matches: statsSubquery.matches,
    })
    .from(statsSubquery)
    .innerJoin(userTable, eq(userTable.id, statsSubquery.userId))
    .orderBy(desc(statsSubquery.kdr))
    .where(gte(statsSubquery.matches, 10))
    .limit(100);

  return statsByUser;
}

export async function getRankingByAHR(): Promise<UserHealingStat[]> {
  const roundsPerMatch = getRoundsPerMatchSubquery();

  const statsSubquery = useDrizzle()
    .select({
      userId: teamUserTable.userId,
      statPerRound:
        sql`cast(sum(${teamUserTable.healingReceived}) as real) / cast(sum(${roundsPerMatch.rounds}) as real)`
          .mapWith(Number)
          .as("statPerRound"),
      matches: count().as("matches"),
      totalHealingReceived: sum(teamUserTable.healingReceived)
        .mapWith(Number)
        .as("totalHealingReceived"),
    })
    .from(teamUserTable)
    .innerJoin(teamTable, eq(teamTable.id, teamUserTable.teamId))
    .innerJoin(matchTable, eq(matchTable.id, teamTable.matchId))
    .innerJoin(roundsPerMatch, eq(roundsPerMatch.matchId, matchTable.id))
    .innerJoin(gameRuleTable, eq(gameRuleTable.id, matchTable.gameRuleId))
    .groupBy(teamUserTable.userId)
    .where(getRTMFilter())
    .as("stats");

  const statsByUser = await useDrizzle()
    .select({
      user: getColumns(userTable),
      statPerRound: statsSubquery.statPerRound,
      totalHealingReceived: statsSubquery.totalHealingReceived,
      matches: statsSubquery.matches,
    })
    .from(statsSubquery)
    .innerJoin(userTable, eq(userTable.id, statsSubquery.userId))
    .orderBy(desc(statsSubquery.statPerRound))
    .where(gte(statsSubquery.matches, 10))
    .limit(100);

  return statsByUser;
}

export async function getRankingByWLR(): Promise<UserWLRStat[]> {
  const statsSubquery = useDrizzle()
    .select({
      userId: teamUserTable.userId,
      wins: sum(sql`case when ${teamTable.placement} = 1 then 1 else 0 end`)
        .mapWith(Number)
        .as("wins"),
      losses: sum(sql`case when ${teamTable.placement} > 1 then 1 else 0 end`)
        .mapWith(Number)
        .as("losses"),
      wlr: sql`cast(sum(case when ${teamTable.placement} = 1 then 1 else 0 end) as real) / cast(count(*) as real) * 100.0`
        .mapWith(Number)
        .as("wlr"),
      matches: count().as("matches"),
    })
    .from(teamUserTable)
    .innerJoin(teamTable, eq(teamTable.id, teamUserTable.teamId))
    .innerJoin(matchTable, eq(matchTable.id, teamTable.matchId))
    .innerJoin(gameRuleTable, eq(gameRuleTable.id, matchTable.gameRuleId))
    .where(
      and(
        isNotNull(matchTable.endedAt),
        inArray(gameRuleTable.gameRuleId, MULTIPLAYER_GAMERULES),
        notExists(
          useDrizzle()
            .select({
              matchId: matchEventTable.matchId,
            })
            .from(matchEventTable)
            .where(
              and(
                eq(matchEventTable.name, "disconnect"),
                eq(matchEventTable.matchId, teamTable.matchId),
              ),
            )
            .limit(1),
        ),
      ),
    )
    .groupBy(teamUserTable.userId)
    .as("stats");

  const statsByUser = await useDrizzle()
    .select({
      user: getColumns(userTable),
      wlr: statsSubquery.wlr,
      wins: statsSubquery.wins,
      losses: statsSubquery.losses,
      matches: statsSubquery.matches,
    })
    .from(statsSubquery)
    .innerJoin(userTable, eq(userTable.id, statsSubquery.userId))
    .where(gte(statsSubquery.matches, 10))
    .limit(100)
    .orderBy(desc(statsSubquery.wlr), desc(statsSubquery.matches));
  return statsByUser;
}
