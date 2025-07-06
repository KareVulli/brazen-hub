import { notExists } from "drizzle-orm";
import { hostTable, roomTable } from "../database/schema";
import type { DBHost } from "./drizzle";
import { getColumns } from "../database/getColumns";
import { createGuest } from "./brazen-api/createGuest";

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
          .from(roomTable)
          .where(eq(roomTable.hostId, hostTable.id))
      )
    )
    .get();

  if (host) {
    return host;
  }

  return createHost();
}
async function createHost(): Promise<DBHost> {
  const host = await createGuest();
  return (
    await useDrizzle()
      .insert(hostTable)
      .values({
        name: host.user_name,
        userKey: host.user_key,
        token: host.token,
      })
      .returning(getColumns(hostTable))
  )[0];
}
