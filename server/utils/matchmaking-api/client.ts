import type { $Fetch } from "ofetch";
import { $fetch } from "ofetch";

let matchmakingApiClient: $Fetch | undefined = undefined;

export function getMatchmakingApiClient(): $Fetch {
  if (matchmakingApiClient === undefined) {
    matchmakingApiClient = $fetch.create({
      baseURL: process.env.NUXT_MATCHMAKING_API,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${process.env.NUXT_MATCHMAKING_TOKEN}`,
      },
    });
  }
  return matchmakingApiClient;
}
