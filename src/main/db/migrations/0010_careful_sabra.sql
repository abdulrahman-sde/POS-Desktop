CREATE TABLE `auth` (
	`id` integer PRIMARY KEY NOT NULL,
	`salt` text NOT NULL,
	`hash` text NOT NULL,
	CONSTRAINT "auth_single_row" CHECK("auth"."id" = 1)
);
