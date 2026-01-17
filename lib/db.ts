import Database from 'better-sqlite3';
import path from 'path';

declare global {
  var db: Database.Database | undefined;
}

// Use a singleton pattern to avoid multiple connections in dev mode
let db: Database.Database;

// In a real production app we might want to place the DB in a specific data folder,
// but for a standalone local app, the root directory is predictable and easy to backup.
const dbPath = path.join(process.cwd(), 'inventory.db');

if (!global.db) {
  db = new Database(dbPath);
  // Enable WAL mode for better concurrency and performance
  db.pragma('journal_mode = WAL');
  // ENFORCE FOREIGN KEYS (Crucial for SQLite)
  db.pragma('foreign_keys = ON');
  global.db = db;
} else {
  db = global.db;
}

export function initDb() {
  const setup = `
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 0 CHECK (quantity >= 0),
      unit TEXT NOT NULL DEFAULT 'units',
      min_level REAL NOT NULL DEFAULT 0,
      cost_per_unit REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS accessories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 0 CHECK (quantity >= 0),
      unit TEXT NOT NULL DEFAULT 'pcs',
      min_level REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      material_id INTEGER,
      yield_per_unit REAL NOT NULL, -- How many products from 1 unit of material
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY(material_id) REFERENCES materials(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_accessories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      accessory_id INTEGER,
      quantity_per_product REAL NOT NULL, -- How many accessories needed for 1 product
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY(accessory_id) REFERENCES accessories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    -- Seed default currency if not exists
    INSERT OR IGNORE INTO settings (key, value) VALUES ('currency', 'USD');
  `;
  db.exec(setup);
}

export function getSetting(key: string): string {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value || '';
}

export function setSetting(key: string, value: string) {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
}

// Initialize tables on first import/load
initDb();

export default db;
