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

export interface LeaderboardEntry {
  place: number;
  username: string;
  time: number;
  score: number;
  attempts: number;
}

export interface EventInfo {
  endsAt: number;
  leaderboard: LeaderboardEntry[];
  worldRecord: LeaderboardEntry;
}

function eventInfoFromDto(data: EventInfoDto): EventInfo {
  return {
    endsAt: data.current_event.end_at,
    leaderboard: data.current_event_leaderboard.list_data.map((row) => {
      return {
        place: row.place,
        username: row.user.name,
        time: row.record.duration_millisecond,
        score: row.record.total_score,
        attempts: row.record.attempts_at_per_character_and_rule,
      };
    }),
    worldRecord: {
      place: 1,
      username: data.current_event.world_record_holder.name,
      time: data.current_event.world_record.duration_millisecond,
      score: data.current_event.world_record.total_score,
      attempts:
        data.current_event.world_record.attempts_at_per_character_and_rule,
    },
  };
}

export default eventHandler(async (event): Promise<EventInfo> => {
  const config = useRuntimeConfig(event);
  let data = await hubKV().get<EventInfoDto>("weekly");
  if (data === null) {
    console.log("No data in keyvalue storage, calling brazen api...");
    const token = config.bzToken;
    data = await $fetch<EventInfoDto>(
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
    await hubKV().set("weekly", data, { ttl: config.cacheTime });
    console.log(
      `Got data from api, cached to kv for ${config.cacheTime} seconds`
    );
  } else {
    console.log("Got data from cache");
  }
  return eventInfoFromDto(data);
});
