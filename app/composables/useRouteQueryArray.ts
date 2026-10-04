import { useRouteQuery } from "@vueuse/router";
import type { LocationQueryValue } from "vue-router";

const toArray = (param: LocationQueryValue | LocationQueryValue[]): string[] =>
  (Array.isArray(param) ? param : [param]).filter((item) => item !== null);

export function useRouteQueryArray(
  name: string,
  defaultValue?: string[] | null,
) {
  return useRouteQuery(name, defaultValue, { transform: toArray });
}
