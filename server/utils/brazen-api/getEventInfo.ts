import { brazenApiClient } from "./client";
import type { BrazenAPIUser } from "./models/apiUser";

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
  rule_id: number;
  character_id: number;
  sub_weapon_id: number;
}

interface EventRequirements {
  character_id: number;
  rule_id: number;
  sub_weapon_id: number;
}

interface EventDto {
  event_id: number;
  end_at: number;
  world_record: SoloScoreGameRecordEntryDto | null;
  world_record_holder: UserDto | null;
  requirements: EventRequirements;
}

interface EventLeaderboardDto {
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

export interface BrazenApiLeaderboardEntry {
  place: number;
  user: BrazenAPIUser;
  time: number;
  score: number;
  attempts: number;
  setAt: number;
  ruleId: number;
  characterId: number;
  subWeaponId: number;
}

export interface BrazenApiEventInfo {
  eventId: number;
  endsAt: number;
  leaderboard: BrazenApiLeaderboardEntry[];
  worldRecord: BrazenApiLeaderboardEntry | null;
  ruleId: number | null;
  characterId: number | null;
  subWeaponId: number | null;
}

export function eventInfoFromDto(
  event: EventDto,
  leaderboard: EventLeaderboardDto | null
): BrazenApiEventInfo {
  let worldRecord: BrazenApiLeaderboardEntry | null = null;
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
      ruleId: event.world_record.rule_id,
      characterId: event.world_record.character_id,
      subWeaponId: event.world_record.sub_weapon_id,
      setAt: event.world_record.timestamp,
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
        ruleId: row.record.rule_id,
        characterId: row.record.character_id,
        subWeaponId: row.record.sub_weapon_id,
        setAt: row.record.timestamp,
      };
    }),
    worldRecord: worldRecord,
  };
}

export interface BrazenApiEventInfoResponse {
  currentEvent: BrazenApiEventInfo | null;
  previousEvent: BrazenApiEventInfo | null;
}

export function eventInfoResponseFromDto(
  response: EventInfoDto
): BrazenApiEventInfoResponse {
  let currentEvent: BrazenApiEventInfo | null = null;
  if (response.current_event) {
    currentEvent = eventInfoFromDto(
      response.current_event,
      response.current_event_leaderboard
    );
  }
  let previousEvent: BrazenApiEventInfo | null = null;
  if (response.previous_event) {
    previousEvent = eventInfoFromDto(
      response.previous_event,
      response.previous_event_leaderboard
    );
  }
  return {
    currentEvent: currentEvent,
    previousEvent: previousEvent,
  };
}

export async function getRawEventInfo(token: string): Promise<EventInfoDto> {
  return await brazenApiClient<EventInfoDto>("solo_score_game/v1/event_info", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
