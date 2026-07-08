import z from "zod";
import { matchUpdateSchema } from "~~/validation/matchUpdateSchema";

const requestSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export default defineEventHandler(async (event): Promise<void> => {
  await checkAllowedToUpdate(event);

  const { id } = await getValidatedRouterParams(event, requestSchema.parse);
  const data = await readValidatedBody(event, matchUpdateSchema.parse);

  const match = await getMatchById(id);
  if (match === null) {
    throw createError({
      statusCode: 404,
      message: `Match not found`,
    });
  }

  await updateMatchStats(id, data);
});
