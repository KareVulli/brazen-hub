import { breakpointsTailwind } from "@vueuse/core";

export function useIsSmallScreen() {
  const breakpoint: keyof typeof breakpointsTailwind = "xl";
  const breakpoints = useBreakpoints(breakpointsTailwind);
  return {
    breakpointWidth: breakpointsTailwind[breakpoint],
    isSmallScreen: breakpoints.smaller(breakpoint),
  };
}
