import { notExists } from "drizzle-orm";
import { hostTable, roomTable } from "../database/schema";
import type { DBHost } from "./drizzle";
import { getColumns } from "../database/getColumns";

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
  // TODO: Create real user
  return (
    await useDrizzle()
      .insert(hostTable)
      .values({
        name: "foobar",
        userKey: "1337",
        token: "hello-token",
      })
      .returning(getColumns(hostTable))
  )[0];
}
