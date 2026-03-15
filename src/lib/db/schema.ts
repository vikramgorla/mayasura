import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ============================================
// 1. Users
// ============================================
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  avatarUrl: text("avatar_url"),
  tokenVersion: integer("token_version").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// ============================================
// 2. Brands
// ============================================
export const brands = sqliteTable(
  "brands",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    tagline: text("tagline"),
    description: text("description"),
    industry: text("industry"),
    logoUrl: text("logo_url"),
    primaryColor: text("primary_color"),
    secondaryColor: text("secondary_color"),
    accentColor: text("accent_color"),
    fontHeading: text("font_heading"),
    fontBody: text("font_body"),
    brandVoice: text("brand_voice"),
    channels: text("channels"), // JSON array
    status: text("status").notNull().default("draft"),
    websiteTemplate: text("website_template"),
    customCss: text("custom_css"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    chatbotGreeting: text("chatbot_greeting"),
    chatbotColor: text("chatbot_color"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("brands_user_id_idx").on(table.userId),
    index("brands_status_idx").on(table.status),
  ]
);

// ============================================
// 3. Products
// ============================================
export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    price: real("price").notNull(),
    currency: text("currency").notNull().default("USD"),
    imageUrl: text("image_url"),
    category: text("category"),
    sortOrder: integer("sort_order").notNull().default(0),
    status: text("status").notNull().default("active"),
    stockCount: integer("stock_count"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("products_brand_id_idx").on(table.brandId),
    index("products_category_idx").on(table.brandId, table.category),
  ]
);

// ============================================
// 4. Orders
// ============================================
export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    customerEmail: text("customer_email").notNull(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone"),
    shippingAddress: text("shipping_address"),
    items: text("items"), // JSON
    subtotal: real("subtotal").notNull(),
    discountCode: text("discount_code"),
    discountAmount: real("discount_amount").default(0),
    total: real("total").notNull(),
    currency: text("currency").notNull().default("USD"),
    status: text("status").notNull().default("pending"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("orders_brand_id_idx").on(table.brandId),
    index("orders_status_idx").on(table.brandId, table.status),
  ]
);

// ============================================
// 5. Order Items
// ============================================
export const orderItems = sqliteTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productName: text("product_name").notNull(),
    quantity: integer("quantity").notNull(),
    price: real("price").notNull(),
  },
  (table) => [index("order_items_order_id_idx").on(table.orderId)]
);

// ============================================
// 6. Blog Posts
// ============================================
export const blogPosts = sqliteTable(
  "blog_posts",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    content: text("content"),
    excerpt: text("excerpt"),
    category: text("category"),
    tags: text("tags"), // JSON array
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    status: text("status").notNull().default("draft"),
    publishedAt: text("published_at"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("blog_posts_brand_slug_idx").on(table.brandId, table.slug),
    index("blog_posts_status_idx").on(table.brandId, table.status),
  ]
);

// ============================================
// 7. Content
// ============================================
export const content = sqliteTable(
  "content",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title"),
    body: text("body"),
    metadata: text("metadata"), // JSON
    status: text("status").notNull().default("draft"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("content_brand_type_idx").on(table.brandId, table.type),
  ]
);

// ============================================
// 8. Chat Messages
// ============================================
export const chatMessages = sqliteTable(
  "chat_messages",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    role: text("role").notNull(), // "user" | "assistant"
    content: text("content").notNull(),
    sessionId: text("session_id").notNull(),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("chat_messages_session_idx").on(table.brandId, table.sessionId),
  ]
);

// ============================================
// 9. Tickets
// ============================================
export const tickets = sqliteTable(
  "tickets",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    subject: text("subject").notNull(),
    category: text("category"),
    priority: text("priority").notNull().default("medium"),
    status: text("status").notNull().default("open"),
    satisfactionRating: integer("satisfaction_rating"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("tickets_brand_status_idx").on(table.brandId, table.status),
  ]
);

// ============================================
// 10. Ticket Messages
// ============================================
export const ticketMessages = sqliteTable(
  "ticket_messages",
  {
    id: text("id").primaryKey(),
    ticketId: text("ticket_id")
      .notNull()
      .references(() => tickets.id, { onDelete: "cascade" }),
    role: text("role").notNull(), // "customer" | "agent"
    content: text("content").notNull(),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("ticket_messages_ticket_id_idx").on(table.ticketId),
  ]
);

// ============================================
// 11. Activities
// ============================================
export const activities = sqliteTable(
  "activities",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    description: text("description").notNull(),
    metadata: text("metadata"), // JSON
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("activities_brand_id_idx").on(table.brandId),
  ]
);

// ============================================
// 12. Contact Submissions
// ============================================
export const contactSubmissions = sqliteTable(
  "contact_submissions",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject"),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("contact_submissions_brand_id_idx").on(table.brandId),
  ]
);

// ============================================
// 13. Newsletter Subscribers
// ============================================
export const newsletterSubscribers = sqliteTable(
  "newsletter_subscribers",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name"),
    status: text("status").notNull().default("active"),
    subscribedAt: text("subscribed_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("newsletter_brand_email_idx").on(table.brandId, table.email),
  ]
);

// ============================================
// 14. Brand Settings
// ============================================
export const brandSettings = sqliteTable(
  "brand_settings",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    value: text("value"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("brand_settings_brand_key_idx").on(table.brandId, table.key),
  ]
);

// ============================================
// 15. Brand Pages
// ============================================
export const brandPages = sqliteTable(
  "brand_pages",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    isPublished: integer("is_published", { mode: "boolean" })
      .notNull()
      .default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("brand_pages_brand_slug_idx").on(table.brandId, table.slug),
  ]
);

// ============================================
// 16. Chatbot FAQs
// ============================================
export const chatbotFaqs = sqliteTable(
  "chatbot_faqs",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("chatbot_faqs_brand_id_idx").on(table.brandId),
  ]
);

// ============================================
// 17. Consumer Users
// ============================================
export const consumerUsers = sqliteTable(
  "consumer_users",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    name: text("name"),
    passwordHash: text("password_hash").notNull(),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("consumer_users_brand_email_idx").on(table.brandId, table.email),
  ]
);

// ============================================
// 18. Page Views
// ============================================
export const pageViews = sqliteTable(
  "page_views",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    page: text("page").notNull(),
    referrer: text("referrer"),
    userAgent: text("user_agent"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("page_views_brand_id_idx").on(table.brandId),
    index("page_views_created_at_idx").on(table.brandId, table.createdAt),
  ]
);

// ============================================
// 19. Notifications
// ============================================
export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    metadata: text("metadata"), // JSON
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("notifications_brand_id_idx").on(table.brandId),
    index("notifications_read_idx").on(table.brandId, table.isRead),
  ]
);

// ============================================
// 20. Testimonials
// ============================================
export const testimonials = sqliteTable(
  "testimonials",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    authorName: text("author_name").notNull(),
    authorRole: text("author_role"),
    authorCompany: text("author_company"),
    quote: text("quote").notNull(),
    rating: integer("rating"),
    avatarUrl: text("avatar_url"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("testimonials_brand_id_idx").on(table.brandId),
  ]
);

// ============================================
// 21. Brand Strategies
// ============================================
export const brandStrategies = sqliteTable(
  "brand_strategies",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    result: text("result"), // JSON
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("brand_strategies_brand_id_idx").on(table.brandId),
  ]
);

// ============================================
// 22. Reviews
// ============================================
export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    authorName: text("author_name").notNull(),
    authorEmail: text("author_email").notNull(),
    rating: integer("rating").notNull(),
    title: text("title"),
    body: text("body"),
    verifiedPurchase: integer("verified_purchase", { mode: "boolean" })
      .notNull()
      .default(false),
    helpfulCount: integer("helpful_count").notNull().default(0),
    status: text("status").notNull().default("pending"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    index("reviews_brand_id_idx").on(table.brandId),
    index("reviews_product_id_idx").on(table.productId),
    index("reviews_status_idx").on(table.brandId, table.status),
  ]
);

// ============================================
// 23. Discount Codes
// ============================================
export const discountCodes = sqliteTable(
  "discount_codes",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    type: text("type").notNull(), // "percentage" | "fixed"
    value: real("value").notNull(),
    minOrder: real("min_order"),
    maxUses: integer("max_uses"),
    usedCount: integer("used_count").notNull().default(0),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    startsAt: text("starts_at"),
    expiresAt: text("expires_at"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("discount_codes_brand_code_idx").on(table.brandId, table.code),
  ]
);
