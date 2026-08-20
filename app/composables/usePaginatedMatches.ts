import { useQuery } from "@tanstack/vue-query";
import type { PaginationRequestOptions } from "~~/shared/types/PaginationRequestOptions";

export interface PaginatedMatchesRequest {
  pagination?: PaginationRequestOptions;
}
export function usePaginatedMatches(request: PaginatedMatchesRequest) {
  return useQuery({
    queryKey: ["paginatedMatches", request],
    queryFn: async () => {
      return await $fetch("/api/matches", {
        query: toValue(request),
      });
    },
  });
}
