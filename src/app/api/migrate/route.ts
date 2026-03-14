import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// One-time migration endpoint — safe to call multiple times (idempotent)
export async function POST() {
  try {
    const db = getDb();

    const results: string[] = [];

    function hasColumn(table: string, col: string) {
      const cols = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
      return cols.some(c => c.name === col);
    }

    function hasTable(table: string) {
      const t = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?"
      ).get(table);
      return !!t;
    }

    // brands: industry
    if (hasTable('brands') && !hasColumn('brands', 'industry')) {
      db.exec('ALTER TABLE brands ADD COLUMN industry TEXT');
      results.push('Added brands.industry');
    }

    // brands: user_id
    if (hasTable('brands') && !hasColumn('brands', 'user_id')) {
      db.exec('ALTER TABLE brands ADD COLUMN user_id TEXT');
      try { db.exec('CREATE INDEX IF NOT EXISTS idx_brands_user ON brands(user_id)'); } catch { /* ok */ }
      results.push('Added brands.user_id + index');
    }

    // brands: slug (V3)
    if (hasTable('brands') && !hasColumn('brands', 'slug')) {
      db.exec('ALTER TABLE brands ADD COLUMN slug TEXT');
      // Generate slugs for existing brands
      const brands = db.prepare('SELECT id, name FROM brands WHERE slug IS NULL').all() as Array<{ id: string; name: string }>;
      const updateSlug = db.prepare('UPDATE brands SET slug = ? WHERE id = ?');
      for (const brand of brands) {
        const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        updateSlug.run(slug || brand.id, brand.id);
      }
      results.push('Added brands.slug + generated slugs for existing brands');
    }

    // products: sort_order
    if (hasTable('products') && !hasColumn('products', 'sort_order')) {
      db.exec('ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0');
      results.push('Added products.sort_order');
    }

    // products: stock_count (V3)
    if (hasTable('products') && !hasColumn('products', 'stock_count')) {
      db.exec('ALTER TABLE products ADD COLUMN stock_count INTEGER DEFAULT -1');
      results.push('Added products.stock_count');
    }

    // Create missing tables
    if (!hasTable('users')) {
      db.exec(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )`);
      results.push('Created users table');
    }

    if (!hasTable('tickets')) {
      db.exec(`CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        subject TEXT NOT NULL,
        category TEXT,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'open',
        satisfaction_rating INTEGER,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )`);
      results.push('Created tickets table');
    }

    if (!hasTable('ticket_messages')) {
      db.exec(`CREATE TABLE IF NOT EXISTS ticket_messages (
        id TEXT PRIMARY KEY,
        ticket_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )`);
      results.push('Created ticket_messages table');
    }

    if (!hasTable('activities')) {
      db.exec(`CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        metadata TEXT DEFAULT '{}',
        created_at TEXT DEFAULT (datetime('now'))
      )`);
      results.push('Created activities table');
    }

    // V3 tables
    const v3Tables = [
      { name: 'orders', sql: `CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        shipping_address TEXT,
        items TEXT DEFAULT '[]',
        total REAL NOT NULL DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'pending',
        stripe_session_id TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )` },
      { name: 'order_items', sql: `CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        product_id TEXT,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        price REAL NOT NULL DEFAULT 0
      )` },
      { name: 'contact_submissions', sql: `CREATE TABLE IF NOT EXISTS contact_submissions (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        created_at TEXT DEFAULT (datetime('now'))
      )` },
      { name: 'newsletter_subscribers', sql: `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        email TEXT NOT NULL,
        subscribed_at TEXT DEFAULT (datetime('now'))
      )` },
      { name: 'brand_settings', sql: `CREATE TABLE IF NOT EXISTS brand_settings (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )` },
      { name: 'brand_pages', sql: `CREATE TABLE IF NOT EXISTS brand_pages (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        slug TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        is_published INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      )` },
      { name: 'blog_posts', sql: `CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        content TEXT,
        excerpt TEXT,
        category TEXT,
        tags TEXT DEFAULT '[]',
        status TEXT DEFAULT 'draft',
        published_at TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )` },
      { name: 'chatbot_faqs', sql: `CREATE TABLE IF NOT EXISTS chatbot_faqs (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0
      )` },
      { name: 'consumer_users', sql: `CREATE TABLE IF NOT EXISTS consumer_users (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )` },
      { name: 'page_views', sql: `CREATE TABLE IF NOT EXISTS page_views (
        id TEXT PRIMARY KEY,
        brand_id TEXT NOT NULL,
        page TEXT NOT NULL,
        referrer TEXT,
        user_agent TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )` },
    ];

    for (const table of v3Tables) {
      if (!hasTable(table.name)) {
        db.exec(table.sql);
        results.push(`Created ${table.name} table`);
      }
    }

    // V3 indexes
    const v3Indexes = [
      'CREATE INDEX IF NOT EXISTS idx_orders_brand ON orders(brand_id)',
      'CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)',
      'CREATE INDEX IF NOT EXISTS idx_contact_submissions_brand ON contact_submissions(brand_id)',
      'CREATE INDEX IF NOT EXISTS idx_newsletter_brand ON newsletter_subscribers(brand_id)',
      'CREATE INDEX IF NOT EXISTS idx_brand_settings_brand_key ON brand_settings(brand_id, key)',
      'CREATE INDEX IF NOT EXISTS idx_brand_pages_brand ON brand_pages(brand_id)',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_brand ON blog_posts(brand_id)',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(brand_id, slug)',
      'CREATE INDEX IF NOT EXISTS idx_chatbot_faqs_brand ON chatbot_faqs(brand_id)',
      'CREATE INDEX IF NOT EXISTS idx_consumer_users_brand ON consumer_users(brand_id)',
      'CREATE INDEX IF NOT EXISTS idx_consumer_users_email ON consumer_users(brand_id, email)',
      'CREATE INDEX IF NOT EXISTS idx_page_views_brand ON page_views(brand_id)',
    ];

    for (const idx of v3Indexes) {
      try { db.exec(idx); } catch { /* index may already exist */ }
    }
    results.push('V3 indexes ensured');

    return NextResponse.json({
      ok: true,
      applied: results.length > 0 ? results : ['Nothing to migrate — schema up to date'],
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[migrate] Error:', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ hint: 'POST to this endpoint to run migrations' });
}
