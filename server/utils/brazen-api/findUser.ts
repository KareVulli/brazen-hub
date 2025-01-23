import { brazenApiClient } from "./client";
import type { BrazenAPIDetailedUser } from "./models/apiUser";

interface OnlineStatusDto {
  expired_at: number;
  is_online: boolean;
  state: string;
  updated_at: number;
}

// Not all fields are defined
interface UsersSearchResultDto {
  name: string;
  user_key: string;
  profile_icon_id: number;
  profile_icon_frame_id: number;
  online_status: OnlineStatusDto;
}

interface UsersSearchDto {
  users: UsersSearchResultDto[];
}

function brazenApiUserFromDto(
  user: UsersSearchResultDto
): BrazenAPIDetailedUser {
  return {
    name: user.name,
    userKey: user.user_key,
    iconId: user.profile_icon_id,
    iconFrameId: user.profile_icon_frame_id,
    online: user.online_status.is_online,
    updatedAt: user.online_status.updated_at,
  };
}

async function searchUsers(
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
): Promise<BrazenAPIDetailedUser | null> {
  const users = await searchUsers(token, query);
  if (users.users.length) {
    return brazenApiUserFromDto(users.users[0]);
  }
  return null;
}

export async function findUsers(
  token: string,
  query: string
): Promise<BrazenAPIDetailedUser[]> {
  const users = await searchUsers(token, query);
  return users.users.map((user) => brazenApiUserFromDto(user));
}
