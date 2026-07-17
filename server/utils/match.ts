import type { MatchSchema } from "~~/validation/matchSchema";
import type { MatchUpdateSchema } from "~~/validation/matchUpdateSchema";
import { buildConflictUpdateColumns } from "../database/buildConflictUpdateColumns";
import { getColumns } from "../database/getColumns";
import {
  matchTable,
  teamTable,
  teamUserTable,
  userTable,
} from "../database/schema";
import type { DBTeamUserInsert } from "./drizzle";
import type { Team, TeamDto } from "./team";
import { teamToDto } from "./team";

export interface SimpleMatch {
  id: number;
  roomId: number;
  gameRule: GameRule;
  stage: Stage;
  endedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}

export interface SimpleMatchDto {
  id: number;
  roomId: number;
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
    roomId: match.roomId,
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
        },
        stage: true,
        gameRule: true,
      },
      orderBy: desc(matchTable.id),
    })) || null
  );
}

export async function createMatch(
  room: Room,
  stage: Stage,
  teams: MatchSchema["teams"],
): Promise<number> {
  const config = useRuntimeConfig();

  const match = (
    await useDrizzle()
      .insert(matchTable)
      .values({
        roomId: room.id,
        stageId: stage.id,
        gameRuleId: room.gameRule.id,
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
      set: buildConflictUpdateColumns(teamTable, ["team", "wins"]),
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
