import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { mkdirSync } from "fs";
import { dirname } from "path";

const DATABASE_PATH = process.env.DATABASE_PATH || "./data/mayasura.db";

// Ensure the data directory exists
mkdirSync(dirname(DATABASE_PATH), { recursive: true });

const sqlite = new Database(DATABASE_PATH);

// Enable WAL mode for better concurrent read performance
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
export type Database = typeof db;
