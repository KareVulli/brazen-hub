import { $fetch } from "ofetch";

export const brazenApiClient = $fetch.create({
  baseURL: "https://api.prod.brazenblaze.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Asset-Version":
      "2025011501/steam-pc/4b52858e0ec1ca8e0f39013e2763d2c86a329788",
    "Client-Version": "1.11.0",
    Platform: "steam_pc",
  },
});
