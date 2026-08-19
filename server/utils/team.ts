import type { TeamUser, TeamUserDto } from "./teamUser";
import { teamUserToDto } from "./teamUser";

export interface Team {
  id: number;
  matchId: number;
  team: number;
  wins: number;
  placement: number;
  teamUsers: TeamUser[];
  updatedAt: Date;
  createdAt: Date;
}

export interface TeamDto {
  id: number;
  matchId: number;
  team: number;
  wins: number;
  placement: number;
  teamUsers: TeamUserDto[];
  updatedAt: number;
  createdAt: number;
}

export function teamToDto(team: Team): TeamDto {
  return {
    id: team.id,
    matchId: team.matchId,
    team: team.team,
    wins: team.wins,
    placement: team.placement,
    teamUsers: team.teamUsers.map(teamUserToDto),
    updatedAt: Math.floor(team.updatedAt.getTime() / 1000),
    createdAt: Math.floor(team.createdAt.getTime() / 1000),
  };
}
