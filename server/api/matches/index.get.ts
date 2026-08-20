import { matchTable } from "~~/server/db/schema";
import type { PaginatedResponse } from "~~/server/utils/pagination";

export default defineEventHandler(
  async (event): Promise<PaginatedResponse<MatchDto>> => {
    const query = await getValidatedQuery(
      event,
      getPaginationSchema([matchTable.id], matchTable.id, "desc").parse,
    );
    const matches = await getPaginatedMatches(query);

    return matches;
  },
);
