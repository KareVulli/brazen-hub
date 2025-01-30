import { integer } from "drizzle-orm/sqlite-core";

export const updatedAt = integer("updated_at", { mode: "timestamp" })
  .notNull()
  .$default(() => new Date())
  .$onUpdate(() => new Date());
