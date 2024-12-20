import { getLatest, type EventInfo } from "~~/server/utils/eventInfo";

export default cachedEventHandler(
  async (): Promise<{ event: EventInfo | null }> => {
    return { event: await getLatest() };
  },
  {
    maxAge: 60,
    swr: false,
  }
);
