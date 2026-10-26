import { gte, inArray } from "drizzle-orm";
import { Player, Team, TeamDuel } from "teslo";
import { matchTable, ratingTable } from "../db/schema";
import { buildConflictUpdateColumns } from "./drizzle";
import { getMatchesQuery, mergeRows } from "./match";
import type { UserStat } from "./ranking";

const INITIAL_RATING = 1000;

interface UserRating {
  matches: number;
  player: Player;
}

export async function getRankingByRating(): Promise<UserStat[]> {
  const stats = await useDrizzle().query.ratingTable.findMany({
    with: {
      user: true,
    },
    where: gte(ratingTable.matches, 10),
    limit: 100,
    orderBy: desc(ratingTable.rating),
  });

  return stats.map((item) => ({
    user: item.user,
    statPerRound: item.rating,
    matches: item.matches,
  }));
}

export async function getRating(userId: number): Promise<UserRating> {
  const rating = await useDrizzle().query.ratingTable.findFirst({
    where: eq(ratingTable.userId, userId),
  });
  if (!rating) {
    return { matches: 0, player: new Player(String(userId), INITIAL_RATING) };
  }
  return {
    matches: rating.matches,
    player: new Player(String(userId), rating.rating),
  };
}

export async function getRatings(userIds: number[]): Promise<UserRating[]> {
  const ratings = await useDrizzle().query.ratingTable.findMany({
    where: inArray(ratingTable.userId, userIds),
  });

  const userRatings = [];
  for (const userId of userIds) {
    const rating = ratings.find((rating) => rating.userId === userId);
    if (!rating) {
      userRatings.push({
        matches: 0,
        player: new Player(String(userId), INITIAL_RATING),
      });
    } else {
      userRatings.push({
        matches: rating.matches,
        player: new Player(String(userId), rating.rating),
      });
    }
  }
  return userRatings;
}

export async function setRating(rating: UserRating): Promise<void> {
  await useDrizzle()
    .insert(ratingTable)
    .values({
      userId: Number.parseInt(rating.player.id),
      rating: rating.player.elo,
      matches: rating.matches,
    })
    .onConflictDoUpdate({
      target: ratingTable.userId,
      set: {
        rating: rating.player.elo,
        matches: rating.matches,
      },
    });
}

export async function setRatings(rating: UserRating[]): Promise<void> {
  await useDrizzle()
    .insert(ratingTable)
    .values(
      rating.map((item) => ({
        userId: Number.parseInt(item.player.id),
        rating: item.player.elo,
        matches: item.matches,
      })),
    )
    .onConflictDoUpdate({
      target: ratingTable.userId,
      set: buildConflictUpdateColumns(ratingTable, ["rating", "matches"]),
    });
}

export interface UnrankedMatchRating {
  state: "unranked" | "unranked_imbalanced";
}

export interface RankedMatchRating {
  state: "ranked_ongoing";
  diff: {
    userId: number;
    rating: number;
    diffWin: number;
    diffLoss: number;
  }[];
}

export interface CompletedMatchRating {
  state: "ranked_finished";
  diff: {
    userId: number;
    oldRating: number;
    diff: number;
  }[];
  ratings: UserRating[];
}

export type MatchRating =
  | UnrankedMatchRating
  | RankedMatchRating
  | CompletedMatchRating;

function cloneUserRatings(userRatings: UserRating[]): UserRating[] {
  const newRatings: UserRating[] = [];
  for (const userRating of userRatings) {
    newRatings.push({
      matches: userRating.matches,
      player: new Player(userRating.player.id, userRating.player.elo),
    });
  }
  return newRatings;
}

function simulateRankedMatch(
  teamARatings: UserRating[],
  teamBRatings: UserRating[],
  winnerTeam: "A" | "B",
  kFactor: number,
): (UserRating & { won: boolean })[] {
  const clonedARatings = cloneUserRatings(teamARatings).map((item) => ({
    ...item,
    won: winnerTeam === "A",
  }));
  const clonedBRatings = cloneUserRatings(teamBRatings).map((item) => ({
    ...item,
    won: winnerTeam === "B",
  }));
  const teams = [
    new Team(
      "A",
      clonedARatings.map((userRating) => userRating.player),
    ),
    new Team(
      "B",
      clonedBRatings.map((userRating) => userRating.player),
    ),
  ];
  const eloMatch = new TeamDuel(teams, { kFactor: kFactor });
  eloMatch.calculate(winnerTeam);

  const userRatings = [...clonedARatings, ...clonedBRatings].map((item) => ({
    ...item,
    matches: item.matches + 1,
  }));
  return userRatings;
}

export async function getMatchRating(match: Match): Promise<MatchRating> {
  let oldRatings: Record<string, number> = {};

  if (["Duel", "RoundMatch"].includes(match.gameRule.gameRuleType)) {
    const teamA = match.teams[0]!;
    const teamB = match.teams[1]!;
    const teamAPlayers = teamA.teamUsers;
    const teamBPlayers = teamB.teamUsers;

    if (teamAPlayers.length !== teamBPlayers.length) {
      return { state: "unranked_imbalanced" };
    }

    const teamARatings = await getRatings(
      teamAPlayers.map((item) => item.user.id),
    );
    const teamBRatings = await getRatings(
      teamBPlayers.map((item) => item.user.id),
    );

    oldRatings = [...teamARatings, ...teamBRatings].reduce(
      (acc, rating) => ({
        ...acc,
        [rating.player.id]: rating.player.elo,
      }),
      {},
    );

    const winnerTeam = teamA.placement === 1 ? "A" : "B";
    const isBO3 = match.gameRule.gameRuleId === 2;
    const isDuel = teamAPlayers.length === 1;
    const kFactor = isBO3 || isDuel ? 30 : 40;

    if (match.endedAt === null) {
      const aWins = simulateRankedMatch(
        teamARatings,
        teamBRatings,
        "A",
        kFactor,
      );

      const bWins = simulateRankedMatch(
        teamARatings,
        teamBRatings,
        "B",
        kFactor,
      );

      return {
        state: "ranked_ongoing",
        diff: aWins.map((item, i) => {
          const oldRating = oldRatings[item.player.id]!;
          let diffWin, diffLoss: number;
          if (item.won) {
            diffWin = item.player.elo - oldRating;
            diffLoss = bWins[i]!.player.elo - oldRating;
          } else {
            diffWin = bWins[i]!.player.elo - oldRating;
            diffLoss = item.player.elo - oldRating;
          }

          return {
            userId: Number.parseInt(item.player.id),
            rating: oldRating,
            diffWin: diffWin,
            diffLoss: diffLoss,
          };
        }),
      };
    }

    const userRatings = simulateRankedMatch(
      teamARatings,
      teamBRatings,
      winnerTeam,
      kFactor,
    );

    return {
      state: "ranked_finished",
      diff: userRatings.map((item) => {
        const oldRating = oldRatings[item.player.id]!;
        return {
          userId: Number.parseInt(item.player.id),
          oldRating: oldRating,
          diff: item.player.elo - oldRating,
        };
      }),
      ratings: userRatings,
    };
  } else {
    return { state: "unranked" };
  }
}

export async function recalculateRatings() {
  await useDrizzle().delete(ratingTable);
  console.log("Ratings reset!");
  const matches = mergeRows(
    await getMatchesQuery().orderBy(asc(matchTable.id)),
  );
  for (const match of matches) {
    const rating = await getMatchRating(match);
    console.log("Recalculated match", match.id, rating.state);
    if (rating.state === "ranked_finished") {
      await setRatings(rating.ratings);
    }
  }
  console.log("Done!");
}

export async function updateRankingByMatchId(matchId: number): Promise<void> {
  const match = await getMatchById(matchId);
  if (!match || !match.endedAt) {
    return;
  }

  const rating = await getMatchRating(match);
  if (rating.state === "ranked_finished") {
    await setRatings(rating.ratings);
  }
}
