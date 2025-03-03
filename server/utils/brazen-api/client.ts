import { $fetch } from "ofetch";

console.log("GAME VERSION", process.env.NUXT_GAME_VERSION);
export const brazenApiClient = $fetch.create({
  baseURL: "https://api.prod.brazenblaze.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Asset-Version": `${process.env.NUXT_GAME_VERSION_CODE}/steam-pc/${process.env.NUXT_GAME_HASH}`,
    "Client-Version": process.env.NUXT_GAME_VERSION || "",
    Platform: "steam_pc",
  },
});
