import { getColumns } from "../database/getColumns";
import { accountTable } from "../database/schema";
import type { DBAccount } from "./drizzle";

export async function updateAccountInDB(discordUser: {
  discordId: string;
  displayName: string;
  username: string;
}): Promise<DBAccount> {
  const [dbAccount] = await useDrizzle()
    .insert(accountTable)
    .values({
      discordId: discordUser.discordId,
      discordDisplayname: discordUser.displayName,
      discordName: discordUser.username,
    })
    .onConflictDoUpdate({
      target: accountTable.discordId,
      set: {
        discordDisplayname: discordUser.displayName,
        discordName: discordUser.username,
      },
    })
    .returning(getColumns(accountTable));
  return dbAccount;
}

export async function getAccountByDiscordId(
  discordId: string
): Promise<DBAccount | null> {
  const user = await useDrizzle().query.accountTable.findFirst({
    where: eq(accountTable.discordId, discordId),
  });
  return user || null;
}
