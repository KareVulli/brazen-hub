import { useInfiniteQuery } from "@tanstack/vue-query";

export function useInfiniteMatches(
  pageSize: MaybeRefOrGetter<number> = 20,
  userKey?: MaybeRefOrGetter<string | undefined>,
) {
  const query = useInfiniteQuery({
    queryKey: ["infiniteMatches", toValue(pageSize), toValue(userKey)],
    queryFn: async ({ pageParam }) => {
      return await $fetch("/api/matches", {
        query: {
          pageSize: toValue(pageSize),
          page: pageParam,
          user: toValue(userKey),
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
