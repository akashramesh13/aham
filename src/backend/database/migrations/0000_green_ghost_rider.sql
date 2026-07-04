CREATE TABLE `journals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`mood` text,
	`hoursOfSleep` real,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `journals_date_unique` ON `journals` (`date`);--> statement-breakpoint
CREATE TABLE `gratitude` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`journalId` integer NOT NULL,
	`text` text NOT NULL,
	`position` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`text` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`carriedOver` integer DEFAULT false NOT NULL,
	`position` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`completedAt` integer
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
