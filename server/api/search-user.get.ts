import { z } from "zod";
import { findUsers } from "../utils/brazen-api/findUser";
import type { BrazenAPIDetailedUser } from "../utils/brazen-api/models/apiUser";
import type { UserScore } from "../utils/score";
import { getUserTopScores } from "../utils/score";
import type { DetailedBrazenUser } from "../utils/user";

const requestSchema = z.object({
  query: z.coerce.string().min(1).max(64),
});

export interface SearchUserMultipleResults {
  users: BrazenAPIDetailedUser[];
}

export interface SearchUserResult {
  user: DetailedBrazenUser;
  topScores: UserScore[];
}

function usersSearchResultDtoToSearchUserResult(
  user: DetailedBrazenUser,
  topScores: UserScore[]
): SearchUserResult {
  return {
    user: user,
    topScores: topScores,
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
      const topScores = await getUserTopScores(userId);

      return usersSearchResultDtoToSearchUserResult(
        { id: userId, ...user },
        topScores
      );
    }

    return { users: users };
  },
  {
    swr: false,
  }
);
