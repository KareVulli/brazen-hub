import { $fetch } from "ofetch";

export const brazenApiClient = $fetch.create({
  baseURL: "https://api.prod.brazenblaze.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Asset-Version":
      "2025021200/steam-pc/81f4ddd7426d18ef61a4715672a40f468aaef65e",
    "Client-Version": "1.13.0",
    Platform: "steam_pc",
  },
});
