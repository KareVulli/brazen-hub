import { checkAllowedToUpdate } from "~~/server/utils/auth";
import {
  eventInfoResponseFromDto,
  getRawEventInfo,
} from "~~/server/utils/brazen-api/getEventInfo";
import { hasRecentEntry, writeToDB } from "~~/server/utils/eventInfo";
import { UpdateStatus } from "../../../../types/UpdateStatus";

export default eventHandler(
  async (event): Promise<{ status: UpdateStatus }> => {
    const config = useRuntimeConfig(event);

    await checkAllowedToUpdate(event);

    console.log("Checking last update time...");
    const recentlyUpdated = await hasRecentEntry(config.refreshTime * 1000);
    if (recentlyUpdated) {
      console.log("Has been recently updated, skipping");
      return { status: UpdateStatus.UP_TO_DATE };
    }

    console.log("No recent data in db, getting from brazen api...");

    const rawData = await getRawEventInfo(config.bzToken);

    const data = eventInfoResponseFromDto(rawData);
    if (data.currentEvent === null) {
      console.info("No current event found from brazen api!");
      return { status: UpdateStatus.NO_NEW_EVENT };
    } else {
      await writeToDB(rawData, data.currentEvent);
    }

    return { status: UpdateStatus.UPDATED };
  }
);
