import { weeklyTable } from "../db/schema";

export interface EventListItem {
  eventId: number;
  eventName: string;
  endsAt: number;
}

export async function getEventsList(): Promise<EventListItem[]> {
  const weeklies = await useDrizzle()
    .select({
      eventId: weeklyTable.eventId,
      week: weeklyTable.week,
      endsAt: sql<number>`max(${weeklyTable.endsAt})`,
    })
    .from(weeklyTable)
    .groupBy(weeklyTable.eventId)
    .orderBy(desc(weeklyTable.eventId));

  return weeklies.map((weekly) => ({
    eventId: weekly.eventId,
    eventName: `Week ${weekly.week}`,
    endsAt: weekly.endsAt,
  }));
}
