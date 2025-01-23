import { userTable } from "../database/schema";
import { findFirstUser } from "./brazen-api/findUser";
import type {
  BrazenAPIDetailedUser,
  BrazenAPIUser,
} from "./brazen-api/models/apiUser";

export interface BrazenUser extends BrazenAPIUser {
  id: number;
}

export interface DetailedBrazenUser extends BrazenAPIDetailedUser {
  id: number;
}

export async function updateUserInDB(user: BrazenAPIUser): Promise<number> {
  const [dbUser] = await useDrizzle()
    .insert(userTable)
    .values({
      userKey: user.userKey,
      name: user.name,
      iconId: user.iconId,
      iconFrameId: user.iconFrameId,
    })
    .onConflictDoUpdate({
      target: userTable.userKey,
      set: {
        name: user.name,
        iconId: user.iconId,
        iconFrameId: user.iconFrameId,
      },
    })
    .returning({ userId: userTable.id });
  return dbUser.userId;
}

export async function getUserFromDB(
  userKey: string
): Promise<BrazenUser | null> {
  const user = await useDrizzle().query.userTable.findFirst({
    where: eq(userTable.userKey, userKey),
  });
  return user || null;
}

export async function fetchAndUpdateUser(
  apiToken: string,
  userKey: string
): Promise<DetailedBrazenUser | null> {
  const user = await findFirstUser(apiToken, userKey);
  if (!user) {
    return null;
  }
  const userId = await updateUserInDB(user);
  return {
    id: userId,
    ...user,
  };
}
