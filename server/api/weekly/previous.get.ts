import { checkAllowedToUpdate } from "~~/server/utils/auth";
import { getEventInfo } from "~~/server/utils/brazen-api/getEventInfo";
import type { EventInfo } from "~~/server/utils/eventInfo";
import { previousEventInfoFromDto, writeToDB } from "~~/server/utils/eventInfo";

export default eventHandler(
  async (event): Promise<{ event: EventInfo | null }> => {
    const config = useRuntimeConfig(event);

    checkAllowedToUpdate(event);

    console.log("Getting last weeks event from brazen api...");

    const rawData = await getEventInfo(config.bzToken);

    const data = previousEventInfoFromDto(rawData);
    if (data === null) {
      console.warn("No previous event found from brazen api!");
    } else {
      await writeToDB(rawData, data);
    }

    return { event: data };
  }
);
