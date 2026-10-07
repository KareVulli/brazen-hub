import { relations } from "drizzle-orm";
import { index, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";
import { teamTable } from "./team";
import { userTable } from "./user";
import { characterTable } from "./character";
import { itemTable } from "./item";

export const teamUserTable = sqliteTable(
  "team_user",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    teamId: integer("team_id")
      .references(() => teamTable.id)
      .notNull(),
    userId: integer("user_id")
      .references(() => userTable.id)
      .notNull(),
    characterId: integer("character_id")
      .references(() => characterTable.id)
      .notNull(),
    subWeaponId: integer("sub_weapon_id")
      .references(() => itemTable.id)
      .notNull(),
    kills: integer("kills").notNull().default(0),
    stuns: integer("stuns").notNull().default(0),
    deaths: integer("deaths").notNull().default(0),
    damage: integer("damage").notNull().default(0),
    revives: integer("revives").notNull().default(0),
    healingDone: integer("healing_done").notNull().default(0),
    healingReceived: integer("healing_received").notNull().default(0),
    skill: integer("skill").notNull().default(0),
    ultimate: integer("ultimate").notNull().default(0),
    aliveDuration: integer("alive_duration").notNull().default(0),
    disconnectedAt: integer("disconnected_at", { mode: "timestamp" }),
    createdAt: createdAt,
  },
  (table) => [
    index("team_user_team_id_idx").on(table.teamId),
    index("team_user_user_id_idx").on(table.userId),
    index("team_user_character_id_idx").on(table.characterId),
    index("team_user_sub_weapon_id_idx").on(table.subWeaponId),
  ],
);

export const teamUserRelations = relations(teamUserTable, ({ one }) => ({
  team: one(teamTable, {
    fields: [teamUserTable.teamId],
    references: [teamTable.id],
  }),
  character: one(characterTable, {
    fields: [teamUserTable.characterId],
    references: [characterTable.id],
  }),
  subWeapon: one(itemTable, {
    fields: [teamUserTable.subWeaponId],
    references: [itemTable.id],
  }),
  user: one(userTable, {
    fields: [teamUserTable.userId],
    references: [userTable.id],
  }),
}));
