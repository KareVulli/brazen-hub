import { brazenApiClient } from "./client";

export interface UserDto {
  name: string;
  user_key: string;
  icon_id: number;
  icon_frame_id: number;
}

export interface SoloScoreGameRecordEntryDto {
  attempts_at_per_character_and_rule: number;
  duration_millisecond: number;
  total_score: number;
  timestamp: number;
}

export interface EventRequirements {
  character_id: number;
  rule_id: number;
  sub_weapon_id: number;
}

export interface EventDto {
  event_id: number;
  end_at: number;
  world_record: SoloScoreGameRecordEntryDto | null;
  world_record_holder: UserDto | null;
  requirements: EventRequirements;
}

export interface EventLeaderboardDto {
  list_data: {
    place: number;
    record: SoloScoreGameRecordEntryDto;
    user: UserDto;
  }[];
}

export interface EventInfoDto {
  current_event: EventDto | null;
  current_event_leaderboard: EventLeaderboardDto | null;
  previous_event: EventDto | null;
  previous_event_leaderboard: EventLeaderboardDto | null;
}

export async function getEventInfo(token: string): Promise<EventInfoDto> {
  return await brazenApiClient<EventInfoDto>("solo_score_game/v1/event_info", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
