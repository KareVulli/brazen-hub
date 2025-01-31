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
      weeklyScores: true,
      worldRecord: true,
    },
    orderBy: [asc(weeklyTable.id), asc(weeklyScoreTable.id)],
  });

  const weeklyCount = weeklies.length;
  for (let i = 0; i < weeklyCount; i++) {
    const weekly = weeklies[i];
    const prefix = `[${i + 1}/${weeklyCount}]`;
    console.log(
      `${prefix} Populating weekly id ${weekly.id} eventId: ${weekly.eventId}`
    );

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
      const { score, ruleId, characterId, subWeaponId, setAt } =
        eventData.worldRecord;
      promises.push(
        updateScore(
          weekly.worldRecordId,
          ruleId,
          characterId,
          subWeaponId,
          setAt
        )
      );
      console.log(
        `${prefix}   Updated world record ${weekly.worldRecordId}. Original score ${weekly.worldRecord?.score} matching score: ${score}`
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
    console.log(
      `${prefix}     Deleted existing ${deletedScoreIds.length} scores...`
    );
    const createdWeeklyScoreIds = await writeLeaderboardToDB(
      weekly.id,
      eventData.leaderboard,
      false
    );
    console.log(
      `${prefix}     Created ${createdWeeklyScoreIds.length} new scores...`
    );
  }

  console.log("Migration: Done");
});
