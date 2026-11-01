import { matchTable } from "../db/schema";
import { matchRatingTable } from "../db/schema/matchRating";

export async function setMatchRatings(
  matchId: number,
  rating: UnrankedMatchRating | CompletedMatchRating,
): Promise<void> {
  await useDrizzle()
    .delete(matchRatingTable)
    .where(eq(matchRatingTable.matchId, matchId));

  if (rating.state === "ranked_finished") {
    await useDrizzle()
      .update(matchTable)
      .set({
        ranked: true,
      })
      .where(eq(matchTable.id, matchId));

    await useDrizzle()
      .insert(matchRatingTable)
      .values(
        rating.diff.map((item) => ({
          matchId: matchId,
          userId: item.userId,
          oldRating: item.oldRating,
          newRating: item.newRating,
        })),
      );
  } else {
    await useDrizzle()
      .update(matchTable)
      .set({
        ranked: false,
      })
      .where(eq(matchTable.id, matchId));
  }
}
