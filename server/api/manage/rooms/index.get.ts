import { ROLE_ADMIN } from "~~/server/database/roles";
import type { RoomDto } from "~~/server/utils/room";
import { getRooms, roomToDto } from "~~/server/utils/room";

export default defineEventHandler(
  async (event): Promise<{ rooms: RoomDto[] }> => {
    const session = await requireUserSession(event);

    if (session.user.role !== ROLE_ADMIN) {
      throw createError({
        statusCode: 403,
        message: `Forbidden`,
      });
    }

    return {
      rooms: (await getRooms()).map((room) => roomToDto(room)),
    };
  }
);
