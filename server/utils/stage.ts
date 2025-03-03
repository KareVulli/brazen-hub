import { stageTable } from "../database/schema";

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
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
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

export async function getStageFromDB(id: number): Promise<Stage | null> {
  const stage = await useDrizzle().query.stageTable.findFirst({
    where: eq(stageTable.id, id),
  });
  return stage || null;
}
