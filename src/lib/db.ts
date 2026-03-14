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

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
    CREATE INDEX IF NOT EXISTS idx_content_brand ON content(brand_id);
    CREATE INDEX IF NOT EXISTS idx_chat_brand_session ON chat_messages(brand_id, session_id);
    CREATE INDEX IF NOT EXISTS idx_tickets_brand ON tickets(brand_id);
    CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
    CREATE INDEX IF NOT EXISTS idx_activities_brand ON activities(brand_id);
    CREATE INDEX IF NOT EXISTS idx_brands_user ON brands(user_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  // Run migrations for existing databases
  runMigrations(db);
}

function runMigrations(db: Database.Database) {
  // Add industry column if missing
  try {
    db.prepare("SELECT industry FROM brands LIMIT 1").get();
  } catch {
    try { db.exec("ALTER TABLE brands ADD COLUMN industry TEXT"); } catch { /* already exists */ }
  }
  
  // Add user_id column if missing (no REFERENCES in ALTER TABLE for SQLite compatibility)
  try {
    db.prepare("SELECT user_id FROM brands LIMIT 1").get();
  } catch {
    try { db.exec("ALTER TABLE brands ADD COLUMN user_id TEXT"); } catch { /* already exists */ }
  }

  // Add sort_order column to products if missing
  try {
    db.prepare("SELECT sort_order FROM products LIMIT 1").get();
  } catch {
    try { db.exec("ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0"); } catch { /* already exists */ }
  }
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
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO brands (id, name, tagline, description, industry, logo_url, primary_color, secondary_color, accent_color, font_heading, font_body, brand_voice, channels, status, user_id)
    VALUES (@id, @name, @tagline, @description, @industry, @logo_url, @primary_color, @secondary_color, @accent_color, @font_heading, @font_body, @brand_voice, @channels, @status, @user_id)
  `);
  return stmt.run({
    ...brand,
    tagline: brand.tagline || null,
    description: brand.description || null,
    industry: brand.industry || null,
    logo_url: brand.logo_url || null,
    primary_color: brand.primary_color || '#0f172a',
    secondary_color: brand.secondary_color || '#f8fafc',
    accent_color: brand.accent_color || '#3b82f6',
    font_heading: brand.font_heading || 'Inter',
    font_body: brand.font_body || 'Inter',
    brand_voice: brand.brand_voice || null,
    channels: brand.channels || '[]',
    status: brand.status || 'draft',
    user_id: brand.user_id || null,
  });
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

export function updateBrand(id: string, updates: Record<string, unknown>) {
  const db = getDb();
  const fields = Object.keys(updates)
    .filter(k => updates[k] !== undefined)
    .map(k => `${k} = @${k}`)
    .join(', ');
  if (!fields) return;
  const stmt = db.prepare(`UPDATE brands SET ${fields}, updated_at = datetime('now') WHERE id = @id`);
  return stmt.run({ ...updates, id });
}

export function deleteBrand(id: string) {
  const db = getDb();
  return db.prepare('DELETE FROM brands WHERE id = ?').run(id);
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

export function getProductsByBrand(brandId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM products WHERE brand_id = ? ORDER BY sort_order ASC, created_at DESC').all(brandId);
}

export function updateProduct(id: string, updates: Record<string, unknown>) {
  const db = getDb();
  const fields = Object.keys(updates)
    .filter(k => updates[k] !== undefined)
    .map(k => `${k} = @${k}`)
    .join(', ');
  if (!fields) return;
  const stmt = db.prepare(`UPDATE products SET ${fields} WHERE id = @id`);
  return stmt.run({ ...updates, id });
}

export function deleteProduct(id: string) {
  const db = getDb();
  return db.prepare('DELETE FROM products WHERE id = ?').run(id);
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

export function deleteContent(id: string) {
  const db = getDb();
  return db.prepare('DELETE FROM content WHERE id = ?').run(id);
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

export function updateTicket(id: string, updates: Record<string, unknown>) {
  const db = getDb();
  const fields = Object.keys(updates)
    .filter(k => updates[k] !== undefined)
    .map(k => `${k} = @${k}`)
    .join(', ');
  if (!fields) return;
  const stmt = db.prepare(`UPDATE tickets SET ${fields}, updated_at = datetime('now') WHERE id = @id`);
  return stmt.run({ ...updates, id });
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
