-- Execute uma única vez no banco D1 existente cafe-da-manha-db
ALTER TABLE orders ADD COLUMN table_number TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_number);
CREATE TABLE IF NOT EXISTS site_settings(
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
