import z from "zod";
import { matchTable } from "~~/server/db/schema";
import type { PaginatedResponse } from "~~/server/utils/pagination";

const filterSchema = z.object({
  user: z.string().optional(),
});

export default defineEventHandler(
  async (event): Promise<PaginatedResponse<MatchDto>> => {
    const query = await getValidatedQuery(
      event,
      filterSchema.extend(
        getPaginationSchema([matchTable.id], matchTable.id, "desc").shape,
      ).parse,
    );

    let userId: number | undefined;
    if (query.user) {
      userId = (await getUserFromDB(query.user))?.id;
      if (!userId) {
        throw createError({
          statusCode: 400,
          statusMessage: "Unknown user",
        });
      }
    }

    const matches = await getPaginatedMatches(query, {
      userId,
    });

    return matches;
  },
);
