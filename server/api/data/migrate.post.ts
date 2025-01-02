import { isNull } from "drizzle-orm";
import { weeklyTable } from "~~/server/database/schema";
import type { EventInfoDto } from "~~/server/utils/brazen-api/getEventInfo";

export default eventHandler(async (event): Promise<void> => {
  checkAllowedToUpdate(event);

  const weeklies = await useDrizzle()
    .select({
      id: weeklyTable.id,
      raw: weeklyTable.raw,
      eventId: weeklyTable.eventId,
    })
    .from(weeklyTable)
    .where(isNull(weeklyTable.characterId));
  console.log(
    "Migrating",
    weeklies.length,
    "weeklies: Parsing character_id and sub_weapon_id into table fields"
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
      .update(weeklyTable)
      .set({
        characterId: data.characterId,
        subWeaponId: data.subWeaponId,
      })
      .where(eq(weeklyTable.id, weekly.id));
  }
  console.log("Migrating weeklies: Done");
});
