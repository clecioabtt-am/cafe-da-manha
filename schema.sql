PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS menu_items(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL CHECK(price>=0),
  icon TEXT DEFAULT '🍽️',
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  table_number TEXT,
  note TEXT,
  total REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Novo' CHECK(status IN('Novo','Em preparo','Pronto','Concluído')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  menu_item_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK(quantity>0),
  unit_price REAL NOT NULL CHECK(unit_price>=0),
  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY(menu_item_id) REFERENCES menu_items(id)
);

CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(table_number);
CREATE INDEX IF NOT EXISTS idx_items_order ON order_items(order_id);

CREATE TABLE IF NOT EXISTS site_settings(
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO menu_items(id,name,category,description,price,icon,active,sort_order) VALUES
(1,'X-Caboquinho','Lanches','Pão, queijo, tucumã e banana',12.00,'🥪',1,10),
(2,'Misto','Lanches','Queijo e presunto',8.00,'🥪',1,20),
(3,'Misto com Ovo','Lanches','Misto reforçado com ovo',10.00,'🍳',1,30),
(4,'Pão com Ovo','Lanches','Tradicional e saboroso',7.00,'🥚',1,40),
(5,'Pão com Tucumã','Lanches','Sabor regional',9.00,'🥖',1,50),
(6,'Tapioca Simples','Tapiocas','Tapioca tradicional',6.00,'🌮',1,60),
(7,'Tapioca Mista','Tapiocas','Queijo e presunto',9.00,'🌮',1,70),
(8,'Tapioca Mista com Ovo','Tapiocas','Mais proteína',11.00,'🍳',1,80),
(9,'Tapioca Mista com Ovo e Banana','Tapiocas','Doce e salgada',13.00,'🍌',1,90),
(10,'Tapioca Mista com Ovo e Tucumã','Tapiocas','Regional reforçada',14.00,'🌴',1,100),
(11,'Cuscuz Simples','Regionais','Bem soltinho',6.00,'🌽',1,110),
(12,'Cuscuz com Ovo','Regionais','Cuscuz com ovo',9.00,'🍳',1,120),
(13,'Cuscuz com Tucumã','Regionais','Cuscuz regional',11.00,'🌴',1,130),
(14,'Mingau de Munguzá','Regionais','Cremoso e quentinho',7.00,'🥣',1,140),
(15,'Café Preto','Bebidas','Quente e tradicional',3.00,'☕',1,150),
(16,'Café com Leite','Bebidas','Leve e saboroso',4.00,'🥛',1,160),
(17,'Nescau','Bebidas','Achocolatado',5.00,'🍫',1,170),
(18,'Suco de Laranja','Sucos','Natural',6.00,'🍊',1,180),
(19,'Suco de Acerola','Sucos','Refrescante',6.00,'🥤',1,190),
(20,'Suco de Cupuaçu','Sucos','Regional',7.00,'🥤',1,200),
(21,'Suco de Maracujá','Sucos','Geladinho',6.00,'🥤',1,210),
(22,'Suco de Taperebá','Sucos','Sabor amazônico',7.00,'🥤',1,220),
(23,'Suco de Goiaba','Sucos','Clássico',6.00,'🥤',1,230);
