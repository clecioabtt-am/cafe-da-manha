-- Execute uma única vez no banco D1 existente cafe-da-manha-db
ALTER TABLE menu_items ADD COLUMN image_data TEXT DEFAULT '';
CREATE TABLE IF NOT EXISTS menu_categories(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL UNIQUE,icon TEXT DEFAULT '🍽️',image_data TEXT DEFAULT '',active INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO menu_categories(name,icon,sort_order) VALUES ('Lanches','🥪',10),('Tapiocas','🌮',20),('Regionais','🌽',30),('Bebidas','☕',40),('Sucos','🥤',50);
