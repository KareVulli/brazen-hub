import { createMatch } from "~~/server/utils/match";
import { getSessionById } from "~~/server/utils/roomSession";
import { getStageById } from "~~/server/utils/stage";
import { matchSchema } from "~~/validation/matchSchema";

export default defineEventHandler(async (event): Promise<{ id: number }> => {
  await checkAllowedToUpdate(event);

  const data = await readValidatedBody(event, matchSchema.parse);

  const roomSession = await getSessionById(data.roomSessionId);
  if (roomSession === null) {
    throw createError({
      statusCode: 400,
      message: `Room Session not found`,
    });
  }

  const gameRule = await getGameRuleByGameRuleId(data.gameRuleId);
  if (gameRule === null) {
    throw createError({
      statusCode: 400,
      message: `Game Rule not found`,
    });
  }

  const stage = await getStageById(data.stageId);
  if (stage === null) {
    throw createError({
      statusCode: 400,
      message: `Stage not found`,
    });
  }

  const matchId = await createMatch(roomSession, gameRule, stage, data.teams);

  return { id: matchId };
});
