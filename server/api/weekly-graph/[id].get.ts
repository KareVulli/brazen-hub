import { z } from "zod";
import { getLeaderboardHistoryByEventId } from "~~/server/utils/eventInfo";

const requestSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export default cachedEventHandler(
  async (event) => {
    const { id } = await getValidatedRouterParams(event, requestSchema.parse);

    const data = await getLeaderboardHistoryByEventId(id);

    if (data === null) {
      throw createError({
        statusCode: 404,
        message: `Did not find event with id ${id}.`,
      });
    }
    return data;
  },
  {
    maxAge: 900,
    swr: false,
  }
);
