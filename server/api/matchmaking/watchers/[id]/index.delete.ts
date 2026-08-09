import z from "zod";
import { closeWatcherSession } from "~~/server/utils/roomSession";

const requestSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export default defineEventHandler(async (event) => {
  await checkAllowedToUpdate(event);

  const { id } = await getValidatedRouterParams(event, requestSchema.parse);

  await closeWatcherSession(id);
});
