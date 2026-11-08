CREATE TABLE `purchase_items` (
	`id` text PRIMARY KEY NOT NULL,
	`purchase_id` text NOT NULL,
	`product_id` text NOT NULL,
	`name` text NOT NULL,
	`qty` integer NOT NULL,
	`cost_price` integer NOT NULL,
	FOREIGN KEY (`purchase_id`) REFERENCES `purchases`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "purchase_items_qty_positive" CHECK("purchase_items"."qty" > 0),
	CONSTRAINT "purchase_items_cost_price_positive" CHECK("purchase_items"."cost_price" > 0)
);
--> statement-breakpoint
CREATE TABLE `purchases` (
	`id` text PRIMARY KEY NOT NULL,
	`bill_no` text NOT NULL,
	`supplier_id` text NOT NULL,
	`paid` integer DEFAULT 0 NOT NULL,
	`method` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "purchases_paid_not_negative" CHECK("purchases"."paid" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `purchases_bill_no_unique` ON `purchases` (`bill_no`);--> statement-breakpoint
CREATE TABLE `supplier_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`supplier_id` text NOT NULL,
	`amount` integer NOT NULL,
	`method` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "supplier_payments_amount_positive" CHECK("supplier_payments"."amount" > 0)
);
