import { pack, unpack } from "msgpackr";
import type { $Fetch, FetchRequest } from "ofetch";
import { $fetch } from "ofetch";

let brazenApiClient: $Fetch | undefined = undefined;
let brazenMessagepackApiClient: $Fetch | undefined = undefined;

function toObject(value: unknown) {
  return JSON.stringify(
    value,
    (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
    2
  );
}

export function getBrazenApiClient(): $Fetch {
  console.log("GAME VERSION", process.env.NUXT_GAME_VERSION);
  if (brazenApiClient === undefined) {
    brazenApiClient = $fetch.create({
      baseURL: "https://api.prod.brazenblaze.com",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Asset-Version": `${process.env.NUXT_GAME_VERSION_CODE}/steam-pc/${process.env.NUXT_GAME_HASH}`,
        "Client-Version": process.env.NUXT_GAME_VERSION || "",
        Platform: "steam_pc",
      },
    });
  }
  return brazenApiClient;
}

export function getBrazenMessagePackApiClient(): $Fetch {
  if (brazenMessagepackApiClient === undefined) {
    brazenMessagepackApiClient = $fetch.create({
      baseURL: "https://api.prod.brazenblaze.com",
      headers: {
        "Content-Type": "application/messagepack",
        Accept: "application/messagepack",
        "Asset-Version": `${process.env.NUXT_GAME_VERSION_CODE}/steam-pc/${process.env.NUXT_GAME_HASH}`,
        "Client-Version": process.env.NUXT_GAME_VERSION || "",
        Platform: "steam_pc",
      },
      responseType: "arrayBuffer",
    });
  }
  return brazenMessagepackApiClient;
}

export async function brazenMessagePackApiRequest<TResponse>(
  request: FetchRequest,
  method: string,
  headers?: HeadersInit,
  body?: unknown
): Promise<TResponse> {
  const response = await getBrazenMessagePackApiClient().raw(request, {
    method: method,
    headers: headers,
    body: pack(body),
  });
  const result = await response._data;
  const data = unpack(result) as TResponse;
  return data;
}
