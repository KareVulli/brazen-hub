import { getEventInfo } from "~~/server/utils/brazen-api/getEventInfo";
import {
  currentEventInfoFromDto,
  getLatestFromDB,
  writeToDB,
  type EventInfo,
} from "~~/server/utils/eventInfo";

export default cachedEventHandler(
  async (event): Promise<{ event: EventInfo | null }> => {
    const config = useRuntimeConfig(event);

    console.log(
      "No recent data in keyvalue storage, trying to get from database..."
    );
    let data = await getLatestFromDB(config.refreshTime * 1000);

    if (data !== null) {
      console.log("Got data from db");
      return { event: data };
    }
    console.log("No recent data in db, getting from brazen api...");

    const rawData = await getEventInfo(config.bzToken);

    data = currentEventInfoFromDto(rawData);
    if (data === null) {
      console.warn("No current event found from brazen api!");
    } else {
      await writeToDB(rawData, data);
    }

    return { event: data };
  },
  {
    maxAge: 60,
    swr: false,
  }
);
