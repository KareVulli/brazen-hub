import { checkAllowedToUpdate } from "~~/server/utils/auth";
import { getEventInfo } from "~~/server/utils/brazen-api/getEventInfo";
import { hasRecentEntry, writeToDB } from "~~/server/utils/eventInfo";

enum UpdateStatus {
  UP_TO_DATE,
  NO_NEW_EVENT,
  UPDATED,
}

export default eventHandler(
  async (event): Promise<{ status: UpdateStatus }> => {
    const config = useRuntimeConfig(event);

    checkAllowedToUpdate(event);

    console.log("Checking last update time...");
    const recentlyUpdated = await hasRecentEntry(config.refreshTime * 1000);
    if (recentlyUpdated) {
      console.log("Has been recently updated, skipping");
      return { status: UpdateStatus.UP_TO_DATE };
    }

    console.log("No recent data in db, getting from brazen api...");

    const rawData = await getEventInfo(config.bzToken);

    const data = currentEventInfoFromDto(rawData);
    if (data === null) {
      console.info("No current event found from brazen api!");
      return { status: UpdateStatus.NO_NEW_EVENT };
    } else {
      await writeToDB(rawData, data);
    }

    return { status: UpdateStatus.UPDATED };
  }
);
