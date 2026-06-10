import { ROLE_ADMIN } from "~~/server/database/roles";
import { getFreeHost } from "~~/server/utils/host";
import { createRoom } from "~~/server/utils/room";
import { getStageById } from "~~/server/utils/stage";
import { roomSchema } from "~~/validation/roomSchema";

export default defineEventHandler(async (event): Promise<void> => {
  const session = await requireUserSession(event);
  const config = useRuntimeConfig(event);

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

  const users = [];
  for (let i = 0; i < data.players.length; i++) {
    const player = data.players[i]!;
    let user = await getUserFromDB(player.userKey);
    if (!user) {
      user = await fetchAndUpdateUser(config.bzToken, player.userKey);
      if (!user) {
        throw createError({
          statusCode: 400,
          message: `User with userKey ${player.userKey} not found`,
        });
      }
    }

    users.push({
      userId: user.id,
      userKey: player.userKey,
      team: player.team,
      name: user.name,
    });
  }

  const host = await getFreeHost();

  await createRoom(host, stage.id, gameRule.gameRuleId, data.public, users);
});
