import { $fetch } from "ofetch";

export const brazenApiClient = $fetch.create({
  baseURL: "https://api.prod.brazenblaze.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Asset-Version":
      "2025022600/steam-pc/20aa6e7b67f339eaeaf02e5939787bdbbf70348c",
    "Client-Version": "1.14.0",
    Platform: "steam_pc",
  },
});
