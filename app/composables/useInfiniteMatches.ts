import { useInfiniteQuery } from "@tanstack/vue-query";

export function useInfiniteMatches(pageSize: MaybeRefOrGetter<number> = 20) {
  const query = useInfiniteQuery({
    queryKey: ["infiniteMatches", pageSize],
    queryFn: async ({ pageParam }) => {
      return await $fetch("/api/matches", {
        query: {
          pageSize: toValue(pageSize),
          page: pageParam,
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
