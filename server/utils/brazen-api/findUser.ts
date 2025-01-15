import { brazenApiClient } from "./client";

export interface OnlineStatusDto {
  expired_at: number;
  is_online: boolean;
  state: string;
  updated_at: number;
}

// Not all fields are defined
export interface UsersSearchResultDto {
  name: string;
  user_key: string;
  profile_icon_id: number;
  profile_icon_frame_id: number;
  online_status: OnlineStatusDto;
}

export interface UsersSearchDto {
  users: UsersSearchResultDto[];
}

export async function findUser(
  token: string,
  query: string
): Promise<UsersSearchDto> {
  return await brazenApiClient<UsersSearchDto>("userrelationships/v1/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      query: query,
    },
  });
}

export async function findFirstUser(
  token: string,
  query: string
): Promise<UsersSearchResultDto | null> {
  const users = await findUser(token, query);
  if (users.users.length) {
    return users.users[0];
  }
  return null;
}
