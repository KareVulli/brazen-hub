import { ROLE_ADMIN } from "~~/server/database/roles";
import type { WatcherSessionDto } from "~~/server/utils/roomSession";
import { watcherSessionToDto } from "~~/server/utils/roomSession";

export default defineEventHandler(
  async (event): Promise<WatcherSessionDto[]> => {
    const session = await requireUserSession(event);

    if (session.user.role !== ROLE_ADMIN) {
      throw createError({
        statusCode: 403,
        message: `Forbidden`,
      });
    }

    return (await getWatcherSessions()).map(watcherSessionToDto);
  },
);
