import { ROLE_ADMIN } from "~~/server/db/roles";
import { getSettings } from "~~/server/utils/settings";

export default defineEventHandler(async (event): Promise<DBSettings> => {
  const session = await requireUserSession(event);

  if (session.user.role !== ROLE_ADMIN) {
    throw createError({
      statusCode: 403,
      message: `Forbidden`,
    });
  }

  return await getSettings();
});
