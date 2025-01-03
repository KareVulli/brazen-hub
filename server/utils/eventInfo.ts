import {
  characterTable,
  scoreTable,
  userTable,
  weeklyScoreTable,
  weeklyTable,
} from "../database/schema";
import type {
  EventDto,
  EventInfoDto,
  EventLeaderboardDto,
} from "./brazen-api/getEventInfo";
import type { Character } from "./character";
import { characterFromDB } from "./character";
import type {
  DBRule,
  DBScore,
  DBUser,
  DBWeekly,
  DBWeeklyScore,
} from "./drizzle";
import type { RuleDto } from "./rule";

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
  rule: RuleDto | null;
  character: CharacterDto | null;
}

export interface BrazenApiEventInfo {
  eventId: number;
  endsAt: number;
  leaderboard: LeaderboardEntry[];
  worldRecord: LeaderboardEntry | null;
  ruleId: number | null;
  characterId: number | null;
  subWeaponId: number | null;
}

export async function writeToDB(raw: EventInfoDto, event: BrazenApiEventInfo) {
  const worldRecord = event.worldRecord;
  let worldRecordId: number | null = null;
  if (worldRecord) {
    const worldRecordUser = worldRecord.user;
    const [{ worldRecordUserId }] = await useDrizzle()
      .insert(userTable)
      .values({
        userKey: worldRecordUser.userKey,
        name: worldRecordUser.name,
        iconId: worldRecordUser.iconId,
        iconFrameId: worldRecordUser.iconFrameId,
      })
      .onConflictDoUpdate({
        target: userTable.userKey,
        set: {
          name: worldRecordUser.name,
          iconId: worldRecordUser.iconId,
          iconFrameId: worldRecordUser.iconFrameId,
        },
      })
      .returning({ worldRecordUserId: userTable.id });

    const result = await useDrizzle()
      .insert(scoreTable)
      .values({
        userId: worldRecordUserId,
        place: worldRecord.place,
        time: worldRecord.time,
        score: worldRecord.score,
        attempts: worldRecord.attempts,
      })
      .returning({ worldRecordId: scoreTable.id });

    worldRecordId = result[0].worldRecordId;
  }

  const [{ weeklyId }] = await useDrizzle()
    .insert(weeklyTable)
    .values({
      eventId: event.eventId,
      ruleId: event.ruleId,
      characterId: event.characterId,
      subWeaponId: event.subWeaponId,
      worldRecordId: worldRecordId,
      endsAt: event.endsAt,
      raw: raw,
    })
    .returning({ weeklyId: weeklyTable.id });

  for (let i = 0; i < event.leaderboard.length; i++) {
    const score = event.leaderboard[i];
    const scoreUser = score.user;

    const [{ scoreUserId }] = await useDrizzle()
      .insert(userTable)
      .values({
        userKey: scoreUser.userKey,
        name: scoreUser.name,
        iconId: scoreUser.iconId,
        iconFrameId: scoreUser.iconFrameId,
      })
      .onConflictDoUpdate({
        target: userTable.userKey,
        set: {
          name: scoreUser.name,
          iconId: scoreUser.iconId,
          iconFrameId: scoreUser.iconFrameId,
        },
      })
      .returning({ scoreUserId: userTable.id });

    const [{ scoreId }] = await useDrizzle()
      .insert(scoreTable)
      .values({
        userId: scoreUserId,
        place: score.place,
        time: score.time,
        score: score.score,
        attempts: score.attempts,
      })
      .returning({ scoreId: scoreTable.id });

    await useDrizzle().insert(weeklyScoreTable).values({
      weeklyId: weeklyId,
      scoreId: scoreId,
    });
  }

  console.log(`Created weekly ${weeklyId} to database.`);
}

export async function hasRecentEntry(maxAgeMs: number): Promise<boolean> {
  const weekly = await useDrizzle().query.weeklyTable.findFirst({
    where: gt(weeklyTable.createdAt, new Date(Date.now() - maxAgeMs)),
  });

  if (weekly === undefined) {
    return false;
  }
  return true;
}

export async function getLatest(): Promise<EventInfo | null> {
  const weekly: DBEventInfo | undefined =
    await useDrizzle().query.weeklyTable.findFirst({
      orderBy: [desc(weeklyTable.createdAt)],
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
        rule: true,
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
    await useDrizzle().query.weeklyTable.findFirst({
      where: eq(weeklyTable.eventId, eventId),
      orderBy: [desc(weeklyTable.createdAt)],
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
        rule: true,
      },
    });

  if (weekly === undefined) {
    return null;
  }
  return await eventInfoFromDB(weekly);
}

interface DBEventInfo extends DBWeekly {
  worldRecord:
    | (DBScore & {
        user: DBUser;
      })
    | null;
  weeklyScores: (DBWeeklyScore & {
    score: DBScore & {
      user: DBUser;
    };
  })[];
  rule: DBRule | null;
  characterId: number | null;
}
async function eventInfoFromDB(weekly: DBEventInfo): Promise<EventInfo> {
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

  let character: Character | null = null;
  if (weekly.characterId !== null && weekly.characterId > 0) {
    const dbCharacter = await useDrizzle().query.characterTable.findFirst({
      where: eq(characterTable.characterId, weekly.characterId),
      orderBy: [desc(characterTable.gameVersion)],
    });
    if (dbCharacter) {
      character = characterFromDB(dbCharacter);
    }
  }

  return {
    eventId: weekly.eventId,
    rule: weekly.rule,
    character: character,
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
): BrazenApiEventInfo | null {
  if (data.current_event) {
    return eventInfoFromDto(data.current_event, data.current_event_leaderboard);
  }

  return null;
}

export function previousEventInfoFromDto(
  data: EventInfoDto
): BrazenApiEventInfo | null {
  if (data.previous_event) {
    return eventInfoFromDto(
      data.previous_event,
      data.previous_event_leaderboard
    );
  }

  return null;
}

export function eventInfoFromDto(
  event: EventDto,
  leaderboard: EventLeaderboardDto | null
): BrazenApiEventInfo {
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
    ruleId: event.requirements.rule_id,
    characterId: event.requirements.character_id,
    subWeaponId: event.requirements.sub_weapon_id,
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
  };
}
