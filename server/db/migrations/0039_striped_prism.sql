CREATE UNIQUE INDEX `additional_effect_additional_effect_id_game_version_unique` ON `additional_effect` (`additional_effect_id`,`game_version`);--> statement-breakpoint
CREATE UNIQUE INDEX `character_character_id_game_version_unique` ON `character` (`character_id`,`game_version`);--> statement-breakpoint
CREATE UNIQUE INDEX `game_rule_game_rule_id_game_version_unique` ON `game_rule` (`game_rule_id`,`game_version`);--> statement-breakpoint
CREATE UNIQUE INDEX `item_item_id_game_version_unique` ON `item` (`item_id`,`game_version`);