import { createMatch } from "~~/server/utils/match";
import { getStageById } from "~~/server/utils/stage";
import { matchSchema } from "~~/validation/matchSchema";

export default defineEventHandler(async (event): Promise<{ id: number }> => {
  await checkAllowedToUpdate(event);

  const data = await readValidatedBody(event, matchSchema.parse);

  const room = await getRoomById(data.roomId);
  if (room === null) {
    throw createError({
      statusCode: 400,
      message: `Room not found`,
    });
  }
  if (!room.roomSessions.some((session) => session.active)) {
    throw createError({
      statusCode: 400,
      message: `Room has no active session`,
    });
  }

  const stage = await getStageById(data.stageId);
  if (stage === null) {
    throw createError({
      statusCode: 400,
      message: `Stage not found`,
    });
  }

  const matchId = await createMatch(room, stage, data.teams);

  return { id: matchId };
});
