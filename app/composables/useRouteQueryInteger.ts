import type { LocationQueryValue } from "vue-router";

const toNumber = (
  param: LocationQueryValue | LocationQueryValue[] | undefined,
): number | undefined => {
  if (param === null || param === undefined || Array.isArray(param)) {
    return undefined;
  }
  const number = Number.parseInt(param);
  if (Number.isNaN(number)) {
    return undefined;
  }
  return number;
};

export function useRouteQueryInteger(name: string) {
  const route = useRoute();
  return computed(() => {
    return toNumber(route.query[name]);
  });
}
