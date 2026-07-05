import { getMatches } from "~~/server/utils/match";

export default defineEventHandler(async (): Promise<MatchDto[]> => {
  const matches = (await getMatches()).map(matchToDto);

  return matches;
});
