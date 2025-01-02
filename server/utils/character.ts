import { characterTable } from "../database/schema/character";

export interface CharacterDto {
  id: number;
  name: string;
  displayName: string;
  hp: number;
  largeIconName: string;
  boostRecovery: number;
  boostMax: number;
  skillName: string;
  skillDescription: string;
  skillRange: number;
  skillRecastTime: number;
  ultimateName: string;
  ultimateDescription: string;
  ultimateRange: number;
  ultimatePoints: number;
  ultimatePointsDamageMultiplier: number;
  ultimatePointsAttackMultiplier: number;
}

export async function replaceCharactersInDB(
  gameVersion: string,
  characters: CharacterDto[]
) {
  await useDrizzle()
    .delete(characterTable)
    .where(eq(characterTable.gameVersion, gameVersion));
  for (let i = 0; i < characters.length; i++) {
    const character = characters[i];
    await writeCharacterToDB(gameVersion, character);
  }
}

export async function writeCharacterToDB(
  gameVersion: string,
  characterDto: CharacterDto
) {
  await useDrizzle().insert(characterTable).values({
    gameVersion: gameVersion,
    characterId: characterDto.id,
    name: characterDto.name,
    displayName: characterDto.displayName,
    hp: characterDto.hp,
    largeIconName: characterDto.largeIconName,
    boostRecovery: characterDto.boostRecovery,
    boostMax: characterDto.boostMax,
    skillName: characterDto.skillName,
    skillDescription: characterDto.skillDescription,
    skillRange: characterDto.skillRange,
    skillRecastTime: characterDto.skillRecastTime,
    ultimateName: characterDto.ultimateName,
    ultimateDescription: characterDto.ultimateDescription,
    ultimateRange: characterDto.ultimateRange,
    ultimatePoints: characterDto.ultimatePoints,
    ultimatePointsDamageMultiplier: characterDto.ultimatePointsDamageMultiplier,
    ultimatePointsAttackMultiplier: characterDto.ultimatePointsAttackMultiplier,
  });
}
