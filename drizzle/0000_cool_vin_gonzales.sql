CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`metadata` text,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `activities_brand_id_idx` ON `activities` (`brand_id`);--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text,
	`excerpt` text,
	`category` text,
	`tags` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` text,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_brand_slug_idx` ON `blog_posts` (`brand_id`,`slug`);--> statement-breakpoint
CREATE INDEX `blog_posts_status_idx` ON `blog_posts` (`brand_id`,`status`);--> statement-breakpoint
CREATE TABLE `brand_pages` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`is_published` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brand_pages_brand_slug_idx` ON `brand_pages` (`brand_id`,`slug`);--> statement-breakpoint
CREATE TABLE `brand_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brand_settings_brand_key_idx` ON `brand_settings` (`brand_id`,`key`);--> statement-breakpoint
CREATE TABLE `brand_strategies` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`type` text NOT NULL,
	`result` text,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `brand_strategies_brand_id_idx` ON `brand_strategies` (`brand_id`);--> statement-breakpoint
CREATE TABLE `brands` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`tagline` text,
	`description` text,
	`industry` text,
	`logo_url` text,
	`primary_color` text,
	`secondary_color` text,
	`accent_color` text,
	`font_heading` text,
	`font_body` text,
	`brand_voice` text,
	`channels` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`website_template` text,
	`custom_css` text,
	`user_id` text NOT NULL,
	`chatbot_greeting` text,
	`chatbot_color` text,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	`updated_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brands_slug_unique` ON `brands` (`slug`);--> statement-breakpoint
CREATE INDEX `brands_user_id_idx` ON `brands` (`user_id`);--> statement-breakpoint
CREATE INDEX `brands_status_idx` ON `brands` (`status`);--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`session_id` text NOT NULL,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `chat_messages_session_idx` ON `chat_messages` (`brand_id`,`session_id`);--> statement-breakpoint
CREATE TABLE `chatbot_faqs` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `chatbot_faqs_brand_id_idx` ON `chatbot_faqs` (`brand_id`);--> statement-breakpoint
CREATE TABLE `consumer_users` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `consumer_users_brand_email_idx` ON `consumer_users` (`brand_id`,`email`);--> statement-breakpoint
CREATE TABLE `contact_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `contact_submissions_brand_id_idx` ON `contact_submissions` (`brand_id`);--> statement-breakpoint
CREATE TABLE `content` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text,
	`body` text,
	`metadata` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `content_brand_type_idx` ON `content` (`brand_id`,`type`);--> statement-breakpoint
CREATE TABLE `discount_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`code` text NOT NULL,
	`type` text NOT NULL,
	`value` real NOT NULL,
	`min_order` real,
	`max_uses` integer,
	`used_count` integer DEFAULT 0 NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`starts_at` text,
	`expires_at` text,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `discount_codes_brand_code_idx` ON `discount_codes` (`brand_id`,`code`);--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`status` text DEFAULT 'active' NOT NULL,
	`subscribed_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_brand_email_idx` ON `newsletter_subscribers` (`brand_id`,`email`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`metadata` text,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `notifications_brand_id_idx` ON `notifications` (`brand_id`);--> statement-breakpoint
CREATE INDEX `notifications_read_idx` ON `notifications` (`brand_id`,`is_read`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text,
	`product_name` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` real NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `order_items_order_id_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_name` text NOT NULL,
	`shipping_address` text,
	`items` text,
	`total` real NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `orders_brand_id_idx` ON `orders` (`brand_id`);--> statement-breakpoint
CREATE INDEX `orders_status_idx` ON `orders` (`brand_id`,`status`);--> statement-breakpoint
CREATE TABLE `page_views` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`page` text NOT NULL,
	`referrer` text,
	`user_agent` text,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `page_views_brand_id_idx` ON `page_views` (`brand_id`);--> statement-breakpoint
CREATE INDEX `page_views_created_at_idx` ON `page_views` (`brand_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`image_url` text,
	`category` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`stock_count` integer,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `products_brand_id_idx` ON `products` (`brand_id`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`brand_id`,`category`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`product_id` text,
	`author_name` text NOT NULL,
	`author_email` text NOT NULL,
	`rating` integer NOT NULL,
	`title` text,
	`body` text,
	`verified_purchase` integer DEFAULT false NOT NULL,
	`helpful_count` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `reviews_brand_id_idx` ON `reviews` (`brand_id`);--> statement-breakpoint
CREATE INDEX `reviews_product_id_idx` ON `reviews` (`product_id`);--> statement-breakpoint
CREATE INDEX `reviews_status_idx` ON `reviews` (`brand_id`,`status`);--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`author_name` text NOT NULL,
	`author_role` text,
	`author_company` text,
	`quote` text NOT NULL,
	`rating` integer,
	`avatar_url` text,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `testimonials_brand_id_idx` ON `testimonials` (`brand_id`);--> statement-breakpoint
CREATE TABLE `ticket_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ticket_messages_ticket_id_idx` ON `ticket_messages` (`ticket_id`);--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`subject` text NOT NULL,
	`category` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`satisfaction_rating` integer,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	`updated_at` text DEFAULT '(datetime(''now''))' NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tickets_brand_status_idx` ON `tickets` (`brand_id`,`status`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`avatar_url` text,
	`token_version` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT '(datetime(''now''))' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);