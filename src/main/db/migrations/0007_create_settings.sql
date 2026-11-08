CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`shop_name` text NOT NULL,
	`owner_name` text NOT NULL,
	`phone` text NOT NULL,
	`address` text NOT NULL,
	`country_code` text NOT NULL,
	`invoice_note` text NOT NULL,
	CONSTRAINT "settings_single_row" CHECK("settings"."id" = 1)
);
