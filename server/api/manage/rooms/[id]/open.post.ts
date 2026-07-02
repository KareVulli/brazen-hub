import z from "zod";
import { ROLE_ADMIN } from "~~/server/database/roles";
import { getFreeHost } from "~~/server/utils/host";

const requestSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export default defineEventHandler(async (event): Promise<void> => {
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

  if (room.roomSessions.find((value) => value.active) !== undefined) {
    throw createError({
      statusCode: 400,
      message: `Room already has an active session`,
    });
  }

  const host = await getFreeHost();
  await openRoom(room, host);
});
