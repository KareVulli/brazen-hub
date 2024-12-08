interface UserDto {
  name: string;
  user_key: string;
  icon_id: number;
  icon_frame_id: number;
}

interface SoloScoreGameRecordEntryDto {
  attempts_at_per_character_and_rule: number;
  duration_millisecond: number;
  total_score: number;
  timestamp: number;
}

interface EventInfoDto {
  current_event: {
    event_id: number;
    end_at: number;
    world_record: SoloScoreGameRecordEntryDto;
    world_record_holder: UserDto;
  };
  current_event_leaderboard: {
    list_data: {
      place: number;
      record: SoloScoreGameRecordEntryDto;
      user: UserDto;
    }[];
  };
}

export interface User {
  name: string;
  userKey: string;
  iconId: number;
  iconFrameId: number;
}

export interface LeaderboardEntry {
  place: number;
  user: User;
  time: number;
  score: number;
  attempts: number;
}

export interface EventInfo {
  eventId: number;
  endsAt: number;
  leaderboard: LeaderboardEntry[];
  worldRecord: LeaderboardEntry;
}

function eventInfoFromDto(data: EventInfoDto): EventInfo {
  return {
    eventId: data.current_event.event_id,
    endsAt: data.current_event.end_at,
    leaderboard: data.current_event_leaderboard.list_data.map((row) => {
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
    worldRecord: {
      place: 1,
      user: {
        name: data.current_event.world_record_holder.name,
        userKey: data.current_event.world_record_holder.user_key,
        iconFrameId: data.current_event.world_record_holder.icon_frame_id,
        iconId: data.current_event.world_record_holder.icon_id,
      },
      time: data.current_event.world_record.duration_millisecond,
      score: data.current_event.world_record.total_score,
      attempts:
        data.current_event.world_record.attempts_at_per_character_and_rule,
    },
  };
}

export default cachedEventHandler(
  async (event): Promise<EventInfo> => {
    const config = useRuntimeConfig(event);

    console.log(
      "No recent data in keyvalue storage, trying to get from database..."
    );
    let data = await getLatestFromDB(config.refreshTime * 1000);

    if (data !== null) {
      console.log("Got data from db");
      return data;
    }
    console.log("No recent data in db, getting from brazen api...");

    const token = config.bzToken;
    const rawData = await $fetch<EventInfoDto>(
      "https://api.prod.brazenblaze.com/solo_score_game/v1/event_info",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Asset-Version":
            "2024112100/steam-pc/f4660683b17573ac877565beb13f665296590ab4",
          "Client-Version": "1.8.1",
          Platform: "steam_pc",
        },
      }
    );

    data = eventInfoFromDto(rawData);
    await writeToDB(rawData, data);
    return data;
  },
  {
    maxAge: 60,
  }
);

async function writeToDB(raw: EventInfoDto, event: EventInfo) {
  const worldRecord = event.worldRecord;
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

  const [{ worldRecordId }] = await useDrizzle()
    .insert(tables.score)
    .values({
      userId: worldRecordUserId,
      place: worldRecord.place,
      time: worldRecord.time,
      score: worldRecord.score,
      attempts: worldRecord.attempts,
    })
    .returning({ worldRecordId: tables.score.id });

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

async function getLatestFromDB(maxAgeMs: number): Promise<EventInfo | null> {
  console.log("Getting event from database...");
  const weekly = await useDrizzle().query.weekly.findFirst({
    where: gt(tables.weekly.createdAt, new Date(Date.now() - maxAgeMs)),
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
    worldRecord: {
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
    },
  };
}
