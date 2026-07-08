import z from "zod";

const requestSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export default defineEventHandler(async (event): Promise<MatchDto> => {
  const { id } = await getValidatedRouterParams(event, requestSchema.parse);

  const match = await getMatchById(id);
  if (match === null) {
    throw createError({
      statusCode: 404,
      message: `Match not found`,
    });
  }

  return matchToDto(match);
});
