import { inArray } from "drizzle-orm";
import { stageTable } from "../db/schema";
import { MULTIPLAYER_STAGES } from "~~/shared/constants";

export interface Stage {
  id: number;
  name: string;
  description: string;
  thumbnailName: string;
}

export interface StageDto {
  id: number;
  name: string;
  description: string;
  thumbnailName: string;
}

export async function replaceStagesInDB(stages: StageDto[]) {
  await useDrizzle().delete(stageTable);
  for (const stage of stages) {
    await writeStageToDB(stage);
  }
}

export async function writeStageToDB(stage: StageDto) {
  await useDrizzle().insert(stageTable).values({
    id: stage.id,
    name: stage.name,
    description: stage.description,
    thumbnailName: stage.thumbnailName,
  });
}

export async function getStages(
  multiplayerOnly: boolean = false,
): Promise<Stage[]> {
  return await useDrizzle().query.stageTable.findMany({
    where: and(
      multiplayerOnly ? inArray(stageTable.id, MULTIPLAYER_STAGES) : undefined,
    ),
  });
}

export async function getStageById(id: number): Promise<Stage | null> {
  const stage = await useDrizzle().query.stageTable.findFirst({
    where: eq(stageTable.id, id),
  });
  return stage || null;
}
