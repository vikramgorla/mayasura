import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'mayasura.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      token_version INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Brands table (updated with user_id and industry)
    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      industry TEXT,
      logo_url TEXT,
      primary_color TEXT DEFAULT '#0f172a',
      secondary_color TEXT DEFAULT '#f8fafc',
      accent_color TEXT DEFAULT '#3b82f6',
      font_heading TEXT DEFAULT 'Inter',
      font_body TEXT DEFAULT 'Inter',
      brand_voice TEXT,
      channels TEXT DEFAULT '[]',
      status TEXT DEFAULT 'draft',
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      currency TEXT DEFAULT 'USD',
      image_url TEXT,
      category TEXT,
      sort_order INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS content (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT,
      body TEXT,
      metadata TEXT DEFAULT '{}',
      status TEXT DEFAULT 'draft',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      session_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Support tickets
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      category TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'open',
      satisfaction_rating INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ticket_messages (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Activity log
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      metadata TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- V3: Orders
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      shipping_address TEXT,
      items TEXT DEFAULT '[]',
      total REAL NOT NULL DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'pending',
      stripe_session_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- V3: Order items
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      price REAL NOT NULL DEFAULT 0
    );

    -- V3: Contact form submissions
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- V3: Newsletter subscribers
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      subscribed_at TEXT DEFAULT (datetime('now'))
    );

    -- V3: Brand settings (key-value store for integrations)
    CREATE TABLE IF NOT EXISTS brand_settings (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      key TEXT NOT NULL,
      value TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- V3: Brand pages (CMS)
    CREATE TABLE IF NOT EXISTS brand_pages (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      is_published INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- V3: Blog posts
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content TEXT,
      excerpt TEXT,
      category TEXT,
      tags TEXT DEFAULT '[]',
      status TEXT DEFAULT 'draft',
      published_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- V3: Chatbot FAQs
    CREATE TABLE IF NOT EXISTS chatbot_faqs (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    -- V3: Consumer users (separate from admin users)
    CREATE TABLE IF NOT EXISTS consumer_users (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- V3: Page views (simple analytics)
    CREATE TABLE IF NOT EXISTS page_views (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      page TEXT NOT NULL,
      referrer TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- V3.3: Notifications table
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      is_read INTEGER DEFAULT 0,
      metadata TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS brand_strategies (
      id TEXT PRIMARY KEY,
      brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      result TEXT NOT NULL DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_brand_strategies_brand ON brand_strategies(brand_id, type);
    CREATE INDEX IF NOT EXISTS idx_notifications_brand ON notifications(brand_id);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
    CREATE INDEX IF NOT EXISTS idx_content_brand ON content(brand_id);
    CREATE INDEX IF NOT EXISTS idx_chat_brand_session ON chat_messages(brand_id, session_id);
    CREATE INDEX IF NOT EXISTS idx_tickets_brand ON tickets(brand_id);
    CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
    CREATE INDEX IF NOT EXISTS idx_activities_brand ON activities(brand_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_orders_brand ON orders(brand_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_contact_submissions_brand ON contact_submissions(brand_id);
    CREATE INDEX IF NOT EXISTS idx_newsletter_brand ON newsletter_subscribers(brand_id);
    CREATE INDEX IF NOT EXISTS idx_brand_settings_brand_key ON brand_settings(brand_id, key);
    CREATE INDEX IF NOT EXISTS idx_brand_pages_brand ON brand_pages(brand_id);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_brand ON blog_posts(brand_id);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(brand_id, slug);
    CREATE INDEX IF NOT EXISTS idx_chatbot_faqs_brand ON chatbot_faqs(brand_id);
    CREATE INDEX IF NOT EXISTS idx_consumer_users_brand ON consumer_users(brand_id);
    CREATE INDEX IF NOT EXISTS idx_consumer_users_email ON consumer_users(brand_id, email);
    CREATE INDEX IF NOT EXISTS idx_page_views_brand ON page_views(brand_id);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_unique ON newsletter_subscribers(brand_id, email);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_brand_settings_unique ON brand_settings(brand_id, key);
  `);

  // Run migrations for existing databases
  runMigrations(db);
}

function hasColumn(db: Database.Database, table: string, column: string): boolean {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return cols.some(c => c.name === column);
}

function runMigrations(db: Database.Database) {
  console.log('[DB] Running migrations...');
  
  // Add industry column if missing
  if (!hasColumn(db, 'brands', 'industry')) {
    console.log('[DB] Adding industry column to brands');
    db.exec("ALTER TABLE brands ADD COLUMN industry TEXT");
  }
  
  // Add user_id column if missing
  if (!hasColumn(db, 'brands', 'user_id')) {
    console.log('[DB] Adding user_id column to brands');
    db.exec("ALTER TABLE brands ADD COLUMN user_id TEXT");
  }

  // Add sort_order column to products if missing
  if (!hasColumn(db, 'products', 'sort_order')) {
    console.log('[DB] Adding sort_order column to products');
    db.exec("ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0");
  }

  // V3: Add slug column to brands
  if (!hasColumn(db, 'brands', 'slug')) {
    console.log('[DB] Adding slug column to brands');
    db.exec("ALTER TABLE brands ADD COLUMN slug TEXT");
    // Generate slugs for existing brands
    const brands = db.prepare('SELECT id, name FROM brands WHERE slug IS NULL').all() as Array<{ id: string; name: string }>;
    const updateSlug = db.prepare('UPDATE brands SET slug = ? WHERE id = ?');
    for (const brand of brands) {
      const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      updateSlug.run(slug || brand.id, brand.id);
    }
  }

  // V3.2: Add token_version column to users for JWT revocation
  if (!hasColumn(db, 'users', 'token_version')) {
    console.log('[DB] Adding token_version column to users');
    db.exec("ALTER TABLE users ADD COLUMN token_version INTEGER DEFAULT 0");
  }

  // V3: Add stock_count column to products
  if (!hasColumn(db, 'products', 'stock_count')) {
    console.log('[DB] Adding stock_count column to products');
    db.exec("ALTER TABLE products ADD COLUMN stock_count INTEGER DEFAULT -1");
  }

  // V3.3: Add website_template column to brands
  if (!hasColumn(db, 'brands', 'website_template')) {
    console.log('[DB] Adding website_template column to brands');
    db.exec("ALTER TABLE brands ADD COLUMN website_template TEXT DEFAULT 'minimal'");
  }

  // V3.3: Add custom_css column to brands
  if (!hasColumn(db, 'brands', 'custom_css')) {
    console.log('[DB] Adding custom_css column to brands');
    db.exec("ALTER TABLE brands ADD COLUMN custom_css TEXT");
  }

  // V6: Add subject column to contact_submissions
  if (!hasColumn(db, 'contact_submissions', 'subject')) {
    console.log('[DB] Adding subject column to contact_submissions');
    db.exec("ALTER TABLE contact_submissions ADD COLUMN subject TEXT");
  }
  
  console.log('[DB] Migrations complete');
}

// ==================== User operations ====================

export function createUser(user: { id: string; email: string; name: string; password_hash: string }) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO users (id, email, name, password_hash)
    VALUES (@id, @email, @name, @password_hash)
  `);
  return stmt.run(user);
}

export function getUserByEmail(email: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function getUserById(id: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function getTokenVersion(userId: string): number {
  const db = getDb();
  const row = db.prepare('SELECT token_version FROM users WHERE id = ?').get(userId) as { token_version: number } | undefined;
  return row?.token_version ?? 0;
}

export function incrementTokenVersion(userId: string): number {
  const db = getDb();
  db.prepare('UPDATE users SET token_version = token_version + 1 WHERE id = ?').run(userId);
  const row = db.prepare('SELECT token_version FROM users WHERE id = ?').get(userId) as { token_version: number } | undefined;
  return row?.token_version ?? 0;
}

// ==================== Brand operations ====================

export function createBrand(brand: {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  industry?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_heading?: string;
  font_body?: string;
  brand_voice?: string;
  channels?: string;
  status?: string;
  user_id?: string;
  slug?: string;
}) {
  const db = getDb();
  
  // Detect available columns to handle v1 databases gracefully
  const cols = db.prepare("PRAGMA table_info(brands)").all() as Array<{ name: string }>;
  const colNames = new Set(cols.map(c => c.name));
  
  const data: Record<string, unknown> = {
    id: brand.id,
    name: brand.name,
    tagline: brand.tagline || null,
    description: brand.description || null,
    logo_url: brand.logo_url || null,
    primary_color: brand.primary_color || '#0f172a',
    secondary_color: brand.secondary_color || '#f8fafc',
    accent_color: brand.accent_color || '#3b82f6',
    font_heading: brand.font_heading || 'Inter',
    font_body: brand.font_body || 'Inter',
    brand_voice: brand.brand_voice || null,
    channels: brand.channels || '[]',
    status: brand.status || 'draft',
  };
  
  // Only include columns that exist in the table
  if (colNames.has('industry')) data.industry = brand.industry || null;
  if (colNames.has('user_id')) data.user_id = brand.user_id || null;
  if (colNames.has('slug')) {
    data.slug = brand.slug || brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  
  const fields = Object.keys(data);
  const placeholders = fields.map(f => `@${f}`);
  const sql = `INSERT INTO brands (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
  
  return db.prepare(sql).run(data);
}

export function getBrand(id: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM brands WHERE id = ?').get(id);
}

export function getAllBrands(userId?: string) {
  const db = getDb();
  if (userId) {
    return db.prepare('SELECT * FROM brands WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  }
  return db.prepare('SELECT * FROM brands ORDER BY created_at DESC').all();
}

// Whitelist of allowed columns for brand updates (H3: SQL injection prevention)
const ALLOWED_BRAND_FIELDS = new Set([
  'name', 'tagline', 'description', 'industry', 'logo_url',
  'primary_color', 'secondary_color', 'accent_color',
  'font_heading', 'font_body', 'brand_voice', 'channels', 'status', 'slug',
  'website_template', 'custom_css',
]);

export function updateBrand(id: string, updates: Record<string, unknown>) {
  const db = getDb();
  const safeUpdates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (ALLOWED_BRAND_FIELDS.has(key) && value !== undefined) {
      safeUpdates[key] = value;
    }
  }
  const fields = Object.keys(safeUpdates)
    .map(k => `${k} = @${k}`)
    .join(', ');
  if (!fields) return;
  const stmt = db.prepare(`UPDATE brands SET ${fields}, updated_at = datetime('now') WHERE id = @id`);
  return stmt.run({ ...safeUpdates, id });
}

export function deleteBrand(id: string) {
  const db = getDb();
  return db.prepare('DELETE FROM brands WHERE id = ?').run(id);
}

/**
 * Delete a brand and ALL related data in a single transaction.
 * Returns counts of deleted rows per table for confirmation UI.
 */
export function deleteBrandCascade(brandId: string): Record<string, number> {
  const db = getDb();
  db.pragma('foreign_keys = ON');

  const counts: Record<string, number> = {};

  const txn = db.transaction(() => {
    // 1. Leaf tables with brand_id FK
    counts.page_views = db.prepare('DELETE FROM page_views WHERE brand_id = ?').run(brandId).changes;
    counts.notifications = db.prepare('DELETE FROM notifications WHERE brand_id = ?').run(brandId).changes;
    counts.activities = db.prepare('DELETE FROM activities WHERE brand_id = ?').run(brandId).changes;
    counts.newsletter_subscribers = db.prepare('DELETE FROM newsletter_subscribers WHERE brand_id = ?').run(brandId).changes;
    counts.contact_submissions = db.prepare('DELETE FROM contact_submissions WHERE brand_id = ?').run(brandId).changes;
    counts.brand_settings = db.prepare('DELETE FROM brand_settings WHERE brand_id = ?').run(brandId).changes;
    counts.chatbot_faqs = db.prepare('DELETE FROM chatbot_faqs WHERE brand_id = ?').run(brandId).changes;
    counts.chat_messages = db.prepare('DELETE FROM chat_messages WHERE brand_id = ?').run(brandId).changes;

    // 2. Ticket messages via tickets (nested FK)
    const tickets = db.prepare('SELECT id FROM tickets WHERE brand_id = ?').all(brandId) as Array<{ id: string }>;
    let ticketMessageCount = 0;
    for (const t of tickets) {
      ticketMessageCount += db.prepare('DELETE FROM ticket_messages WHERE ticket_id = ?').run(t.id).changes;
    }
    counts.ticket_messages = ticketMessageCount;
    counts.tickets = db.prepare('DELETE FROM tickets WHERE brand_id = ?').run(brandId).changes;

    // 3. Order items via orders (nested FK)
    const orders = db.prepare('SELECT id FROM orders WHERE brand_id = ?').all(brandId) as Array<{ id: string }>;
    let orderItemCount = 0;
    for (const o of orders) {
      orderItemCount += db.prepare('DELETE FROM order_items WHERE order_id = ?').run(o.id).changes;
    }
    counts.order_items = orderItemCount;
    counts.orders = db.prepare('DELETE FROM orders WHERE brand_id = ?').run(brandId).changes;

    // 4. Remaining tables with brand_id FK
    counts.blog_posts = db.prepare('DELETE FROM blog_posts WHERE brand_id = ?').run(brandId).changes;
    counts.content = db.prepare('DELETE FROM content WHERE brand_id = ?').run(brandId).changes;
    counts.products = db.prepare('DELETE FROM products WHERE brand_id = ?').run(brandId).changes;
    counts.brand_pages = db.prepare('DELETE FROM brand_pages WHERE brand_id = ?').run(brandId).changes;
    counts.consumer_users = db.prepare('DELETE FROM consumer_users WHERE brand_id = ?').run(brandId).changes;

    // 5. Finally, delete the brand itself
    counts.brands = db.prepare('DELETE FROM brands WHERE id = ?').run(brandId).changes;
  });

  txn();
  return counts;
}

/**
 * Get counts of all related items for a brand (used in deletion confirmation UI).
 */
export function getBrandRelatedCounts(brandId: string): Record<string, number> {
  const db = getDb();
  const tables = [
    'products', 'content', 'chat_messages', 'tickets', 'activities',
    'orders', 'contact_submissions', 'newsletter_subscribers',
    'brand_settings', 'brand_pages', 'blog_posts', 'chatbot_faqs',
    'consumer_users', 'page_views',
  ];
  const counts: Record<string, number> = {};
  for (const table of tables) {
    const row = db.prepare(`SELECT COUNT(*) as count FROM ${table} WHERE brand_id = ?`).get(brandId) as { count: number };
    counts[table] = row.count;
  }
  return counts;
}

// ==================== Product operations ====================

export function createProduct(product: {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  image_url?: string;
  category?: string;
  sort_order?: number;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO products (id, brand_id, name, description, price, currency, image_url, category, sort_order)
    VALUES (@id, @brand_id, @name, @description, @price, @currency, @image_url, @category, @sort_order)
  `);
  return stmt.run({
    ...product,
    description: product.description || null,
    price: product.price || null,
    currency: product.currency || 'USD',
    image_url: product.image_url || null,
    category: product.category || null,
    sort_order: product.sort_order || 0,
  });
}

// ─── Brand Strategies ────────────────────────────────────────────
export function saveStrategy(brandId: string, type: string, result: unknown) {
  const db = getDb();
  const id = crypto.randomUUID();
  // Upsert: delete old of same type, insert new
  db.prepare('DELETE FROM brand_strategies WHERE brand_id = ? AND type = ?').run(brandId, type);
  db.prepare('INSERT INTO brand_strategies (id, brand_id, type, result) VALUES (?, ?, ?, ?)').run(
    id, brandId, type, JSON.stringify(result)
  );
  return id;
}

export function getStrategies(brandId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM brand_strategies WHERE brand_id = ? ORDER BY created_at DESC').all(brandId) as Array<{
    id: string;
    brand_id: string;
    type: string;
    result: string;
    created_at: string;
  }>;
}

export function getStrategyByType(brandId: string, type: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM brand_strategies WHERE brand_id = ? AND type = ? ORDER BY created_at DESC LIMIT 1').get(brandId, type) as {
    id: string;
    brand_id: string;
    type: string;
    result: string;
    created_at: string;
  } | undefined;
}

export function getProductsByBrand(brandId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM products WHERE brand_id = ? ORDER BY sort_order ASC, created_at DESC').all(brandId);
}

export function getProductById(productId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
}

export function getAllPublishedBrands() {
  const db = getDb();
  return db.prepare("SELECT * FROM brands WHERE status = 'launched' ORDER BY created_at DESC").all();
}

const ALLOWED_PRODUCT_FIELDS = new Set([
  'name', 'description', 'price', 'currency', 'image_url',
  'category', 'sort_order', 'status', 'stock_count',
]);

export function updateProduct(id: string, updates: Record<string, unknown>) {
  const db = getDb();
  const safeUpdates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (ALLOWED_PRODUCT_FIELDS.has(key) && value !== undefined) {
      safeUpdates[key] = value;
    }
  }
  const fields = Object.keys(safeUpdates)
    .map(k => `${k} = @${k}`)
    .join(', ');
  if (!fields) return;
  const stmt = db.prepare(`UPDATE products SET ${fields} WHERE id = @id`);
  return stmt.run({ ...safeUpdates, id });
}

export function deleteProduct(id: string) {
  const db = getDb();
  return db.prepare('DELETE FROM products WHERE id = ?').run(id);
}

export function deleteProductBatch(ids: string[]) {
  const db = getDb();
  const placeholders = ids.map(() => '?').join(', ');
  return db.prepare(`DELETE FROM products WHERE id IN (${placeholders})`).run(...ids);
}

export function reorderProducts(updates: { id: string; sort_order: number }[]) {
  const db = getDb();
  const stmt = db.prepare('UPDATE products SET sort_order = @sort_order WHERE id = @id');
  const transaction = db.transaction(() => {
    for (const update of updates) {
      stmt.run(update);
    }
  });
  transaction();
}

// ==================== Content operations ====================

export function createContent(content: {
  id: string;
  brand_id: string;
  type: string;
  title?: string;
  body?: string;
  metadata?: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO content (id, brand_id, type, title, body, metadata)
    VALUES (@id, @brand_id, @type, @title, @body, @metadata)
  `);
  return stmt.run({
    ...content,
    title: content.title || null,
    body: content.body || null,
    metadata: content.metadata || '{}',
  });
}

export function getContentByBrand(brandId: string, type?: string) {
  const db = getDb();
  if (type) {
    return db.prepare('SELECT * FROM content WHERE brand_id = ? AND type = ? ORDER BY created_at DESC').all(brandId, type);
  }
  return db.prepare('SELECT * FROM content WHERE brand_id = ? ORDER BY created_at DESC').all(brandId);
}

export function updateContent(id: string, updates: { title?: string; body?: string; status?: string; metadata?: string }) {
  const db = getDb();
  const fields: string[] = [];
  const values: Record<string, unknown> = { id };
  if (updates.title !== undefined) { fields.push('title = @title'); values.title = updates.title; }
  if (updates.body !== undefined) { fields.push('body = @body'); values.body = updates.body; }
  if (updates.status !== undefined) { fields.push('status = @status'); values.status = updates.status; }
  if (updates.metadata !== undefined) { fields.push('metadata = @metadata'); values.metadata = updates.metadata; }
  if (fields.length === 0) return;
  db.prepare(`UPDATE content SET ${fields.join(', ')} WHERE id = @id`).run(values);
}

export function deleteContent(id: string) {
  const db = getDb();
  return db.prepare('DELETE FROM content WHERE id = ?').run(id);
}

export function deleteContentBatch(ids: string[]) {
  const db = getDb();
  const placeholders = ids.map(() => '?').join(', ');
  return db.prepare(`DELETE FROM content WHERE id IN (${placeholders})`).run(...ids);
}

// ==================== Chat operations ====================

export function addChatMessage(msg: {
  id: string;
  brand_id: string;
  role: string;
  content: string;
  session_id?: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO chat_messages (id, brand_id, role, content, session_id)
    VALUES (@id, @brand_id, @role, @content, @session_id)
  `);
  return stmt.run({
    ...msg,
    session_id: msg.session_id || null,
  });
}

export function getChatHistory(brandId: string, sessionId?: string) {
  const db = getDb();
  if (sessionId) {
    return db.prepare('SELECT * FROM chat_messages WHERE brand_id = ? AND session_id = ? ORDER BY created_at ASC').all(brandId, sessionId);
  }
  return db.prepare('SELECT * FROM chat_messages WHERE brand_id = ? ORDER BY created_at DESC LIMIT 50').all(brandId);
}

// ==================== Ticket operations ====================

export function createTicket(ticket: {
  id: string;
  brand_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  category?: string;
  priority?: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO tickets (id, brand_id, customer_name, customer_email, subject, category, priority)
    VALUES (@id, @brand_id, @customer_name, @customer_email, @subject, @category, @priority)
  `);
  return stmt.run({
    ...ticket,
    category: ticket.category || null,
    priority: ticket.priority || 'medium',
  });
}

export function getTicketsByBrand(brandId: string, status?: string) {
  const db = getDb();
  if (status) {
    return db.prepare('SELECT * FROM tickets WHERE brand_id = ? AND status = ? ORDER BY created_at DESC').all(brandId, status);
  }
  return db.prepare('SELECT * FROM tickets WHERE brand_id = ? ORDER BY created_at DESC').all(brandId);
}

export function getTicket(id: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
}

const ALLOWED_TICKET_FIELDS = new Set([
  'status', 'priority', 'category', 'satisfaction_rating',
]);

export function updateTicket(id: string, updates: Record<string, unknown>) {
  const db = getDb();
  const safeUpdates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (ALLOWED_TICKET_FIELDS.has(key) && value !== undefined) {
      safeUpdates[key] = value;
    }
  }
  const fields = Object.keys(safeUpdates)
    .map(k => `${k} = @${k}`)
    .join(', ');
  if (!fields) return;
  const stmt = db.prepare(`UPDATE tickets SET ${fields}, updated_at = datetime('now') WHERE id = @id`);
  return stmt.run({ ...safeUpdates, id });
}

export function addTicketMessage(msg: {
  id: string;
  ticket_id: string;
  role: string;
  content: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO ticket_messages (id, ticket_id, role, content)
    VALUES (@id, @ticket_id, @role, @content)
  `);
  return stmt.run(msg);
}

export function getTicketMessages(ticketId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC').all(ticketId);
}

export function getTicketStats(brandId: string) {
  const db = getDb();
  const total = db.prepare('SELECT COUNT(*) as count FROM tickets WHERE brand_id = ?').get(brandId) as { count: number };
  const open = db.prepare("SELECT COUNT(*) as count FROM tickets WHERE brand_id = ? AND status IN ('open', 'in-progress')").get(brandId) as { count: number };
  const resolved = db.prepare("SELECT COUNT(*) as count FROM tickets WHERE brand_id = ? AND status = 'resolved'").get(brandId) as { count: number };
  const avgRating = db.prepare('SELECT AVG(satisfaction_rating) as avg FROM tickets WHERE brand_id = ? AND satisfaction_rating IS NOT NULL').get(brandId) as { avg: number | null };
  
  return {
    total: total.count,
    open: open.count,
    resolved: resolved.count,
    satisfaction: avgRating.avg ? Math.round(avgRating.avg * 10) / 10 : null,
  };
}

// ==================== Activity operations ====================

export function addActivity(activity: {
  id: string;
  brand_id: string;
  type: string;
  description: string;
  metadata?: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO activities (id, brand_id, type, description, metadata)
    VALUES (@id, @brand_id, @type, @description, @metadata)
  `);
  return stmt.run({
    ...activity,
    metadata: activity.metadata || '{}',
  });
}

export function getActivities(brandId: string, limit = 20) {
  const db = getDb();
  return db.prepare('SELECT * FROM activities WHERE brand_id = ? ORDER BY created_at DESC LIMIT ?').all(brandId, limit);
}

// ==================== Brand slug operations ====================

export function getBrandBySlug(slug: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM brands WHERE slug = ?').get(slug);
}

/**
 * Check if a slug is available (not used by another brand).
 * Returns true if available, false if taken.
 */
export function isSlugAvailable(slug: string, excludeBrandId?: string): boolean {
  const db = getDb();
  if (excludeBrandId) {
    const row = db.prepare('SELECT id FROM brands WHERE slug = ? AND id != ?').get(slug, excludeBrandId);
    return !row;
  }
  const row = db.prepare('SELECT id FROM brands WHERE slug = ?').get(slug);
  return !row;
}

// ==================== Brand Settings operations ====================

export function getBrandSetting(brandId: string, key: string): string | null {
  const db = getDb();
  const row = db.prepare('SELECT value FROM brand_settings WHERE brand_id = ? AND key = ?').get(brandId, key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function getBrandSettings(brandId: string): Record<string, string> {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM brand_settings WHERE brand_id = ?').all(brandId) as Array<{ key: string; value: string }>;
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export function setBrandSetting(brandId: string, key: string, value: string) {
  const db = getDb();
  const id = `${brandId}_${key}`;
  db.prepare(`
    INSERT INTO brand_settings (id, brand_id, key, value)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(brand_id, key) DO UPDATE SET value = excluded.value
  `).run(id, brandId, key, value);
}

// ==================== Brand Pages operations ====================

export function getBrandPages(brandId: string, publishedOnly = false) {
  const db = getDb();
  if (publishedOnly) {
    return db.prepare('SELECT * FROM brand_pages WHERE brand_id = ? AND is_published = 1 ORDER BY sort_order ASC').all(brandId);
  }
  return db.prepare('SELECT * FROM brand_pages WHERE brand_id = ? ORDER BY sort_order ASC').all(brandId);
}

export function getBrandPage(brandId: string, slug: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM brand_pages WHERE brand_id = ? AND slug = ?').get(brandId, slug);
}

export function upsertBrandPage(page: {
  id: string;
  brand_id: string;
  slug: string;
  title: string;
  content?: string;
  is_published?: number;
  sort_order?: number;
}) {
  const db = getDb();
  db.prepare(`
    INSERT INTO brand_pages (id, brand_id, slug, title, content, is_published, sort_order)
    VALUES (@id, @brand_id, @slug, @title, @content, @is_published, @sort_order)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      content = excluded.content,
      is_published = excluded.is_published,
      sort_order = excluded.sort_order
  `).run({
    ...page,
    content: page.content || null,
    is_published: page.is_published ?? 1,
    sort_order: page.sort_order ?? 0,
  });
}

// ==================== Blog Post operations ====================

export function getBlogPosts(brandId: string, publishedOnly = false) {
  const db = getDb();
  if (publishedOnly) {
    return db.prepare("SELECT * FROM blog_posts WHERE brand_id = ? AND status = 'published' ORDER BY published_at DESC").all(brandId);
  }
  return db.prepare('SELECT * FROM blog_posts WHERE brand_id = ? ORDER BY created_at DESC').all(brandId);
}

export function getBlogPost(brandId: string, slug: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM blog_posts WHERE brand_id = ? AND slug = ?').get(brandId, slug);
}

export function getBlogPostById(id: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(id);
}

export function createBlogPost(post: {
  id: string;
  brand_id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  category?: string;
  tags?: string;
  status?: string;
  published_at?: string;
}) {
  const db = getDb();
  db.prepare(`
    INSERT INTO blog_posts (id, brand_id, title, slug, content, excerpt, category, tags, status, published_at)
    VALUES (@id, @brand_id, @title, @slug, @content, @excerpt, @category, @tags, @status, @published_at)
  `).run({
    ...post,
    content: post.content || null,
    excerpt: post.excerpt || null,
    category: post.category || null,
    tags: post.tags || '[]',
    status: post.status || 'draft',
    published_at: post.published_at || null,
  });
}

const ALLOWED_BLOG_POST_FIELDS = new Set([
  'title', 'slug', 'content', 'excerpt', 'category', 'tags', 'status', 'published_at',
]);

export function updateBlogPost(id: string, updates: Record<string, unknown>) {
  const db = getDb();
  const safeUpdates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (ALLOWED_BLOG_POST_FIELDS.has(key) && value !== undefined) {
      safeUpdates[key] = value;
    }
  }
  const fields = Object.keys(safeUpdates)
    .map(k => `${k} = @${k}`)
    .join(', ');
  if (!fields) return;
  db.prepare(`UPDATE blog_posts SET ${fields} WHERE id = @id`).run({ ...safeUpdates, id });
}

export function deleteBlogPost(id: string) {
  const db = getDb();
  return db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
}

// ==================== Order operations ====================

export function createOrder(order: {
  id: string;
  brand_id: string;
  customer_email: string;
  customer_name: string;
  shipping_address?: string;
  items: string;
  total: number;
  currency?: string;
  status?: string;
  stripe_session_id?: string;
}) {
  const db = getDb();
  db.prepare(`
    INSERT INTO orders (id, brand_id, customer_email, customer_name, shipping_address, items, total, currency, status, stripe_session_id)
    VALUES (@id, @brand_id, @customer_email, @customer_name, @shipping_address, @items, @total, @currency, @status, @stripe_session_id)
  `).run({
    ...order,
    shipping_address: order.shipping_address || null,
    currency: order.currency || 'USD',
    status: order.status || 'pending',
    stripe_session_id: order.stripe_session_id || null,
  });
}

export function getOrdersByBrand(brandId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM orders WHERE brand_id = ? ORDER BY created_at DESC').all(brandId);
}

export function getOrder(id: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
}

const ALLOWED_ORDER_FIELDS = new Set(['status', 'shipping_address']);

export function updateOrder(id: string, updates: Record<string, unknown>) {
  const db = getDb();
  const safeUpdates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (ALLOWED_ORDER_FIELDS.has(key) && value !== undefined) {
      safeUpdates[key] = value;
    }
  }
  const fields = Object.keys(safeUpdates)
    .map(k => `${k} = @${k}`)
    .join(', ');
  if (!fields) return;
  db.prepare(`UPDATE orders SET ${fields} WHERE id = @id`).run({ ...safeUpdates, id });
}

// ==================== Contact form operations ====================

export function createContactSubmission(sub: {
  id: string;
  brand_id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const db = getDb();
  db.prepare(`
    INSERT INTO contact_submissions (id, brand_id, name, email, subject, message)
    VALUES (@id, @brand_id, @name, @email, @subject, @message)
  `).run({ ...sub, subject: sub.subject || null });
}

export function getContactSubmissions(brandId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM contact_submissions WHERE brand_id = ? ORDER BY created_at DESC').all(brandId);
}

export function updateContactSubmission(id: string, status: string) {
  const db = getDb();
  db.prepare('UPDATE contact_submissions SET status = ? WHERE id = ?').run(status, id);
}

// ==================== Newsletter operations ====================

export function addNewsletterSubscriber(brandId: string, email: string) {
  const db = getDb();
  const id = `${brandId}_${email}`;
  db.prepare(`
    INSERT OR IGNORE INTO newsletter_subscribers (id, brand_id, email)
    VALUES (?, ?, ?)
  `).run(id, brandId, email);
}

export function getNewsletterSubscribers(brandId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM newsletter_subscribers WHERE brand_id = ? ORDER BY subscribed_at DESC').all(brandId);
}

// ==================== Chatbot FAQ operations ====================

export function getChatbotFaqs(brandId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM chatbot_faqs WHERE brand_id = ? ORDER BY sort_order ASC').all(brandId);
}

export function createChatbotFaq(faq: { id: string; brand_id: string; question: string; answer: string; sort_order?: number }) {
  const db = getDb();
  db.prepare(`
    INSERT INTO chatbot_faqs (id, brand_id, question, answer, sort_order)
    VALUES (@id, @brand_id, @question, @answer, @sort_order)
  `).run({ ...faq, sort_order: faq.sort_order ?? 0 });
}

const ALLOWED_FAQ_FIELDS = new Set(['question', 'answer', 'sort_order']);

export function updateChatbotFaq(id: string, updates: Record<string, unknown>) {
  const db = getDb();
  const safeUpdates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (ALLOWED_FAQ_FIELDS.has(key) && value !== undefined) {
      safeUpdates[key] = value;
    }
  }
  const fields = Object.keys(safeUpdates)
    .map(k => `${k} = @${k}`)
    .join(', ');
  if (!fields) return;
  db.prepare(`UPDATE chatbot_faqs SET ${fields} WHERE id = @id`).run({ ...safeUpdates, id });
}

export function deleteChatbotFaq(id: string) {
  const db = getDb();
  return db.prepare('DELETE FROM chatbot_faqs WHERE id = ?').run(id);
}

// ==================== Page Views operations ====================

export function trackPageView(view: { id: string; brand_id: string; page: string; referrer?: string; user_agent?: string }) {
  const db = getDb();
  db.prepare(`
    INSERT INTO page_views (id, brand_id, page, referrer, user_agent)
    VALUES (@id, @brand_id, @page, @referrer, @user_agent)
  `).run({
    ...view,
    referrer: view.referrer || null,
    user_agent: view.user_agent || null,
  });
}

export function getPageViewStats(brandId: string, days = 30) {
  const db = getDb();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const total = db.prepare('SELECT COUNT(*) as count FROM page_views WHERE brand_id = ? AND created_at > ?').get(brandId, since) as { count: number };
  const byPage = db.prepare('SELECT page, COUNT(*) as count FROM page_views WHERE brand_id = ? AND created_at > ? GROUP BY page ORDER BY count DESC LIMIT 10').all(brandId, since);
  const byDay = db.prepare("SELECT DATE(created_at) as day, COUNT(*) as count FROM page_views WHERE brand_id = ? AND created_at > ? GROUP BY DATE(created_at) ORDER BY day ASC").all(brandId, since);
  return { total: total.count, byPage, byDay };
}

// ==================== Consumer User operations ====================

export function createConsumerUser(user: {
  id: string;
  brand_id: string;
  email: string;
  name: string;
  password_hash: string;
}) {
  const db = getDb();
  db.prepare(`
    INSERT INTO consumer_users (id, brand_id, email, name, password_hash)
    VALUES (@id, @brand_id, @email, @name, @password_hash)
  `).run(user);
}

export function getConsumerUserByEmail(brandId: string, email: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM consumer_users WHERE brand_id = ? AND email = ?').get(brandId, email);
}

export function getConsumerUser(id: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM consumer_users WHERE id = ?').get(id);
}

export function getOrdersByConsumer(brandId: string, email: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM orders WHERE brand_id = ? AND customer_email = ? ORDER BY created_at DESC').all(brandId, email);
}

// ==================== Notification operations ====================

export function createNotification(notification: {
  id: string;
  brand_id: string;
  type: string;
  title: string;
  message?: string;
  metadata?: string;
}) {
  const db = getDb();
  db.prepare(`
    INSERT INTO notifications (id, brand_id, type, title, message, metadata)
    VALUES (@id, @brand_id, @type, @title, @message, @metadata)
  `).run({
    ...notification,
    message: notification.message || null,
    metadata: notification.metadata || '{}',
  });
}

export function getNotifications(brandId: string, limit = 20, unreadOnly = false) {
  const db = getDb();
  if (unreadOnly) {
    return db.prepare('SELECT * FROM notifications WHERE brand_id = ? AND is_read = 0 ORDER BY created_at DESC LIMIT ?').all(brandId, limit);
  }
  return db.prepare('SELECT * FROM notifications WHERE brand_id = ? ORDER BY created_at DESC LIMIT ?').all(brandId, limit);
}

export function getUnreadNotificationCount(brandId: string): number {
  const db = getDb();
  const row = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE brand_id = ? AND is_read = 0').get(brandId) as { count: number };
  return row.count;
}

export function markNotificationRead(id: string) {
  const db = getDb();
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(id);
}

export function markAllNotificationsRead(brandId: string) {
  const db = getDb();
  db.prepare('UPDATE notifications SET is_read = 1 WHERE brand_id = ? AND is_read = 0').run(brandId);
}

// ==================== Enhanced Analytics ====================

export function getPageViewStatsEnhanced(brandId: string, days = 30) {
  const db = getDb();
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const prevSince = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000).toISOString();

  const total = db.prepare('SELECT COUNT(*) as count FROM page_views WHERE brand_id = ? AND created_at > ?').get(brandId, since) as { count: number };
  const prevTotal = db.prepare('SELECT COUNT(*) as count FROM page_views WHERE brand_id = ? AND created_at > ? AND created_at <= ?').get(brandId, prevSince, since) as { count: number };

  const byPage = db.prepare('SELECT page, COUNT(*) as count FROM page_views WHERE brand_id = ? AND created_at > ? GROUP BY page ORDER BY count DESC LIMIT 10').all(brandId, since);
  const byDay = db.prepare("SELECT DATE(created_at) as day, COUNT(*) as count FROM page_views WHERE brand_id = ? AND created_at > ? GROUP BY DATE(created_at) ORDER BY day ASC").all(brandId, since);

  // Unique visitors (approximate by user_agent)
  const uniqueVisitors = db.prepare('SELECT COUNT(DISTINCT user_agent) as count FROM page_views WHERE brand_id = ? AND created_at > ? AND user_agent IS NOT NULL').get(brandId, since) as { count: number };
  const prevUniqueVisitors = db.prepare('SELECT COUNT(DISTINCT user_agent) as count FROM page_views WHERE brand_id = ? AND created_at > ? AND created_at <= ? AND user_agent IS NOT NULL').get(brandId, prevSince, since) as { count: number };

  // Device breakdown from user_agent
  const allViews = db.prepare('SELECT user_agent FROM page_views WHERE brand_id = ? AND created_at > ? AND user_agent IS NOT NULL').all(brandId, since) as Array<{ user_agent: string }>;
  let mobile = 0, tablet = 0, desktop = 0;
  for (const v of allViews) {
    const ua = v.user_agent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
      if (ua.includes('tablet') || ua.includes('ipad')) tablet++;
      else mobile++;
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      tablet++;
    } else {
      desktop++;
    }
  }

  // Referrer breakdown
  const byReferrer = db.prepare("SELECT referrer, COUNT(*) as count FROM page_views WHERE brand_id = ? AND created_at > ? AND referrer IS NOT NULL AND referrer != '' GROUP BY referrer ORDER BY count DESC LIMIT 10").all(brandId, since);

  return {
    total: total.count,
    prevTotal: prevTotal.count,
    uniqueVisitors: uniqueVisitors.count,
    prevUniqueVisitors: prevUniqueVisitors.count,
    byPage,
    byDay,
    devices: { mobile, tablet, desktop },
    byReferrer,
  };
}

// ==================== Full Brand Export ====================

export function getFullBrandExport(brandId: string) {
  const db = getDb();
  const brand = getBrand(brandId);
  const products = getProductsByBrand(brandId);
  const content = getContentByBrand(brandId);
  const blogPosts = getBlogPosts(brandId);
  const orders = getOrdersByBrand(brandId);
  const contacts = getContactSubmissions(brandId);
  const subscribers = getNewsletterSubscribers(brandId);
  const settings = getBrandSettings(brandId);
  const pages = getBrandPages(brandId);
  const faqs = getChatbotFaqs(brandId);
  const activities = getActivities(brandId, 100);
  const tickets = getTicketsByBrand(brandId);

  return {
    brand,
    products,
    content,
    blogPosts,
    orders,
    contacts,
    subscribers,
    settings,
    pages,
    faqs,
    activities,
    tickets,
    exportedAt: new Date().toISOString(),
    version: '3.3',
  };
}
