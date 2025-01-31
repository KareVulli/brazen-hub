import { z } from "zod";
import { gte, inArray, lte } from "drizzle-orm";
import {
  scoreTable,
  weeklyScoreTable,
  weeklyTable,
} from "~~/server/database/schema";
import type {
  BrazenApiEventInfo,
  EventInfoDto,
} from "~~/server/utils/brazen-api/getEventInfo";
import { eventInfoResponseFromDto } from "~~/server/utils/brazen-api/getEventInfo";
import { writeLeaderboardToDB } from "~~/server/utils/eventInfo";
import type { DBWeekly } from "~~/server/utils/drizzle";

const requestSchema = z.object({
  start: z.number().positive(),
  end: z.number().positive(),
});

async function updateScore(
  id: number,
  ruleId: number,
  characterId: number,
  subWeaponId: number,
  setAt: number
) {
  return useDrizzle()
    .update(scoreTable)
    .set({
      ruleId: ruleId,
      characterId: characterId,
      subWeaponId: subWeaponId,
      setAt: setAt,
    })
    .where(eq(scoreTable.id, id));
}

async function migrateWeekly(
  weekly: DBWeekly & { worldRecord: DBScore | null }
) {
  const prefix = `[${weekly.id}]`;

  const rawData = eventInfoResponseFromDto(weekly.raw as EventInfoDto);

  let eventData: BrazenApiEventInfo;
  if (rawData.currentEvent?.eventId === weekly.eventId) {
    console.log(`${prefix} Using currentEvent`);
    eventData = rawData.currentEvent;
  } else if (rawData.previousEvent?.eventId === weekly.eventId) {
    eventData = rawData.previousEvent;
    console.log(`${prefix} Using previousEvent`);
  } else {
    throw createError({
      statusCode: 400,
      message: `Could not find raw data for eventId ${weekly.eventId} (row id: ${weekly.id})`,
    });
  }

  const promises: Promise<unknown>[] = [];

  if (weekly.worldRecordId && eventData.worldRecord) {
    const { ruleId, characterId, subWeaponId, setAt } = eventData.worldRecord;
    promises.push(
      updateScore(weekly.worldRecordId, ruleId, characterId, subWeaponId, setAt)
    );
  }

  const deletedScoreIds = await useDrizzle()
    .delete(weeklyScoreTable)
    .where(eq(weeklyScoreTable.weeklyId, weekly.id))
    .returning({
      scoreId: weeklyScoreTable.scoreId,
    });
  await useDrizzle()
    .delete(scoreTable)
    .where(
      inArray(
        scoreTable.id,
        deletedScoreIds.map((item) => item.scoreId)
      )
    );
  await writeLeaderboardToDB(weekly.id, eventData.leaderboard, false);
  console.log(`${prefix}   Done`);
}

export default eventHandler(async (event): Promise<void> => {
  checkAllowedToUpdate(event);
  const request = await readValidatedBody(event, requestSchema.parse);

  console.log(
    `Populating scores with ruleset data for weeklies with IDs between ${request.start} and ${request.end} inclusive...`
  );

  const weeklies = await useDrizzle().query.weeklyTable.findMany({
    where: and(
      gte(weeklyTable.id, request.start),
      lte(weeklyTable.id, request.end)
    ),
    with: {
      worldRecord: true,
    },
    orderBy: [asc(weeklyTable.id), asc(weeklyScoreTable.id)],
  });

  const weeklyCount = weeklies.length;

  const chunkSize = 50;
  for (let i = 0; i < weeklyCount; i += chunkSize) {
    const prefix = `[${i} - ${i + chunkSize}]`;
    const chunk = weeklies.slice(i, i + chunkSize);
    const promises = [];
    for (let j = 0; j < chunk.length; j++) {
      const weekly = chunk[j];
      promises.push(migrateWeekly(weekly));
    }
    console.log(prefix + " Queued! Waiting for completion...");
    await Promise.all(promises);
    console.log(prefix + " Done!");
  }

  console.log("Migration: Done");
});
