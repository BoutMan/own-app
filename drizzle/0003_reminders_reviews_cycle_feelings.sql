CREATE TABLE `block_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`season` integer NOT NULL,
	`checkpoint` text NOT NULL,
	`changed_most` text,
	`one_change` text,
	`recorded_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`season`) REFERENCES `seasons`(`number`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `block_reviews_unique` ON `block_reviews` (`season`,`checkpoint`);--> statement-breakpoint
CREATE TABLE `cycle_feelings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`feelings` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cycle_feelings_date_unique` ON `cycle_feelings` (`date`);--> statement-breakpoint
ALTER TABLE `profile` ADD `remind_session` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `remind_sunday` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `profile` ADD `remind_evening` integer DEFAULT false NOT NULL;