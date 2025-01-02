import { weeklyTable } from "../database/schema";

export interface EventListItem {
  eventId: number;
  eventName: string;
  endsAt: number;
  createdAt: number;
}

export async function getEventsList(): Promise<EventListItem[]> {
  const weeklies = await useDrizzle()
    .select({
      eventId: weeklyTable.eventId,
      endsAt: sql<number>`max(${weeklyTable.endsAt})`,
      createdAt: sql<number>`max(${weeklyTable.createdAt})`,
    })
    .from(weeklyTable)
    .groupBy(weeklyTable.eventId)
    .orderBy(desc(weeklyTable.endsAt), desc(weeklyTable.createdAt));

  const count = weeklies.length;
  return weeklies.map((weekly, index) => ({
    eventId: weekly.eventId,
    eventName: `Week ${count - index + 1}`,
    endsAt: weekly.endsAt,
    createdAt: weekly.createdAt,
  }));
}
