import { isNull } from "drizzle-orm";
import type { EventInfoDto } from "../utils/brazen-api/getEventInfo";
import { eventInfoFromDto } from "../utils/eventInfo";

export async function migrateRuleIds() {
  const weeklies = await useDrizzle()
    .select({
      id: tables.weekly.id,
      raw: tables.weekly.raw,
      eventId: tables.weekly.eventId,
    })
    .from(tables.weekly)
    .where(isNull(tables.weekly.ruleId));

  console.log(
    "Migrating",
    weeklies.length,
    "weeklies: Parsing ruleIds into field"
  );
  for (let i = 0; i < weeklies.length; i++) {
    const weekly = weeklies[i];
    const rawData = weekly.raw as EventInfoDto;
    let data: BrazenApiEventInfo;
    if (rawData.current_event?.event_id === weekly.eventId) {
      data = eventInfoFromDto(
        rawData.current_event,
        rawData.current_event_leaderboard
      );
    } else if (rawData.previous_event?.event_id === weekly.eventId) {
      data = eventInfoFromDto(
        rawData.previous_event,
        rawData.previous_event_leaderboard
      );
    } else {
      console.error(
        "Migrating weeklies: Did not find event raw data for Weekly ID",
        weekly.id
      );
      continue;
    }

    await useDrizzle()
      .update(tables.weekly)
      .set({
        ruleId: data.ruleId,
      })
      .where(eq(tables.weekly.id, weekly.id));
  }
  console.log("Migrating weeklies: Done");
}

export default defineNitroPlugin(() => {
  onHubReady(async () => {
    migrateRuleIds();
  });
});
