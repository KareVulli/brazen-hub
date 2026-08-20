import z from "zod";
import type { MatchEventDto } from "~~/server/utils/matchEvent";
import {
  getMatchEventsByMatchId,
  matchEventToDto,
} from "~~/server/utils/matchEvent";

const requestSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export default defineEventHandler(
  async (event): Promise<{ match: MatchDto; events: MatchEventDto[] }> => {
    const { id } = await getValidatedRouterParams(event, requestSchema.parse);

    const match = await getMatchById(id);
    if (match === null) {
      throw createError({
        statusCode: 404,
        message: `Match not found`,
      });
    }

    const events = await getMatchEventsByMatchId(match.id);

    return {
      match: matchToDto(match),
      events: events.map(matchEventToDto),
    };
  },
);
