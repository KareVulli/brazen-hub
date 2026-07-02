import { matchTable, teamTable } from "../database/schema";
import type { Team, TeamDto } from "./team";
import { teamToDto } from "./team";
import { buildConflictUpdateColumns } from "../database/buildConflictUpdateColumns";

export interface Match {
  id: number;
  roomId: number;
  stage: Stage;
  teams: Team[];
  updatedAt: Date;
  createdAt: Date;
}

export interface MatchDto {
  id: number;
  roomId: number;
  stage: StageDto;
  teams: TeamDto[];
  updatedAt: number;
  createdAt: number;
}

export function matchToDto(match: Match): MatchDto {
  return {
    id: match.id,
    roomId: match.roomId,
    stage: match.stage,
    teams: match.teams.map(teamToDto),
    updatedAt: Math.floor(match.updatedAt.getTime() / 1000),
    createdAt: Math.floor(match.createdAt.getTime() / 1000),
  };
}

export async function getMatchById(id: number): Promise<Match | null> {
  return (
    (await useDrizzle().query.matchTable.findFirst({
      where: eq(matchTable.id, id),
      with: {
        teams: true,
        stage: true,
      },
    })) || null
  );
}

export async function createMatch(
  room: Room,
  stage: Stage,
  teams: Record<number, { wins: number }>,
): Promise<number> {
  const match = (
    await useDrizzle()
      .insert(matchTable)
      .values({ roomId: room.id, stageId: stage.id })
      .returning()
  )[0]!;

  const teamInserts = Object.entries(teams).map(([team, stats]) => ({
    ...stats,
    matchId: match.id,
    team: Number.parseInt(team, 10),
  }));

  await useDrizzle().insert(teamTable).values(teamInserts);

  return match.id;
}

export async function updateMatchStats(
  matchId: number,
  teams: Record<number, { wins: number }>,
): Promise<void> {
  const teamInserts = Object.entries(teams).map(([team, stats]) => ({
    ...stats,
    matchId: matchId,
    team: Number.parseInt(team, 10),
  }));

  await useDrizzle()
    .insert(teamTable)
    .values(teamInserts)
    .onConflictDoUpdate({
      target: [teamTable.matchId, teamTable.team],
      set: buildConflictUpdateColumns(teamTable, ["team", "wins"]),
    });
}
