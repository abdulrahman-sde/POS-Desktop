DROP INDEX `products_name_unique`;--> statement-breakpoint
ALTER TABLE `products` ADD `deleted_at` text;--> statement-breakpoint
CREATE UNIQUE INDEX `products_name_unique` ON `products` (lower("name")) WHERE "products"."deleted_at" is null;