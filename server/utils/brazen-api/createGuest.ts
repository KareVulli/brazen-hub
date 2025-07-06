import { getBrazenApiClient } from "./client";

interface BrazenApiCreateGuestResponse {
  user_key: string;
  user_name: string;
  token: string;
}

export async function createGuest(): Promise<BrazenApiCreateGuestResponse> {
  const response = await getBrazenApiClient().raw<{
    user_key: string;
    user_name: string;
  }>("auth/v1/guest/create", {
    method: "POST",
    body: {
      Language: "en-US",
    },
  });
  const result = response._data;

  if (result === undefined) {
    throw new Error("No successful response");
  }

  let token = response.headers.get("Authorization");
  if (token === null) {
    throw new Error("No token found from headers");
  }

  token = token.replace("Bearer ", "");

  return {
    user_key: result.user_key,
    user_name: result.user_name,
    token: token,
  };
}
