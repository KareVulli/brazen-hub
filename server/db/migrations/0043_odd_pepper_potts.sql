DROP INDEX `created_at_idx`;--> statement-breakpoint
CREATE INDEX `weekly_event_id_idx` ON `weekly` (`event_id`);--> statement-breakpoint
CREATE INDEX `weekly_created_at_idx` ON `weekly` (`created_at`);--> statement-breakpoint
CREATE INDEX `weekly_world_record_score_id_idx` ON `weekly` (`world_record_score_id`);--> statement-breakpoint
CREATE INDEX `score_user_id_idx` ON `score` (`user_id`);--> statement-breakpoint
CREATE INDEX `weekly_score_weekly_id_idx` ON `weekly_score` (`weekly_id`);--> statement-breakpoint
CREATE INDEX `weekly_score_score_id_idx` ON `weekly_score` (`score_id`);--> statement-breakpoint
CREATE INDEX `room_user_room_id_idx` ON `room_user` (`room_id`);--> statement-breakpoint
CREATE INDEX `room_user_user_id_idx` ON `room_user` (`user_id`);--> statement-breakpoint
CREATE INDEX `room_session_room_id_idx` ON `room_session` (`room_id`);--> statement-breakpoint
CREATE INDEX `room_session_host_id_idx` ON `room_session` (`host_id`);--> statement-breakpoint
CREATE INDEX `team_user_team_id_idx` ON `team_user` (`team_id`);--> statement-breakpoint
CREATE INDEX `team_user_user_id_idx` ON `team_user` (`user_id`);--> statement-breakpoint
CREATE INDEX `team_user_character_id_idx` ON `team_user` (`character_id`);--> statement-breakpoint
CREATE INDEX `team_user_sub_weapon_id_idx` ON `team_user` (`sub_weapon_id`);--> statement-breakpoint
CREATE INDEX `match_room_session_id_idx` ON `match` (`room_session_id`);--> statement-breakpoint
CREATE INDEX `match_game_rule_id_idx` ON `match` (`game_rule_id`);--> statement-breakpoint
CREATE INDEX `match_event_match_id_idx` ON `match_event` (`match_id`);