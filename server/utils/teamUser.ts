import type { BrazenUser } from "./user";

export interface TeamUser {
  id: number;
  teamId: number;
  user: BrazenUser;
  character: DBCharacter;
  subWeapon: DBItem;
  kills: number;
  stuns: number;
  deaths: number;
  damage: number;
  revives: number;
  healed: number;
  skill: number;
  ultimate: number;
  aliveDuration: number;
  createdAt: Date;
  disconnectedAt: Date | null;
}

export interface TeamUserDto {
  id: number;
  teamId: number;
  user: BrazenUser;
  character: CharacterDto;
  subWeapon: ItemDto;
  kills: number;
  stuns: number;
  deaths: number;
  damage: number;
  revives: number;
  healed: number;
  skill: number;
  ultimate: number;
  aliveDuration: number;
  createdAt: number;
  disconnectedAt: number | null;
}

export function teamUserToDto(teamUser: TeamUser): TeamUserDto {
  return {
    id: teamUser.id,
    teamId: teamUser.teamId,
    user: teamUser.user,
    character: characterFromDB(teamUser.character),
    subWeapon: itemFromDB(teamUser.subWeapon),
    kills: teamUser.kills,
    stuns: teamUser.stuns,
    deaths: teamUser.deaths,
    damage: teamUser.damage,
    revives: teamUser.revives,
    healed: teamUser.healed,
    skill: teamUser.skill,
    ultimate: teamUser.ultimate,
    aliveDuration: teamUser.aliveDuration,
    createdAt: Math.floor(teamUser.createdAt.getTime() / 1000),
    disconnectedAt: teamUser.disconnectedAt
      ? Math.floor(teamUser.disconnectedAt.getTime() / 1000)
      : null,
  };
}
