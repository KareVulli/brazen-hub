import { integer } from "drizzle-orm/sqlite-core";

export const createdAt = integer("created_at", { mode: "timestamp" })
  .notNull()
  .$default(() => new Date());
