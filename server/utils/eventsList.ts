export interface EventListItem {
  eventId: number;
  endsAt: number;
  createdAt: number;
}

export async function getEventsList(): Promise<EventListItem[]> {
  console.log("ysy");
  const weeklies = await useDrizzle()
    .select({
      eventId: tables.weekly.eventId,
      endsAt: sql<number>`max(${tables.weekly.endsAt})`,
      createdAt: sql<number>`max(${tables.weekly.createdAt})`,
    })
    .from(tables.weekly)
    .groupBy(tables.weekly.eventId)
    .orderBy(desc(tables.weekly.endsAt), desc(tables.weekly.createdAt));

  return weeklies.map((weekly) => ({
    eventId: weekly.eventId,
    endsAt: weekly.endsAt,
    createdAt: weekly.createdAt,
  }));
}
