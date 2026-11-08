CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`qty` integer NOT NULL,
	`unit_price` integer NOT NULL,
	`cost_price` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "order_items_qty_positive" CHECK("order_items"."qty" > 0),
	CONSTRAINT "order_items_unit_price_positive" CHECK("order_items"."unit_price" > 0),
	CONSTRAINT "order_items_cost_price_positive" CHECK("order_items"."cost_price" > 0)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_no` text NOT NULL,
	`customer_id` text,
	`discount` integer DEFAULT 0 NOT NULL,
	`advance` integer DEFAULT 0 NOT NULL,
	`method` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "orders_discount_not_negative" CHECK("orders"."discount" >= 0),
	CONSTRAINT "orders_advance_not_negative" CHECK("orders"."advance" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_invoice_no_unique` ON `orders` (`invoice_no`);