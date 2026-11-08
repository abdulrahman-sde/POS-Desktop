DROP INDEX `categories_name_unique`;--> statement-breakpoint
ALTER TABLE `categories` ADD `deleted_at` text;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (lower("name")) WHERE "categories"."deleted_at" is null;--> statement-breakpoint
ALTER TABLE `customers` ADD `deleted_at` text;