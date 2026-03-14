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
      results.push('Added brands.user_id');
    }

    // products: sort_order
    if (hasTable('products') && !hasColumn('products', 'sort_order')) {
      db.exec('ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 0');
      results.push('Added products.sort_order');
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
