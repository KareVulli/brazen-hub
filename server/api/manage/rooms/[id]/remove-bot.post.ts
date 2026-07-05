import { z } from "zod";
import { ROLE_ADMIN } from "~~/server/database/roles";
import { removeBot } from "~~/server/utils/matchmaking-api/remove-bot";
import { getRoomById } from "~~/server/utils/room";

const requestSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  if (session.user.role !== ROLE_ADMIN) {
    throw createError({
      statusCode: 403,
      message: `Forbidden`,
    });
  }

  const { id } = await getValidatedRouterParams(event, requestSchema.parse);

  const room = await getRoomById(id);

  if (!room) {
    throw createError({
      statusCode: 404,
      message: `Room not found`,
    });
  }

  const activeSession = room.roomSessions.find((value) => value.active);
  if (activeSession === undefined) {
    throw createError({
      statusCode: 400,
      message: `Room does not have an active session`,
    });
  }

  return await removeBot({ marsRoomId: activeSession.marsRoomId });
});
