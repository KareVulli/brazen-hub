import { z } from "zod";
import { findUsers } from "../utils/brazen-api/findUser";
import type { BrazenAPIDetailedUser } from "../utils/brazen-api/models/apiUser";
import type { DBTopScore } from "../utils/score";
import { getTopScoresByUserId } from "../utils/score";
import type { DetailedBrazenUser } from "../utils/user";

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

export interface SearchUserMultipleResults {
  users: BrazenAPIDetailedUser[];
}

export interface SearchUserResult {
  user: DetailedBrazenUser;
  topScores: TopScore[];
}

function usersSearchResultDtoToSearchUserResult(
  user: DetailedBrazenUser,
  topScores: DBTopScore[]
): SearchUserResult {
  return {
    user: user,
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
  async (event): Promise<SearchUserResult | SearchUserMultipleResults> => {
    const config = useRuntimeConfig(event);
    const { query } = await getValidatedQuery(event, requestSchema.parse);

    const users = await findUsers(config.bzToken, query);

    if (users.length === 0) {
      throw createError({
        statusCode: 404,
        message: `Did not find the requested user`,
      });
    } else if (users.length === 1) {
      const user = users[0];
      const userId = await updateUserInDB(user);
      const topScores = await getTopScoresByUserId(userId);

      return usersSearchResultDtoToSearchUserResult(
        { id: userId, ...user },
        topScores
      );
    }

    return { users: users };
  },
  {
    maxAge: 60,
    swr: false,
  }
);
