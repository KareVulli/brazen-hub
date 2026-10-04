import z from "zod";
import { matchTable } from "~~/server/db/schema";
import type { PaginatedResponse } from "~~/server/utils/pagination";
import { queryStringArraySchema } from "~~/validation/queryStringArraySchema";
import { queryNumberSchema } from "~~/validation/queryNumberSchema";

const filterSchema = z.object({
  players: queryStringArraySchema.pipe(z.array(z.string()).max(6).optional()),
  stageId: queryNumberSchema(
    z
      .number()
      .int()
      .positive()
      .nullable()
      .optional()
      .transform((arg) => arg ?? undefined),
  ),
  gameRuleId: queryNumberSchema(
    z
      .number()
      .int()
      .positive()
      .nullable()
      .optional()
      .transform((arg) => arg ?? undefined),
  ),
});

export default defineEventHandler(
  async (event): Promise<PaginatedResponse<MatchDto>> => {
    const query = await getValidatedQuery(
      event,
      filterSchema.extend(
        getPaginationSchema([matchTable.id], matchTable.id, "desc").shape,
      ).parse,
    );

    const matches = await getPaginatedMatches(query, {
      players: query.players,
      stageId: query.stageId,
      gameRuleId: query.gameRuleId,
    });

    return matches;
  },
);
