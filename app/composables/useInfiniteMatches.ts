import { useInfiniteQuery } from "@tanstack/vue-query";

export function useInfiniteMatches(
  pageSize: MaybeRefOrGetter<number> = 20,
  players: MaybeRefOrGetter<string[]>,
  gameRuleId: MaybeRefOrGetter<number | null>,
  stageId: MaybeRefOrGetter<number | null>,
) {
  const query = useInfiniteQuery({
    queryKey: ["infiniteMatches", pageSize, players, gameRuleId, stageId],
    queryFn: async ({ pageParam }) => {
      return await $fetch("/api/matches", {
        query: {
          pageSize: toValue(pageSize),
          page: pageParam,
          players: toValue(players),
          gameRuleId: toValue(gameRuleId),
          stageId: toValue(stageId),
        },
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.pages > lastPage.pagination.page
        ? lastPage.pagination.page + 1
        : null,
  });

  onServerPrefetch(async () => {
    await query.suspense();
  });

  return query;
}
