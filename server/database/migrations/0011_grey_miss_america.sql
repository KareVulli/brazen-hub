PRAGMA defer_foreign_keys = ON;
--> statement-breakpoint
CREATE TABLE `__new_score` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`place` integer NOT NULL,
	`user_id` integer NOT NULL,
	`time` integer NOT NULL,
	`score` integer NOT NULL,
	`attempts` integer NOT NULL,
	`rule_id` integer,
	`character_id` integer,
	`sub_weapon_id` integer,
	`set_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_score`(
		"id",
		"place",
		"user_id",
		"time",
		"score",
		"attempts",
		"rule_id",
		"character_id",
		"sub_weapon_id",
		"set_at",
		"created_at"
	)
SELECT "id",
	"place",
	"user_id",
	"time",
	"score",
	"attempts",
	"rule_id",
	"character_id",
	"sub_weapon_id",
	"set_at",
	"created_at"
FROM `score`;
--> statement-breakpoint
DROP TABLE `score`;
--> statement-breakpoint
ALTER TABLE `__new_score`
	RENAME TO `score`;
--> statement-breakpoint
PRAGMA defer_foreign_keys = OFF;