export interface EventListItem {
  eventId: number;
  eventName: string;
  endsAt: number;
  createdAt: number;
}

export async function getEventsList(): Promise<EventListItem[]> {
  const weeklies = await useDrizzle()
    .select({
      eventId: tables.weekly.eventId,
      endsAt: sql<number>`max(${tables.weekly.endsAt})`,
      createdAt: sql<number>`max(${tables.weekly.createdAt})`,
    })
    .from(tables.weekly)
    .groupBy(tables.weekly.eventId)
    .orderBy(desc(tables.weekly.endsAt), desc(tables.weekly.createdAt));

  const count = weeklies.length;
  return weeklies.map((weekly, index) => ({
    eventId: weekly.eventId,
    eventName: `Week ${count - index + 1}`,
    endsAt: weekly.endsAt,
    createdAt: weekly.createdAt,
  }));
}
