import type {
  EventDto,
  EventInfoDto,
  EventLeaderboardDto,
} from "./brazen-api/getEventInfo";
import type { WeeklyScore } from "./drizzle";

export interface BrazenUser {
  name: string;
  userKey: string;
  iconId: number;
  iconFrameId: number;
}

export interface LeaderboardEntry {
  place: number;
  user: BrazenUser;
  time: number;
  score: number;
  attempts: number;
}

export interface EventInfo {
  eventId: number;
  endsAt: number;
  leaderboard: LeaderboardEntry[];
  worldRecord: LeaderboardEntry | null;
  updatedAt: number;
}

export async function writeToDB(
  raw: EventInfoDto,
  event: Omit<EventInfo, "updatedAt">
) {
  const worldRecord = event.worldRecord;
  let worldRecordId: number | null = null;
  if (worldRecord) {
    const worldRecordUser = worldRecord.user;
    const [{ worldRecordUserId }] = await useDrizzle()
      .insert(tables.user)
      .values({
        userKey: worldRecordUser.userKey,
        name: worldRecordUser.name,
        iconId: worldRecordUser.iconId,
        iconFrameId: worldRecordUser.iconFrameId,
      })
      .onConflictDoUpdate({
        target: tables.user.userKey,
        set: {
          name: worldRecordUser.name,
          iconId: worldRecordUser.iconId,
          iconFrameId: worldRecordUser.iconFrameId,
        },
      })
      .returning({ worldRecordUserId: tables.user.id });

    const result = await useDrizzle()
      .insert(tables.score)
      .values({
        userId: worldRecordUserId,
        place: worldRecord.place,
        time: worldRecord.time,
        score: worldRecord.score,
        attempts: worldRecord.attempts,
      })
      .returning({ worldRecordId: tables.score.id });

    worldRecordId = result[0].worldRecordId;
  }

  const [{ weeklyId }] = await useDrizzle()
    .insert(tables.weekly)
    .values({
      eventId: event.eventId,
      worldRecordId: worldRecordId,
      endsAt: event.endsAt,
      raw: raw,
    })
    .returning({ weeklyId: tables.weekly.id });

  for (let i = 0; i < event.leaderboard.length; i++) {
    const score = event.leaderboard[i];
    const scoreUser = score.user;

    const [{ scoreUserId }] = await useDrizzle()
      .insert(tables.user)
      .values({
        userKey: scoreUser.userKey,
        name: scoreUser.name,
        iconId: scoreUser.iconId,
        iconFrameId: scoreUser.iconFrameId,
      })
      .onConflictDoUpdate({
        target: tables.user.userKey,
        set: {
          name: scoreUser.name,
          iconId: scoreUser.iconId,
          iconFrameId: scoreUser.iconFrameId,
        },
      })
      .returning({ scoreUserId: tables.user.id });

    const [{ scoreId }] = await useDrizzle()
      .insert(tables.score)
      .values({
        userId: scoreUserId,
        place: score.place,
        time: score.time,
        score: score.score,
        attempts: score.attempts,
      })
      .returning({ scoreId: tables.score.id });

    await useDrizzle()
      .insert(tables.weeklyScore)
      .values({
        weeklyId: weeklyId,
        scoreId: scoreId,
      })
      .returning({ weeklyScoreId: tables.score.id });
  }

  console.log(`Created weekly ${weeklyId} to database.`);
}

export async function hasRecentEntry(maxAgeMs: number): Promise<boolean> {
  const weekly = await useDrizzle().query.weekly.findFirst({
    where: gt(tables.weekly.createdAt, new Date(Date.now() - maxAgeMs)),
  });

  if (weekly === undefined) {
    return false;
  }
  return true;
}

export async function getLatest(): Promise<EventInfo | null> {
  const weekly: DBEventInfo | undefined =
    await useDrizzle().query.weekly.findFirst({
      orderBy: [desc(tables.weekly.createdAt)],
      with: {
        worldRecord: {
          with: {
            user: true,
          },
        },
        weeklyScores: {
          with: {
            score: {
              with: {
                user: true,
              },
            },
          },
        },
      },
    });
  if (weekly === undefined) {
    return null;
  }
  console.log("Got latest! ID:", weekly.id);
  return eventInfoFromDB(weekly);
}

export async function getEventInfoByEventId(
  eventId: number
): Promise<EventInfo | null> {
  const weekly: DBEventInfo | undefined =
    await useDrizzle().query.weekly.findFirst({
      where: eq(tables.weekly.eventId, eventId),
      orderBy: [desc(tables.weekly.createdAt)],
      with: {
        worldRecord: {
          with: {
            user: true,
          },
        },
        weeklyScores: {
          with: {
            score: {
              with: {
                user: true,
              },
            },
          },
        },
      },
    });

  if (weekly === undefined) {
    return null;
  }
  return eventInfoFromDB(weekly);
}

interface DBEventInfo extends Weekly {
  worldRecord:
    | (Score & {
        user: User;
      })
    | null;
  weeklyScores: (WeeklyScore & {
    score: Score & {
      user: User;
    };
  })[];
}
function eventInfoFromDB(weekly: DBEventInfo): EventInfo {
  let worldRecord: LeaderboardEntry | null = null;
  if (weekly.worldRecord) {
    worldRecord = {
      place: 1,
      user: {
        name: weekly.worldRecord.user.name,
        userKey: weekly.worldRecord.user.userKey,
        iconFrameId: weekly.worldRecord.user.iconFrameId,
        iconId: weekly.worldRecord.user.iconId,
      },
      time: weekly.worldRecord.time,
      score: weekly.worldRecord.score,
      attempts: weekly.worldRecord.attempts,
    };
  }

  return {
    eventId: weekly.eventId,
    endsAt: weekly.endsAt,
    leaderboard: weekly.weeklyScores.map((row) => {
      return {
        place: row.score.place,
        user: {
          name: row.score.user.name,
          userKey: row.score.user.userKey,
          iconFrameId: row.score.user.iconFrameId,
          iconId: row.score.user.iconId,
        },
        time: row.score.time,
        score: row.score.score,
        attempts: row.score.attempts,
      };
    }),
    worldRecord: worldRecord,
    updatedAt: weekly.createdAt.getTime(),
  };
}

export function currentEventInfoFromDto(
  data: EventInfoDto
): Omit<EventInfo, "updatedAt"> | null {
  if (data.current_event) {
    return eventInfoFromDto(data.current_event, data.current_event_leaderboard);
  }

  return null;
}

export function previousEventInfoFromDto(data: EventInfoDto): EventInfo | null {
  if (data.previous_event) {
    return eventInfoFromDto(
      data.previous_event,
      data.previous_event_leaderboard
    );
  }

  return null;
}

function eventInfoFromDto(
  event: EventDto,
  leaderboard: EventLeaderboardDto | null
): EventInfo {
  let worldRecord: LeaderboardEntry | null = null;
  if (event.world_record && event.world_record_holder) {
    worldRecord = {
      place: 1,
      user: {
        name: event.world_record_holder.name,
        userKey: event.world_record_holder.user_key,
        iconFrameId: event.world_record_holder.icon_frame_id,
        iconId: event.world_record_holder.icon_id,
      },
      time: event.world_record.duration_millisecond,
      score: event.world_record.total_score,
      attempts: event.world_record.attempts_at_per_character_and_rule,
    };
  }

  return {
    eventId: event.event_id,
    endsAt: event.end_at,
    leaderboard: (leaderboard?.list_data || []).map((row) => {
      return {
        place: row.place,
        user: {
          name: row.user.name,
          userKey: row.user.user_key,
          iconFrameId: row.user.icon_frame_id,
          iconId: row.user.icon_id,
        },
        time: row.record.duration_millisecond,
        score: row.record.total_score,
        attempts: row.record.attempts_at_per_character_and_rule,
      };
    }),
    worldRecord: worldRecord,
    updatedAt: Date.now(),
  };
}
