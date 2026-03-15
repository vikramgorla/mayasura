PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`metadata` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_activities`("id", "brand_id", "type", "description", "metadata", "created_at") SELECT "id", "brand_id", "type", "description", "metadata", "created_at" FROM `activities`;--> statement-breakpoint
DROP TABLE `activities`;--> statement-breakpoint
ALTER TABLE `__new_activities` RENAME TO `activities`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `activities_brand_id_idx` ON `activities` (`brand_id`);--> statement-breakpoint
CREATE TABLE `__new_blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text,
	`excerpt` text,
	`category` text,
	`tags` text,
	`seo_title` text,
	`seo_description` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_blog_posts`("id", "brand_id", "title", "slug", "content", "excerpt", "category", "tags", "seo_title", "seo_description", "status", "published_at", "created_at", "updated_at") SELECT "id", "brand_id", "title", "slug", "content", "excerpt", "category", "tags", "seo_title", "seo_description", "status", "published_at", "created_at", "updated_at" FROM `blog_posts`;--> statement-breakpoint
DROP TABLE `blog_posts`;--> statement-breakpoint
ALTER TABLE `__new_blog_posts` RENAME TO `blog_posts`;--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_brand_slug_idx` ON `blog_posts` (`brand_id`,`slug`);--> statement-breakpoint
CREATE INDEX `blog_posts_status_idx` ON `blog_posts` (`brand_id`,`status`);--> statement-breakpoint
CREATE TABLE `__new_brand_pages` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`is_published` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_brand_pages`("id", "brand_id", "slug", "title", "content", "is_published", "sort_order", "created_at") SELECT "id", "brand_id", "slug", "title", "content", "is_published", "sort_order", "created_at" FROM `brand_pages`;--> statement-breakpoint
DROP TABLE `brand_pages`;--> statement-breakpoint
ALTER TABLE `__new_brand_pages` RENAME TO `brand_pages`;--> statement-breakpoint
CREATE UNIQUE INDEX `brand_pages_brand_slug_idx` ON `brand_pages` (`brand_id`,`slug`);--> statement-breakpoint
CREATE TABLE `__new_brand_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`key` text NOT NULL,
	`value` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_brand_settings`("id", "brand_id", "key", "value", "created_at") SELECT "id", "brand_id", "key", "value", "created_at" FROM `brand_settings`;--> statement-breakpoint
DROP TABLE `brand_settings`;--> statement-breakpoint
ALTER TABLE `__new_brand_settings` RENAME TO `brand_settings`;--> statement-breakpoint
CREATE UNIQUE INDEX `brand_settings_brand_key_idx` ON `brand_settings` (`brand_id`,`key`);--> statement-breakpoint
CREATE TABLE `__new_brand_strategies` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`type` text NOT NULL,
	`result` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_brand_strategies`("id", "brand_id", "type", "result", "created_at") SELECT "id", "brand_id", "type", "result", "created_at" FROM `brand_strategies`;--> statement-breakpoint
DROP TABLE `brand_strategies`;--> statement-breakpoint
ALTER TABLE `__new_brand_strategies` RENAME TO `brand_strategies`;--> statement-breakpoint
CREATE INDEX `brand_strategies_brand_id_idx` ON `brand_strategies` (`brand_id`);--> statement-breakpoint
CREATE TABLE `__new_brands` (
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
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_brands`("id", "name", "slug", "tagline", "description", "industry", "logo_url", "primary_color", "secondary_color", "accent_color", "font_heading", "font_body", "brand_voice", "channels", "status", "website_template", "custom_css", "user_id", "chatbot_greeting", "chatbot_color", "created_at", "updated_at") SELECT "id", "name", "slug", "tagline", "description", "industry", "logo_url", "primary_color", "secondary_color", "accent_color", "font_heading", "font_body", "brand_voice", "channels", "status", "website_template", "custom_css", "user_id", "chatbot_greeting", "chatbot_color", "created_at", "updated_at" FROM `brands`;--> statement-breakpoint
DROP TABLE `brands`;--> statement-breakpoint
ALTER TABLE `__new_brands` RENAME TO `brands`;--> statement-breakpoint
CREATE UNIQUE INDEX `brands_slug_unique` ON `brands` (`slug`);--> statement-breakpoint
CREATE INDEX `brands_user_id_idx` ON `brands` (`user_id`);--> statement-breakpoint
CREATE INDEX `brands_status_idx` ON `brands` (`status`);--> statement-breakpoint
CREATE TABLE `__new_chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`session_id` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_chat_messages`("id", "brand_id", "role", "content", "session_id", "created_at") SELECT "id", "brand_id", "role", "content", "session_id", "created_at" FROM `chat_messages`;--> statement-breakpoint
DROP TABLE `chat_messages`;--> statement-breakpoint
ALTER TABLE `__new_chat_messages` RENAME TO `chat_messages`;--> statement-breakpoint
CREATE INDEX `chat_messages_session_idx` ON `chat_messages` (`brand_id`,`session_id`);--> statement-breakpoint
CREATE TABLE `__new_consumer_users` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_consumer_users`("id", "brand_id", "email", "name", "password_hash", "created_at") SELECT "id", "brand_id", "email", "name", "password_hash", "created_at" FROM `consumer_users`;--> statement-breakpoint
DROP TABLE `consumer_users`;--> statement-breakpoint
ALTER TABLE `__new_consumer_users` RENAME TO `consumer_users`;--> statement-breakpoint
CREATE UNIQUE INDEX `consumer_users_brand_email_idx` ON `consumer_users` (`brand_id`,`email`);--> statement-breakpoint
CREATE TABLE `__new_contact_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text,
	`message` text NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_contact_submissions`("id", "brand_id", "name", "email", "subject", "message", "status", "created_at") SELECT "id", "brand_id", "name", "email", "subject", "message", "status", "created_at" FROM `contact_submissions`;--> statement-breakpoint
DROP TABLE `contact_submissions`;--> statement-breakpoint
ALTER TABLE `__new_contact_submissions` RENAME TO `contact_submissions`;--> statement-breakpoint
CREATE INDEX `contact_submissions_brand_id_idx` ON `contact_submissions` (`brand_id`);--> statement-breakpoint
CREATE TABLE `__new_content` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text,
	`body` text,
	`metadata` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_content`("id", "brand_id", "type", "title", "body", "metadata", "status", "created_at") SELECT "id", "brand_id", "type", "title", "body", "metadata", "status", "created_at" FROM `content`;--> statement-breakpoint
DROP TABLE `content`;--> statement-breakpoint
ALTER TABLE `__new_content` RENAME TO `content`;--> statement-breakpoint
CREATE INDEX `content_brand_type_idx` ON `content` (`brand_id`,`type`);--> statement-breakpoint
CREATE TABLE `__new_discount_codes` (
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
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_discount_codes`("id", "brand_id", "code", "type", "value", "min_order", "max_uses", "used_count", "active", "starts_at", "expires_at", "created_at") SELECT "id", "brand_id", "code", "type", "value", "min_order", "max_uses", "used_count", "active", "starts_at", "expires_at", "created_at" FROM `discount_codes`;--> statement-breakpoint
DROP TABLE `discount_codes`;--> statement-breakpoint
ALTER TABLE `__new_discount_codes` RENAME TO `discount_codes`;--> statement-breakpoint
CREATE UNIQUE INDEX `discount_codes_brand_code_idx` ON `discount_codes` (`brand_id`,`code`);--> statement-breakpoint
CREATE TABLE `__new_newsletter_subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`status` text DEFAULT 'active' NOT NULL,
	`subscribed_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_newsletter_subscribers`("id", "brand_id", "email", "name", "status", "subscribed_at") SELECT "id", "brand_id", "email", "name", "status", "subscribed_at" FROM `newsletter_subscribers`;--> statement-breakpoint
DROP TABLE `newsletter_subscribers`;--> statement-breakpoint
ALTER TABLE `__new_newsletter_subscribers` RENAME TO `newsletter_subscribers`;--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_brand_email_idx` ON `newsletter_subscribers` (`brand_id`,`email`);--> statement-breakpoint
CREATE TABLE `__new_notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`is_read` integer DEFAULT false NOT NULL,
	`metadata` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_notifications`("id", "brand_id", "type", "title", "message", "is_read", "metadata", "created_at") SELECT "id", "brand_id", "type", "title", "message", "is_read", "metadata", "created_at" FROM `notifications`;--> statement-breakpoint
DROP TABLE `notifications`;--> statement-breakpoint
ALTER TABLE `__new_notifications` RENAME TO `notifications`;--> statement-breakpoint
CREATE INDEX `notifications_brand_id_idx` ON `notifications` (`brand_id`);--> statement-breakpoint
CREATE INDEX `notifications_read_idx` ON `notifications` (`brand_id`,`is_read`);--> statement-breakpoint
CREATE TABLE `__new_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text,
	`shipping_address` text,
	`items` text,
	`subtotal` real NOT NULL,
	`discount_code` text,
	`discount_amount` real DEFAULT 0,
	`total` real NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_orders`("id", "brand_id", "customer_email", "customer_name", "customer_phone", "shipping_address", "items", "subtotal", "discount_code", "discount_amount", "total", "currency", "status", "created_at", "updated_at") SELECT "id", "brand_id", "customer_email", "customer_name", "customer_phone", "shipping_address", "items", "subtotal", "discount_code", "discount_amount", "total", "currency", "status", "created_at", "updated_at" FROM `orders`;--> statement-breakpoint
DROP TABLE `orders`;--> statement-breakpoint
ALTER TABLE `__new_orders` RENAME TO `orders`;--> statement-breakpoint
CREATE INDEX `orders_brand_id_idx` ON `orders` (`brand_id`);--> statement-breakpoint
CREATE INDEX `orders_status_idx` ON `orders` (`brand_id`,`status`);--> statement-breakpoint
CREATE TABLE `__new_page_views` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`page` text NOT NULL,
	`referrer` text,
	`user_agent` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_page_views`("id", "brand_id", "page", "referrer", "user_agent", "created_at") SELECT "id", "brand_id", "page", "referrer", "user_agent", "created_at" FROM `page_views`;--> statement-breakpoint
DROP TABLE `page_views`;--> statement-breakpoint
ALTER TABLE `__new_page_views` RENAME TO `page_views`;--> statement-breakpoint
CREATE INDEX `page_views_brand_id_idx` ON `page_views` (`brand_id`);--> statement-breakpoint
CREATE INDEX `page_views_created_at_idx` ON `page_views` (`brand_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `__new_products` (
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
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "brand_id", "name", "description", "price", "currency", "image_url", "category", "sort_order", "status", "stock_count", "created_at") SELECT "id", "brand_id", "name", "description", "price", "currency", "image_url", "category", "sort_order", "status", "stock_count", "created_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
CREATE INDEX `products_brand_id_idx` ON `products` (`brand_id`);--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`brand_id`,`category`);--> statement-breakpoint
CREATE TABLE `__new_reviews` (
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
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "brand_id", "product_id", "author_name", "author_email", "rating", "title", "body", "verified_purchase", "helpful_count", "status", "created_at") SELECT "id", "brand_id", "product_id", "author_name", "author_email", "rating", "title", "body", "verified_purchase", "helpful_count", "status", "created_at" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
CREATE INDEX `reviews_brand_id_idx` ON `reviews` (`brand_id`);--> statement-breakpoint
CREATE INDEX `reviews_product_id_idx` ON `reviews` (`product_id`);--> statement-breakpoint
CREATE INDEX `reviews_status_idx` ON `reviews` (`brand_id`,`status`);--> statement-breakpoint
CREATE TABLE `__new_testimonials` (
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
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_testimonials`("id", "brand_id", "author_name", "author_role", "author_company", "quote", "rating", "avatar_url", "featured", "sort_order", "created_at") SELECT "id", "brand_id", "author_name", "author_role", "author_company", "quote", "rating", "avatar_url", "featured", "sort_order", "created_at" FROM `testimonials`;--> statement-breakpoint
DROP TABLE `testimonials`;--> statement-breakpoint
ALTER TABLE `__new_testimonials` RENAME TO `testimonials`;--> statement-breakpoint
CREATE INDEX `testimonials_brand_id_idx` ON `testimonials` (`brand_id`);--> statement-breakpoint
CREATE TABLE `__new_ticket_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_id` text NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_ticket_messages`("id", "ticket_id", "role", "content", "created_at") SELECT "id", "ticket_id", "role", "content", "created_at" FROM `ticket_messages`;--> statement-breakpoint
DROP TABLE `ticket_messages`;--> statement-breakpoint
ALTER TABLE `__new_ticket_messages` RENAME TO `ticket_messages`;--> statement-breakpoint
CREATE INDEX `ticket_messages_ticket_id_idx` ON `ticket_messages` (`ticket_id`);--> statement-breakpoint
CREATE TABLE `__new_tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`brand_id` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`subject` text NOT NULL,
	`category` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`satisfaction_rating` integer,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tickets`("id", "brand_id", "customer_name", "customer_email", "subject", "category", "priority", "status", "satisfaction_rating", "created_at", "updated_at") SELECT "id", "brand_id", "customer_name", "customer_email", "subject", "category", "priority", "status", "satisfaction_rating", "created_at", "updated_at" FROM `tickets`;--> statement-breakpoint
DROP TABLE `tickets`;--> statement-breakpoint
ALTER TABLE `__new_tickets` RENAME TO `tickets`;--> statement-breakpoint
CREATE INDEX `tickets_brand_status_idx` ON `tickets` (`brand_id`,`status`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`password_hash` text NOT NULL,
	`avatar_url` text,
	`token_version` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "name", "password_hash", "avatar_url", "token_version", "created_at") SELECT "id", "email", "name", "password_hash", "avatar_url", "token_version", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);