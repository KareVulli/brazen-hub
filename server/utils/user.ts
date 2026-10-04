import { inArray } from "drizzle-orm";
import { userTable } from "../db/schema";
import { findFirstUser } from "./brazen-api/findUser";
import type {
  BrazenAPIDetailedUser,
  BrazenAPIUser,
} from "./brazen-api/models/apiUser";
import { contains } from "./drizzle";

export interface BrazenUser extends BrazenAPIUser {
  id: number;
}

export interface DetailedBrazenUser extends BrazenAPIDetailedUser {
  id: number;
}

export async function updateUserInDB(
  user: BrazenAPIUser,
  bot: boolean = false,
): Promise<number> {
  const [dbUser] = await useDrizzle()
    .insert(userTable)
    .values({
      userKey: user.userKey,
      name: user.name,
      iconId: user.iconId,
      iconFrameId: user.iconFrameId,
      bot: bot,
    })
    .onConflictDoUpdate({
      target: userTable.userKey,
      set: {
        name: user.name,
        iconId: user.iconId,
        iconFrameId: user.iconFrameId,
        bot: bot,
      },
    })
    .returning({ userId: userTable.id });
  return dbUser!.userId;
}

export async function getUserFromDB(
  userKey: string,
): Promise<BrazenUser | null> {
  const user = await useDrizzle().query.userTable.findFirst({
    where: eq(userTable.userKey, userKey),
  });
  return user || null;
}

export async function fetchAndUpdateUser(
  apiToken: string,
  userKey: string,
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

export async function getUser(
  apiToken: string,
  userKey: string,
): Promise<BrazenUser | null> {
  const user = await getUserFromDB(userKey);
  if (user === null) {
    return await fetchAndUpdateUser(apiToken, userKey);
  }
  return user;
}

export interface UserFilters {
  query?: string;
  userKeys?: string[];
}

function getFilteredQuery({ query: searchQuery, userKeys }: UserFilters) {
  const filters = [];

  if (userKeys !== undefined) {
    filters.push(inArray(userTable.userKey, userKeys));
  }
  if (searchQuery !== undefined) {
    filters.push(
      or(
        eq(userTable.userKey, searchQuery),
        contains(userTable.name, searchQuery),
      ),
    );
  }

  return useDrizzle()
    .select()
    .from(userTable)
    .where(and(...filters))
    .$dynamic();
}

export async function getPaginatedUsers(
  paginationOptions: PaginationOptions,
  filters: UserFilters = {},
): Promise<PaginatedResponse<BrazenUser>> {
  const query = getFilteredQuery(filters);
  return await paginateResults(query, paginationOptions);
}
