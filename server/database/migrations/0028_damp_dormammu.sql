PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_team_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`character_id` integer NOT NULL,
	`sub_weapon_id` integer NOT NULL,
	`kills` integer DEFAULT 0 NOT NULL,
	`stuns` integer DEFAULT 0 NOT NULL,
	`deaths` integer DEFAULT 0 NOT NULL,
	`revives` integer DEFAULT 0 NOT NULL,
	`healed` integer DEFAULT 0 NOT NULL,
	`skill` integer DEFAULT 0 NOT NULL,
	`ultimate` integer DEFAULT 0 NOT NULL,
	`damage` integer DEFAULT 0 NOT NULL,
	`alive_duration` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`character_id`) REFERENCES `character`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sub_weapon_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_team_user`("id", "team_id", "user_id", "character_id", "sub_weapon_id", "kills", "stuns", "deaths", "revives", "healed", "skill", "ultimate", "damage", "alive_duration", "created_at") SELECT "id", "team_id", "user_id", "character_id", "sub_weapon_id", "kills", "stuns", "deaths", "revives", "healed", "skill", "ultimate", "damage", "alive_duration", "created_at" FROM `team_user`;--> statement-breakpoint
DROP TABLE `team_user`;--> statement-breakpoint
ALTER TABLE `__new_team_user` RENAME TO `team_user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;