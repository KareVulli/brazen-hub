import { userTable } from "../database/schema";
import type { UsersSearchResultDto } from "./brazen-api/findUser";

export interface BrazenUser {
  name: string;
  userKey: string;
  iconId: number;
  iconFrameId: number;
}

export async function updateUser(user: UsersSearchResultDto): Promise<number> {
  const [dbUser] = await useDrizzle()
    .insert(userTable)
    .values({
      userKey: user.user_key,
      name: user.name,
      iconId: user.profile_icon_id,
      iconFrameId: user.profile_icon_frame_id,
    })
    .onConflictDoUpdate({
      target: userTable.userKey,
      set: {
        name: user.name,
        iconId: user.profile_icon_id,
        iconFrameId: user.profile_icon_frame_id,
      },
    })
    .returning({ userId: userTable.id });
  return dbUser.userId;
}
