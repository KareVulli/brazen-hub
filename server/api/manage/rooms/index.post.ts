import { ROLE_ADMIN } from "~~/server/database/roles";
import { getFreeHost } from "~~/server/utils/host";
import { createRoom } from "~~/server/utils/room";
import { getStageById } from "~~/server/utils/stage";
import { roomSchema } from "~~/validation/roomSchema";

export default defineEventHandler(async (event): Promise<void> => {
  const session = await requireUserSession(event);

  if (session.user.role !== ROLE_ADMIN) {
    throw createError({
      statusCode: 403,
      message: `Forbidden`,
    });
  }
  const data = await readValidatedBody(event, roomSchema.parse);

  const gameRule = await getGameRuleByGameRuleId(data.gameRuleId);
  if (gameRule === null) {
    throw createError({
      statusCode: 400,
      message: `Gamerule not found`,
    });
  }

  const stage = await getStageById(data.stageId);
  if (stage === null) {
    throw createError({
      statusCode: 400,
      message: `Stage not found`,
    });
  }

  const host = await getFreeHost();

  await createRoom(host, stage.id, gameRule.gameRuleId, data.public);
});
