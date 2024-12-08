import { z } from "zod";
import {
  getEventInfoByEventId,
  type EventInfo,
} from "~~/server/utils/eventInfo";

const requestSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export default cachedEventHandler(
  async (event): Promise<{ event: EventInfo }> => {
    const { id } = await getValidatedRouterParams(event, requestSchema.parse);

    const data = await getEventInfoByEventId(id);

    if (data === null) {
      throw createError({
        statusCode: 404,
        message: `Did not find event with id ${id}.`,
      });
    }
    return { event: data };
  },
  {
    shouldBypassCache: () => true,
    maxAge: 60,
    swr: false,
  }
);
