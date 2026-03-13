import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'mayasura.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tagline TEXT,
      description TEXT,
      logo_url TEXT,
      primary_color TEXT DEFAULT '#0f172a',
      secondary_color TEXT DEFAULT '#f8fafc',
      accent_color TEXT DEFAULT '#3b82f6',
      font_heading TEXT DEFAULT 'Inter',
      font_body TEXT DEFAULT 'Inter',
      brand_voice TEXT,
      channels TEXT DEFAULT '[]',
      status TEXT DEFAULT 'draft',
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

    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
    CREATE INDEX IF NOT EXISTS idx_content_brand ON content(brand_id);
    CREATE INDEX IF NOT EXISTS idx_chat_brand_session ON chat_messages(brand_id, session_id);
  `);
}

// Brand operations
export function createBrand(brand: {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_heading?: string;
  font_body?: string;
  brand_voice?: string;
  channels?: string;
  status?: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO brands (id, name, tagline, description, logo_url, primary_color, secondary_color, accent_color, font_heading, font_body, brand_voice, channels, status)
    VALUES (@id, @name, @tagline, @description, @logo_url, @primary_color, @secondary_color, @accent_color, @font_heading, @font_body, @brand_voice, @channels, @status)
  `);
  return stmt.run({
    ...brand,
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
  });
}

export function getBrand(id: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM brands WHERE id = ?').get(id);
}

export function getAllBrands() {
  const db = getDb();
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

// Product operations
export function createProduct(product: {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  price?: number;
  currency?: string;
  image_url?: string;
  category?: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO products (id, brand_id, name, description, price, currency, image_url, category)
    VALUES (@id, @brand_id, @name, @description, @price, @currency, @image_url, @category)
  `);
  return stmt.run({
    ...product,
    description: product.description || null,
    price: product.price || null,
    currency: product.currency || 'USD',
    image_url: product.image_url || null,
    category: product.category || null,
  });
}

export function getProductsByBrand(brandId: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM products WHERE brand_id = ? ORDER BY created_at DESC').all(brandId);
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

// Content operations
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

// Chat operations
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
