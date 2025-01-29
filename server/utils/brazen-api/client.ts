import { $fetch } from "ofetch";

export const brazenApiClient = $fetch.create({
  baseURL: "https://api.prod.brazenblaze.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Asset-Version":
      "2025012901/steam-pc/f222621e545e6f22a27a49b12297e3b2c107b011",
    "Client-Version": "1.12.0",
    Platform: "steam_pc",
  },
});
