import { weeklyTable } from "../db/schema";

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
      week: weeklyTable.week,
      endsAt: sql<number>`max(${weeklyTable.endsAt})`,
      createdAt: sql<number>`max(${weeklyTable.createdAt})`,
    })
    .from(weeklyTable)
    .groupBy(weeklyTable.eventId)
    .orderBy(desc(weeklyTable.endsAt), desc(weeklyTable.createdAt));

  return weeklies.map((weekly) => ({
    eventId: weekly.eventId,
    eventName: `Week ${weekly.week}`,
    endsAt: weekly.endsAt,
    createdAt: weekly.createdAt,
  }));
}
