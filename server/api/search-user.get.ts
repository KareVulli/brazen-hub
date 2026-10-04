import { z } from "zod";
import { matchTable, userTable } from "../db/schema";
import { findUsers } from "../utils/brazen-api/findUser";
import type { BrazenAPIDetailedUser } from "../utils/brazen-api/models/apiUser";
import type { UserMatchStats } from "../utils/match";
import { getUserMatchStats } from "../utils/match";
import type { UserScore } from "../utils/score";
import { getUserTopScores } from "../utils/score";
import { getPaginatedUsers, type DetailedBrazenUser } from "../utils/user";

const requestSchema = z.object({
  query: z.coerce.string().trim().min(1).max(64),
});

export interface SearchUserMultipleResults {
  users: (BrazenAPIUser | BrazenAPIDetailedUser)[];
}

export interface SearchUserResult {
  user: DetailedBrazenUser;
  topScores: UserScore[];
  recentMatches: MatchDto[];
  stats: UserMatchStats;
}

export default cachedEventHandler(
  async (event): Promise<SearchUserResult | SearchUserMultipleResults> => {
    const config = useRuntimeConfig(event);
    const { query } = await getValidatedQuery(event, requestSchema.parse);

    const users = await findUsers(config.bzToken, query);

    if (users.length === 0) {
      return {
        users: (
          await getPaginatedUsers(
            {
              page: 1,
              pageSize: 50,
              sort: userTable.userKey,
              sortDirection: "asc",
            },
            { query: query },
          )
        ).results,
      };
    } else if (users.length === 1) {
      const user = users[0]!;
      const userId = await updateUserInDB(user);
      const topScores = await getUserTopScores(userId);
      const recentMatches = await getPaginatedMatches(
        {
          page: 1,
          pageSize: 5,
          sort: matchTable.createdAt,
          sortDirection: "desc",
        },
        { players: [user.userKey] },
      );
      const stats = await getUserMatchStats(userId);

      return {
        user: { id: userId, ...user },
        topScores: topScores,
        recentMatches: recentMatches.results,
        stats: stats,
      };
    }

    return { users: users };
  },
  {
    maxAge: 300,
    swr: false,
  },
);
