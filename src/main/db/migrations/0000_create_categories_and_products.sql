CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (lower("name"));--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`item_code` text NOT NULL,
	`name` text NOT NULL,
	`category_id` text NOT NULL,
	`brand` text DEFAULT '' NOT NULL,
	`quality` text,
	`shelf` text DEFAULT '' NOT NULL,
	`cost_price` integer NOT NULL,
	`sale_price` integer NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`reorder_level` integer DEFAULT 5 NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "products_cost_price_positive" CHECK("products"."cost_price" > 0),
	CONSTRAINT "products_sale_price_positive" CHECK("products"."sale_price" > 0),
	CONSTRAINT "products_stock_not_negative" CHECK("products"."stock" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_item_code_unique` ON `products` (`item_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_name_unique` ON `products` (lower("name"));