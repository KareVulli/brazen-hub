import { additionalEffectTable } from "../db/schema/additionalEffect";
import type { DBAdditionalEffect } from "./drizzle";

export interface AdditionalEffectDto {
  id: number;
  categoryType: string;
  additionalEffectType: string;
  enchantGroup: string;
  priority: number;
  validStun: boolean;
  validFinisher: boolean;
  cancelCondition: string;
  assetName: string;
  time: number;
  val1: number;
  val2: number;
  val3: number;
  val4: number;
}

export interface AdditionalEffect {
  id: number;
  gameVersion: string;
  additionalEffectId: number;
  categoryType: string;
  additionalEffectType: string;
  enchantGroup: string;
  priority: number;
  validStun: boolean;
  validFinisher: boolean;
  cancelCondition: string;
  assetName: string;
  time: number;
  val1: number;
  val2: number;
  val3: number;
  val4: number;
}

export function additionalEffectToDto(
  additionalEffect: AdditionalEffect,
): AdditionalEffectDto {
  return {
    id: additionalEffect.additionalEffectId,
    categoryType: additionalEffect.categoryType,
    additionalEffectType: additionalEffect.additionalEffectType,
    enchantGroup: additionalEffect.enchantGroup,
    priority: additionalEffect.priority,
    validStun: additionalEffect.validStun,
    validFinisher: additionalEffect.validFinisher,
    cancelCondition: additionalEffect.cancelCondition,
    assetName: additionalEffect.assetName,
    time: additionalEffect.time,
    val1: additionalEffect.val1,
    val2: additionalEffect.val2,
    val3: additionalEffect.val3,
    val4: additionalEffect.val4,
  };
}

export async function replaceAdditionalEffectsInDB(
  gameVersion: string,
  additionalEffects: AdditionalEffectDto[],
) {
  for (const additionalEffect of additionalEffects) {
    await writeAdditionalEffectToDB(gameVersion, additionalEffect);
  }
}

export async function writeAdditionalEffectToDB(
  gameVersion: string,
  additionalEffectDto: AdditionalEffectDto,
) {
  const values = {
    gameVersion: gameVersion,
    additionalEffectId: additionalEffectDto.id,
    categoryType: additionalEffectDto.categoryType,
    additionalEffectType: additionalEffectDto.additionalEffectType,
    enchantGroup: additionalEffectDto.enchantGroup,
    priority: additionalEffectDto.priority,
    validStun: additionalEffectDto.validStun,
    validFinisher: additionalEffectDto.validFinisher,
    cancelCondition: additionalEffectDto.cancelCondition,
    assetName: additionalEffectDto.assetName,
    time: additionalEffectDto.time,
    val1: additionalEffectDto.val1,
    val2: additionalEffectDto.val2,
    val3: additionalEffectDto.val3,
    val4: additionalEffectDto.val4,
  };
  await useDrizzle()
    .insert(additionalEffectTable)
    .values(values)
    .onConflictDoUpdate({
      target: [
        additionalEffectTable.additionalEffectId,
        additionalEffectTable.gameVersion,
      ],
      set: values,
    });
}

export function additionalEffectFromDB(
  additionalEffect: DBAdditionalEffect,
): AdditionalEffect {
  return {
    id: additionalEffect.id,
    gameVersion: additionalEffect.gameVersion,
    additionalEffectId: additionalEffect.additionalEffectId,
    categoryType: additionalEffect.categoryType,
    additionalEffectType: additionalEffect.additionalEffectType,
    enchantGroup: additionalEffect.enchantGroup,
    priority: additionalEffect.priority,
    validStun: additionalEffect.validStun,
    validFinisher: additionalEffect.validFinisher,
    cancelCondition: additionalEffect.cancelCondition,
    assetName: additionalEffect.assetName,
    time: additionalEffect.time,
    val1: additionalEffect.val1,
    val2: additionalEffect.val2,
    val3: additionalEffect.val3,
    val4: additionalEffect.val4,
  };
}

export async function getAdditionalEffectByAdditionalEffectId(
  additionalEffectId: number,
): Promise<AdditionalEffect | null> {
  const dbAdditionalEffect =
    await useDrizzle().query.additionalEffectTable.findFirst({
      where: eq(additionalEffectTable.additionalEffectId, additionalEffectId),
      orderBy: [desc(additionalEffectTable.gameVersion)],
    });
  if (dbAdditionalEffect) {
    return additionalEffectFromDB(dbAdditionalEffect);
  }
  return null;
}

export async function getAdditionalEffectsByGameVersion(
  gameVersion: string | number,
): Promise<AdditionalEffect[]> {
  const dbAdditionalEffects =
    await useDrizzle().query.additionalEffectTable.findMany({
      where: eq(additionalEffectTable.gameVersion, gameVersion + ""),
      orderBy: [asc(additionalEffectTable.additionalEffectId)],
    });
  return dbAdditionalEffects.map((additionalEffect) =>
    additionalEffectFromDB(additionalEffect),
  );
}

export async function getLatestAdditionalEffects(): Promise<
  AdditionalEffect[]
> {
  const config = useRuntimeConfig();
  return await getAdditionalEffectsByGameVersion(config.gameVersionCode);
}
