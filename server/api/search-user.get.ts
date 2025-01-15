import { z } from "zod";
import type { UsersSearchResultDto } from "../utils/brazen-api/findUser";
import { findFirstUser } from "../utils/brazen-api/findUser";
import type { DBTopScore } from "../utils/score";
import { getTopScoresByUserId } from "../utils/score";
import { updateUser } from "../utils/user";

export interface OnlineStatus {
  online: boolean;
  state: string;
  lastUpdate: number;
}

export interface TopScore {
  stageName: string;
  name: string;
  scoreId: number;
  weeklyId: number;
  ruleId: number;
  score: number;
  time: number;
  createdAt: number;
}

const requestSchema = z.object({
  query: z.coerce.string().min(1).max(64),
});

export interface SearchUserResult {
  user: BrazenUser;
  onlineStatus: OnlineStatus;
  topScores: TopScore[];
}

function usersSearchResultDtoToSearchUserResult(
  user: UsersSearchResultDto,
  topScores: DBTopScore[]
): SearchUserResult {
  return {
    user: {
      name: user.name,
      userKey: user.user_key,
      iconId: user.profile_icon_id,
      iconFrameId: user.profile_icon_frame_id,
    },
    onlineStatus: {
      online: user.online_status.is_online,
      state: user.online_status.state,
      lastUpdate: user.online_status.updated_at,
    },
    topScores: topScores.map((score) => ({
      stageName: score.stage_name,
      name: score.name,
      scoreId: score.score_id,
      weeklyId: score.weekly_id,
      ruleId: score.rule_id,
      score: score.score,
      time: score.time,
      createdAt: score.created_at,
    })),
  };
}

export default cachedEventHandler(
  async (event): Promise<SearchUserResult> => {
    const config = useRuntimeConfig(event);
    const { query } = await getValidatedQuery(event, requestSchema.parse);

    const user = await findFirstUser(config.bzToken, query);
    if (!user) {
      throw createError({
        statusCode: 404,
        message: `Did not find the requested user`,
      });
    }
    const userId = await updateUser(user);
    const topScores = await getTopScoresByUserId(userId);

    return usersSearchResultDtoToSearchUserResult(user, topScores);
  },
  {
    maxAge: 60 * 10,
  }
);
