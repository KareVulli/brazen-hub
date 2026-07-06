import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";
import { teamTable } from "./team";
import { userTable } from "./user";
import { characterTable } from "./character";
import { itemTable } from "./item";

export const teamUserTable = sqliteTable("team_user", {
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
  revives: integer("revives").notNull().default(0),
  healed: integer("healed").notNull().default(0),
  skill: integer("skill").notNull().default(0),
  ultimate: integer("ultimate").notNull().default(0),
  damage: integer("damage").notNull().default(0),
  aliveDuration: integer("alive_duration").notNull().default(0),
  createdAt: createdAt,
});

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
