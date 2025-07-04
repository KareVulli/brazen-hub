import { z } from "zod";
import { ROLE_ADMIN } from "~~/server/database/roles";
import { deleteRoomById } from "~~/server/utils/room";

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

  await deleteRoomById(id);
});
