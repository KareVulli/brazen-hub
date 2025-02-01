import { getColumns } from "../database/getColumns";
import { characterTable } from "../database/schema/character";
import type { DBCharacter } from "./drizzle";

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

export interface Character {
  id: number;
  characterId: number;
  gameVersion: string;
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

export function characterFromDB(character: DBCharacter): Character {
  return {
    id: character.id,
    characterId: character.characterId,
    name: character.name,
    displayName: character.displayName,
    gameVersion: character.gameVersion,
    hp: character.hp,
    largeIconName: character.largeIconName,
    boostRecovery: character.boostRecovery,
    boostMax: character.boostMax,
    skillName: character.skillName,
    skillDescription: character.skillDescription,
    skillRange: character.skillRange,
    skillRecastTime: character.skillRecastTime,
    ultimateName: character.ultimateName,
    ultimateDescription: character.ultimateDescription,
    ultimateRange: character.ultimateRange,
    ultimatePoints: character.ultimatePoints,
    ultimatePointsDamageMultiplier: character.ultimatePointsDamageMultiplier,
    ultimatePointsAttackMultiplier: character.ultimatePointsAttackMultiplier,
  };
}

export async function getCharacterByCharacterId(
  characterId: number
): Promise<Character | null> {
  const dbCharacter = await useDrizzle().query.characterTable.findFirst({
    where: eq(characterTable.characterId, characterId),
    orderBy: [desc(characterTable.gameVersion)],
  });
  if (dbCharacter) {
    return characterFromDB(dbCharacter);
  }
  return null;
}

export async function getCharactersByGameVersion(
  gameVersion: string | number
): Promise<Record<number, Character | undefined>> {
  const dbCharacters = await useDrizzle().query.characterTable.findMany({
    where: eq(characterTable.gameVersion, gameVersion + ""),
    orderBy: [asc(characterTable.characterId)],
  });
  return dbCharacters
    .map((character) => characterFromDB(character))
    .reduce<Record<number, Character>>((acc, character) => {
      acc[character.characterId] = character;
      return acc;
    }, {});
}

export function getLatestCharactersSubquery() {
  const subQuery = useDrizzle()
    .$with("characters_with_row_number")
    .as(
      useDrizzle()
        .select({
          ...getColumns(characterTable),
          rowNumber: sql<number>`ROW_NUMBER() OVER (
          PARTITION BY ${characterTable.characterId}
          ORDER BY ${characterTable.gameVersion} DESC
        )`.as("row_number"),
        })
        .from(characterTable)
    );
  const { rowNumber, ...subQueryColumns } = getColumns(subQuery);
  return useDrizzle()
    .$with("latest_characters")
    .as(
      useDrizzle()
        .with(subQuery)
        .select(subQueryColumns)
        .from(subQuery)
        .where(eq(subQuery.rowNumber, 1))
    );
}
