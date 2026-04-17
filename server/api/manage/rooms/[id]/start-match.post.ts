import { z } from "zod";
import { ROLE_ADMIN } from "~~/server/database/roles";
import { getRoomById } from "~~/server/utils/room";
import { startMatch } from "~~/server/utils/matchmaking-api/start-match";

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

  return await startMatch({ marsRoomId: room.marsRoomId });
});
