CREATE TABLE `additional_effect` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`additional_effect_id` integer NOT NULL,
	`game_version` text NOT NULL,
	`created_at` integer NOT NULL,
	`category_type` text NOT NULL,
	`additional_effect_type` text NOT NULL,
	`enchant_group` text NOT NULL,
	`priority` integer NOT NULL,
	`valid_stun` integer NOT NULL,
	`valid_finisher` integer NOT NULL,
	`cancel_condition` text NOT NULL,
	`asset_name` text NOT NULL,
	`time` real NOT NULL,
	`val1` integer NOT NULL,
	`val2` integer NOT NULL,
	`val3` integer NOT NULL,
	`val4` integer NOT NULL
);
