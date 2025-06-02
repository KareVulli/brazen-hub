import { checkAllowedToUpdate } from "~~/server/utils/auth";
import type { BrazenApiEventInfo } from "~~/server/utils/brazen-api/getEventInfo";
import {
  eventInfoResponseFromDto,
  getRawEventInfo,
} from "~~/server/utils/brazen-api/getEventInfo";
import { writeToDB } from "~~/server/utils/eventInfo";

export default eventHandler(
  async (event): Promise<{ event: BrazenApiEventInfo | null }> => {
    const config = useRuntimeConfig(event);

    await checkAllowedToUpdate(event);

    const rawData = await getRawEventInfo(config.bzToken);

    const data = eventInfoResponseFromDto(rawData);
    if (data.previousEvent === null) {
      console.warn("No previous event found from brazen api!");
    } else {
      await writeToDB(rawData, data.previousEvent);
    }

    return { event: data.previousEvent };
  }
);
