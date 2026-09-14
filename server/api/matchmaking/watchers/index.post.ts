import { watcherSchema } from "~~/validation/watcherSchema";

export default defineEventHandler(async (event): Promise<void> => {
  await checkAllowedToUpdate(event);

  const data = await readValidatedBody(event, watcherSchema.parse);

  await createWatcherByCode(data.code);
});
