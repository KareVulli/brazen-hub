import type { EventListItem } from "~~/server/utils/eventsList";
import { getEventsList } from "~~/server/utils/eventsList";

export default cachedEventHandler(
  async (): Promise<{ events: EventListItem[] }> => {
    return { events: await getEventsList() };
  },
  {
    maxAge: 300,
    swr: false,
  }
);
