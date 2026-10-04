import { useQuery } from "@tanstack/vue-query";
import type { PaginationRequestOptions } from "~~/shared/types/PaginationRequestOptions";

export interface PaginatedUsersRequest {
  pagination?: PaginationRequestOptions;
  filters?: {
    query?: string;
    userKeys?: string | string[];
  };
}
export function usePaginatedUsers(
  request: MaybeRefOrGetter<PaginatedUsersRequest>,
  enabled?: MaybeRefOrGetter<boolean>,
) {
  return useQuery({
    queryKey: ["paginatedUsers", request],
    queryFn: async () => {
      return await $fetch("/api/users", {
        query: { ...toValue(request).pagination, ...toValue(request).filters },
      });
    },
    enabled: enabled,
    placeholderData: (prev) => prev,
  });
}
