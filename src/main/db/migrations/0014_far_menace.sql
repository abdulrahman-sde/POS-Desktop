CREATE TABLE `starter_import` (
	`id` integer PRIMARY KEY NOT NULL,
	`imported_at` text NOT NULL,
	CONSTRAINT "starter_import_single_row" CHECK("starter_import"."id" = 1)
);
