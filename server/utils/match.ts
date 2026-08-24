import { inArray } from "drizzle-orm";
import type { MatchSchema } from "~~/validation/matchSchema";
import type { MatchUpdateSchema } from "~~/validation/matchUpdateSchema";
import { buildConflictUpdateColumns } from "../db/buildConflictUpdateColumns";
import { getColumns } from "../db/getColumns";
import {
  characterTable,
  gameRuleTable,
  itemTable,
  matchTable,
  stageTable,
  teamTable,
  teamUserTable,
  userTable,
} from "../db/schema";
import type { DBRoomSession, DBTeamUserInsert } from "./drizzle";
import type { GameRule } from "./gameRule";
import type { PaginatedResponse, PaginationOptions } from "./pagination";
import { paginateResults } from "./pagination";
import type { Team, TeamDto } from "./team";
import { teamToDto } from "./team";
import { alias } from "drizzle-orm/sqlite-core";

export interface SimpleMatch {
  id: number;
  roomSessionId: number;
  gameRule: GameRule;
  stage: Stage;
  endedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}

export interface SimpleMatchDto {
  id: number;
  roomSessionId: number;
  gameRule: GameRuleDto;
  stage: StageDto;
  endedAt: number | null;
  updatedAt: number;
  createdAt: number;
}

export interface Match extends SimpleMatch {
  teams: Team[];
}

export interface MatchDto extends SimpleMatchDto {
  teams: TeamDto[];
}

export function simpleMatchToDto(match: SimpleMatch): SimpleMatchDto {
  return {
    id: match.id,
    roomSessionId: match.roomSessionId,
    gameRule: gameRuleToDto(match.gameRule),
    stage: match.stage,
    endedAt: match.endedAt ? Math.floor(match.endedAt.getTime() / 1000) : null,
    updatedAt: Math.floor(match.updatedAt.getTime() / 1000),
    createdAt: Math.floor(match.createdAt.getTime() / 1000),
  };
}

export function matchToDto(match: Match): MatchDto {
  return {
    ...simpleMatchToDto(match),
    teams: match.teams.map(teamToDto),
  };
}

export async function getMatchById(id: number): Promise<Match | null> {
  return (
    (await useDrizzle().query.matchTable.findFirst({
      where: eq(matchTable.id, id),
      with: {
        teams: {
          with: {
            teamUsers: {
              with: {
                user: true,
                character: true,
                subWeapon: true,
              },
            },
          },
        },
        stage: true,
        gameRule: true,
      },
    })) || null
  );
}

export async function getMatches(): Promise<Match[]> {
  return (
    (await useDrizzle().query.matchTable.findMany({
      with: {
        teams: {
          with: {
            teamUsers: {
              with: {
                user: true,
                character: true,
                subWeapon: true,
              },
            },
          },
          orderBy: asc(teamTable.placement),
        },
        stage: true,
        gameRule: true,
      },
      orderBy: desc(matchTable.id),
    })) || null
  );
}

function getMatchesQuery() {
  return useDrizzle()
    .select({
      ...getColumns(matchTable),
      stage: getColumns(stageTable),
      gameRule: getColumns(gameRuleTable),
      team: getColumns(teamTable),
      teamUser: getColumns(teamUserTable),
      user: getColumns(userTable),
      character: getColumns(characterTable),
      subWeapon: getColumns(itemTable),
    })
    .from(matchTable)
    .innerJoin(stageTable, eq(stageTable.id, matchTable.stageId))
    .innerJoin(gameRuleTable, eq(gameRuleTable.id, matchTable.gameRuleId))
    .leftJoin(teamTable, eq(teamTable.matchId, matchTable.id))
    .leftJoin(teamUserTable, eq(teamUserTable.teamId, teamTable.id))
    .leftJoin(userTable, eq(userTable.id, teamUserTable.userId))
    .leftJoin(characterTable, eq(characterTable.id, teamUserTable.characterId))
    .leftJoin(itemTable, eq(itemTable.id, teamUserTable.subWeaponId))
    .$dynamic();
}

function mergeRows(rows: Awaited<ReturnType<typeof getMatchesQuery>>): Match[] {
  const results: Match[] = [];

  for (const row of rows) {
    const { team, teamUser, user, character, subWeapon, ...rest } = row;

    let match: Match | undefined = results.find((value) => value.id === row.id);
    if (!match) {
      match = { teams: [], ...rest };
      results.push(match);
    }

    let existingTeam: Team | undefined;
    if (team) {
      existingTeam = match.teams.find((value) => value.id === team.id);
      if (!existingTeam) {
        existingTeam = { teamUsers: [], ...team };
        match.teams.push(existingTeam);
      }
    }

    let existingTeamUser: TeamUser | undefined;
    if (existingTeam && teamUser && user && character && subWeapon) {
      existingTeamUser = existingTeam.teamUsers.find(
        (value) => value.id === teamUser.id,
      );
      if (!existingTeamUser) {
        existingTeamUser = {
          user: user,
          character: character,
          subWeapon: subWeapon,
          ...teamUser,
        };
        existingTeam.teamUsers.push(existingTeamUser);
      }
    }
  }

  return results;
}

export interface MatchFilters {
  userId?: number;
  gameRuleId?: number;
}

function getFilteredQuery({ userId, gameRuleId }: MatchFilters) {
  let query = useDrizzle()
    .select({ id: matchTable.id })
    .from(matchTable)
    .$dynamic();

  if (userId !== undefined) {
    const filteredTeamTable = alias(teamTable, "t1");
    const filteredTeamUserTable = alias(teamUserTable, "tu1");
    const filteredMatchTable = alias(matchTable, "m1");
    const filteredMatchesSubquery = useDrizzle()
      .select({ id: filteredMatchTable.id })
      .from(filteredMatchTable)
      .innerJoin(
        filteredTeamTable,
        eq(filteredTeamTable.matchId, filteredMatchTable.id),
      )
      .innerJoin(
        filteredTeamUserTable,
        eq(filteredTeamUserTable.teamId, filteredTeamTable.id),
      )
      .where(eq(filteredTeamUserTable.userId, userId))
      .orderBy(desc(filteredMatchTable.id))
      .as("m1");

    query = query.innerJoin(
      filteredMatchesSubquery,
      eq(matchTable.id, filteredMatchesSubquery.id),
    );
  }
  if (gameRuleId !== undefined) {
    const filteredGameRuleTable = alias(gameRuleTable, "gr1");
    query = query
      .innerJoin(
        filteredGameRuleTable,
        eq(matchTable.id, filteredGameRuleTable.id),
      )
      .where(eq(filteredGameRuleTable.gameRuleId, gameRuleId));
  }

  return query;
}

export async function getPaginatedMatches(
  paginationOptions: PaginationOptions,
  filters: MatchFilters = {},
): Promise<PaginatedResponse<MatchDto>> {
  const query = getFilteredQuery(filters);
  const paginatedResults = await paginateResults(query, paginationOptions);
  const results = await getMatchesQuery()
    .where(
      inArray(
        matchTable.id,
        paginatedResults.results.map((item) => item.id),
      ),
    )
    .orderBy(
      paginationOptions.sortDirection === "asc"
        ? asc(paginationOptions.sort)
        : desc(paginationOptions.sort),
      asc(teamTable.placement),
    );
  return {
    ...paginatedResults,
    results: mergeRows(results).map(matchToDto),
  };
}

export async function createMatch(
  roomSession: DBRoomSession,
  gameRule: GameRule,
  stage: Stage,
  teams: MatchSchema["teams"],
): Promise<number> {
  const config = useRuntimeConfig();

  const match = (
    await useDrizzle()
      .insert(matchTable)
      .values({
        roomSessionId: roomSession.id,
        stageId: stage.id,
        gameRuleId: gameRule.id,
      })
      .returning()
  )[0]!;

  const teamInserts = Object.entries(teams).map(([team, _data]) => ({
    matchId: match.id,
    team: Number.parseInt(team, 10),
    wins: 0,
  }));

  const insertedTeams = await useDrizzle()
    .insert(teamTable)
    .values(teamInserts)
    .returning({ id: teamTable.id, teamIndex: teamTable.team });

  const playerInserts: DBTeamUserInsert[] = [];

  const mappedTeams = insertedTeams.reduce<Record<string, number>>(
    (acc, team) => ({ ...acc, [team.teamIndex]: team.id }),
    {},
  );
  const characters = await getCharactersByGameVersion(config.gameVersionCode);
  const items = await getIndexedItemsByGameVersion(config.gameVersionCode);

  for (const [team, data] of Object.entries(teams)) {
    for (const [userKey, playerData] of Object.entries(data.players)) {
      const userId = await updateUserInDB(
        {
          userKey: userKey,
          name: playerData.name,
          iconId: playerData.iconId,
          iconFrameId: playerData.iconFrameId,
        },
        playerData.bot,
      );

      const character = characters[playerData.characterId];
      if (!character) {
        throw new Error(`Could not find character ${playerData.characterId}`);
      }

      const subWeapon = items[playerData.subWeaponId];
      if (!subWeapon) {
        throw new Error(`Could not find item ${playerData.subWeaponId}`);
      }

      playerInserts.push({
        teamId: mappedTeams[team]!,
        userId: userId,
        characterId: character.id,
        subWeaponId: subWeapon.id,
      });
    }
  }

  await useDrizzle().insert(teamUserTable).values(playerInserts);

  return match.id;
}

export async function updateMatchStats(
  matchId: number,
  { teams, players: playerStats, endedAt }: MatchUpdateSchema,
): Promise<void> {
  const teamInserts = Object.entries(teams).map(([team, stats]) => ({
    ...stats,
    matchId: matchId,
    team: Number.parseInt(team, 10),
  }));

  const players = await useDrizzle()
    .select({
      teamUser: getColumns(teamUserTable),
      user: getColumns(userTable),
    })
    .from(teamUserTable)
    .innerJoin(teamTable, eq(teamTable.id, teamUserTable.teamId))
    .innerJoin(userTable, eq(userTable.id, teamUserTable.userId))
    .where(eq(teamTable.matchId, matchId));

  const teamUserInserts: DBTeamUserInsert[] = [];

  for (const [userKey, stats] of Object.entries(playerStats)) {
    const player = players.find((player) => player.user.userKey === userKey);
    if (!player) {
      throw new Error(`Could not find team user ${userKey}`);
    }

    teamUserInserts.push({
      id: player.teamUser.id,
      teamId: player.teamUser.teamId,
      characterId: player.teamUser.characterId,
      subWeaponId: player.teamUser.subWeaponId,
      userId: player.teamUser.userId,
      ...stats,
      disconnectedAt: stats.disconnectedAt
        ? new Date(stats.disconnectedAt * 1000)
        : null,
    });
  }

  await useDrizzle()
    .update(matchTable)
    .set({
      endedAt: endedAt ? new Date(endedAt * 1000) : null,
    })
    .where(eq(matchTable.id, matchId));

  await useDrizzle()
    .insert(teamTable)
    .values(teamInserts)
    .onConflictDoUpdate({
      target: [teamTable.matchId, teamTable.team],
      set: buildConflictUpdateColumns(teamTable, ["team", "wins", "placement"]),
    });

  await useDrizzle()
    .insert(teamUserTable)
    .values(teamUserInserts)
    .onConflictDoUpdate({
      target: [teamUserTable.id],
      set: buildConflictUpdateColumns(teamUserTable, [
        "kills",
        "stuns",
        "deaths",
        "revives",
        "healed",
        "skill",
        "ultimate",
        "damage",
        "aliveDuration",
      ]),
    });
}
