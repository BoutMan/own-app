CREATE TABLE `check_ins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`season` integer NOT NULL,
	`week` integer NOT NULL,
	`energy` integer,
	`sleep` integer,
	`mood` integer,
	`win` text,
	`stuck` text,
	`adjust` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`season`) REFERENCES `seasons`(`number`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `check_ins_unique` ON `check_ins` (`season`,`week`);--> statement-breakpoint
CREATE TABLE `goals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`season` integer NOT NULL,
	`slot` text NOT NULL,
	`text` text NOT NULL,
	`baseline` text,
	`progress` integer,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`season`) REFERENCES `seasons`(`number`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `goals_season_slot` ON `goals` (`season`,`slot`);--> statement-breakpoint
CREATE TABLE `health_answers` (
	`id` integer PRIMARY KEY NOT NULL,
	`pregnancy_or_postpartum` integer DEFAULT false NOT NULL,
	`medical_condition` integer DEFAULT false NOT NULL,
	`injury_or_surgery` integer DEFAULT false NOT NULL,
	`no_training_two_years` integer DEFAULT false NOT NULL,
	`pelvic_leaking` integer DEFAULT false NOT NULL,
	`pelvic_heaviness` integer DEFAULT false NOT NULL,
	`pelvic_urgency` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `marker_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`season` integer NOT NULL,
	`checkpoint` text NOT NULL,
	`marker` text NOT NULL,
	`value` integer NOT NULL,
	`recorded_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`season`) REFERENCES `seasons`(`number`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "marker_value_range" CHECK("marker_entries"."value" between 1 and 10)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `marker_entries_unique` ON `marker_entries` (`season`,`checkpoint`,`marker`);--> statement-breakpoint
CREATE TABLE `measurements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`value` real NOT NULL,
	`recorded_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` integer PRIMARY KEY NOT NULL,
	`first_name` text,
	`units` text DEFAULT 'imperial' NOT NULL,
	`place` text DEFAULT 'home' NOT NULL,
	`equipment` text DEFAULT '[]' NOT NULL,
	`week_plan` text NOT NULL,
	`session_time` text DEFAULT '18:30' NOT NULL,
	`feelings` text DEFAULT '[]' NOT NULL,
	`my_why` text,
	`grounded_versions` integer DEFAULT false NOT NULL,
	`cycle_tracking` integer DEFAULT false NOT NULL,
	`track_body_weight` integer DEFAULT false NOT NULL,
	`remind_night_before` integer DEFAULT true NOT NULL,
	`add_to_calendar` integer DEFAULT true NOT NULL,
	`contract_signed_at` text,
	`onboarded_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `seasons` (
	`number` integer PRIMARY KEY NOT NULL,
	`start_date` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `set_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` text NOT NULL,
	`step_key` text NOT NULL,
	`exercise_id` text,
	`set_index` integer NOT NULL,
	`reps` integer,
	`load_kg` real,
	`seconds` integer,
	`rpe` real,
	`logged_at` text NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `set_logs_exercise` ON `set_logs` (`exercise_id`,`logged_at`);--> statement-breakpoint
CREATE INDEX `set_logs_workout` ON `set_logs` (`workout_id`);--> statement-breakpoint
CREATE TABLE `test_results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`season` integer NOT NULL,
	`checkpoint` text NOT NULL,
	`test` text NOT NULL,
	`value` real NOT NULL,
	`note` text,
	`recorded_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`season`) REFERENCES `seasons`(`number`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `test_results_unique` ON `test_results` (`season`,`checkpoint`,`test`);--> statement-breakpoint
CREATE TABLE `vault_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`season` integer NOT NULL,
	`checkpoint` text NOT NULL,
	`pose` text NOT NULL,
	`file_uri` text NOT NULL,
	`taken_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`season`) REFERENCES `seasons`(`number`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`season` integer NOT NULL,
	`week` integer NOT NULL,
	`mode` text NOT NULL,
	`variant` text DEFAULT 'full' NOT NULL,
	`started_at` text NOT NULL,
	`ended_at` text,
	`feel` integer,
	FOREIGN KEY (`season`) REFERENCES `seasons`(`number`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "workouts_week_range" CHECK("workouts"."week" between 1 and 12),
	CONSTRAINT "workouts_feel_range" CHECK("workouts"."feel" is null or "workouts"."feel" between 1 and 10)
);
--> statement-breakpoint
CREATE INDEX `workouts_season_week` ON `workouts` (`season`,`week`);