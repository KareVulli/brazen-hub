import type { BrazenUser } from "../user";
import { staticApiClient } from "./client";

interface RTMLeaderboardEntryDto {
  player_code: string;
  rank: number;
  profile: {
    name: string;
    icon_image_url: string;
    icon_frame_image_url: string;
  };
  metrics: {
    win: number;
  };
}

interface RTMLeaderboardDto {
  updated_at: string;
  data_term_begin: string;
  data_term_end: string;
  data: RTMLeaderboardEntryDto[];
  week: {
    begin_date: string;
    end_date: string;
  };
}

export interface RTMLeaderboardEntry {
  place: number;
  user: BrazenUser;
  wins: number;
}

export interface RTMLeaderboard {
  updatedAt: string;
  startedAt: string;
  endsAt: string;
  entries: RTMLeaderboardEntry[];
}

function rtmLeaderboardFromDto(leaderboard: RTMLeaderboardDto): RTMLeaderboard {
  return {
    updatedAt: leaderboard.updated_at,
    startedAt: leaderboard.data_term_begin,
    endsAt: leaderboard.data_term_end,
    entries: leaderboard.data.map((entry) => {
      const iconIdURLSegments = entry.profile.icon_image_url
        .split("/")
        .filter((segment) => segment);
      const iconFrameIdURLSegments = entry.profile.icon_frame_image_url
        .split("/")
        .filter((segment) => segment);
      const iconId = Number.parseInt(
        iconIdURLSegments[iconIdURLSegments.length - 1].replace(".png", "")
      );
      const iconFrameId = Number.parseInt(
        iconFrameIdURLSegments[iconFrameIdURLSegments.length - 1].replace(
          ".png",
          ""
        )
      );

      return {
        place: entry.rank,
        user: {
          userKey: entry.player_code,
          name: entry.profile.name,
          iconId: iconId,
          iconFrameId: iconFrameId,
        },
        wins: entry.metrics.win,
      };
    }),
  };
}

export async function getWeeklyLeaderboard(): Promise<RTMLeaderboard> {
  return rtmLeaderboardFromDto(
    await staticApiClient<RTMLeaderboardDto>("/leaderboard/weekly/latest.json")
  );
}
