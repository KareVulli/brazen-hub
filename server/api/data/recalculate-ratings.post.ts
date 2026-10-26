import { checkAllowedToUpdate } from "~~/server/utils/auth";
import { recalculateRatings } from "~~/server/utils/rating";

export default eventHandler(async (event): Promise<void> => {
  await checkAllowedToUpdate(event);

  await recalculateRatings();
});
