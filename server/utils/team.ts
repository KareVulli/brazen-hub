export interface Team {
  id: number;
  matchId: number;
  team: number;
  wins: number;
  updatedAt: Date;
  createdAt: Date;
}

export interface TeamDto {
  id: number;
  matchId: number;
  team: number;
  wins: number;
  updatedAt: number;
  createdAt: number;
}

export function teamToDto(team: Team): TeamDto {
  return {
    id: team.id,
    matchId: team.matchId,
    team: team.team,
    wins: team.wins,
    updatedAt: Math.floor(team.updatedAt.getTime() / 1000),
    createdAt: Math.floor(team.createdAt.getTime() / 1000),
  };
}
