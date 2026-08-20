import { inArray, notExists } from "drizzle-orm";
import { getColumns } from "../db/getColumns";
import { hostTable, roomSessionTable } from "../db/schema";
import { createGuest } from "./brazen-api/createGuest";
import { setUserName } from "./brazen-api/setUserName";
import type { DBHost } from "./drizzle";

export interface Host {
  name: string;
  userKey: string;
  token: string;
}

export async function getFreeHost(): Promise<DBHost> {
  const host = await useDrizzle()
    .select()
    .from(hostTable)
    .where(
      notExists(
        useDrizzle()
          .select()
          .from(roomSessionTable)
          .where(
            and(
              eq(roomSessionTable.hostId, hostTable.id),
              eq(roomSessionTable.active, true),
            ),
          ),
      ),
    )
    .get();

  if (host) {
    return host;
  }

  return createHost();
}

async function createHost(): Promise<DBHost> {
  const host = await createGuest();
  const dbHost = (
    await useDrizzle()
      .insert(hostTable)
      .values({
        name: host.user_name,
        userKey: host.user_key,
        token: host.token,
      })
      .returning(getColumns(hostTable))
  )[0]!;

  await setUserName(
    host.token,
    `StatsBot-${((dbHost.id % 10000) + "").padStart(4, "0")}`, // 16 chars max username length
  );

  return dbHost;
}

export async function getHostsByUserKeys(
  userKeys: string[],
): Promise<DBHost[]> {
  const hosts = await useDrizzle()
    .select()
    .from(hostTable)
    .where(inArray(hostTable.userKey, userKeys));

  return hosts;
}
