import { ROLE_ADMIN } from "~~/server/db/roles";
import { updateSettings } from "~~/server/utils/settings";
import { settingsSchema } from "~~/validation/settingsSchema";

export default defineEventHandler(async (event): Promise<void> => {
  const session = await requireUserSession(event);

  if (session.user.role !== ROLE_ADMIN) {
    throw createError({
      statusCode: 403,
      message: `Forbidden`,
    });
  }
  const data = await readValidatedBody(event, settingsSchema.parse);

  await updateSettings(data);
});
