ALTER TABLE `profile` ADD `contract_signature` text;--> statement-breakpoint
ALTER TABLE `profile` ADD `saved_exercises` text DEFAULT '[]' NOT NULL;