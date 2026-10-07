import type { MatchDto } from "~~/server/utils/match";
import { PLAYGROUND_GAMRULE_TYPE } from "~~/shared/constants";

export function getWinnerTeam(match: MatchDto): TeamDto | null {
  if (!match.endedAt) {
    return null;
  }
  let winnerTeam: TeamDto | undefined;
  if (match.gameRule.gameRuleType === PLAYGROUND_GAMRULE_TYPE) {
    winnerTeam = [...match.teams].sort(
      (a, b) => b.teamUsers[0]!.kills - a.teamUsers[0]!.kills,
    )[0];
  } else {
    winnerTeam = [...match.teams].sort((a, b) => b.wins - a.wins)[0];
  }
  if (!winnerTeam) {
    return null;
  }
  return winnerTeam;
}
