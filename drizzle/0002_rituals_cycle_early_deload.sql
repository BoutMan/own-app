CREATE TABLE `cycle_periods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_date` text NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cycle_periods_start_date_unique` ON `cycle_periods` (`start_date`);--> statement-breakpoint
CREATE TABLE `daily_rituals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`kind` text NOT NULL,
	`value` real NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_rituals_unique` ON `daily_rituals` (`date`,`kind`);--> statement-breakpoint
ALTER TABLE `profile` ADD `hormonal_contraception` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `early_deload_week_of` text;