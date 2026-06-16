import type { Team, TeamDto } from "./team";
import { teamToDto } from "./team";

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
