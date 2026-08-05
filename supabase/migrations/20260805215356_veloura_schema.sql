/*
# Veloura Commerce — schema (single-tenant, no auth)

1. New Tables
- `products` — inventory items sold on the platform.
  id, name, category (fashion/electronics/lifestyle), price (numeric), stock (int),
  rating, image_url, accent (color hint), status (active/low/out), created_at.
- `orders` — customer orders.
  id (uuid), order_no (text, human-readable), customer (text), email, channel (web/app/boutique),
  total (numeric), status (pending/processing/shipped/delivered/cancelled), items (int),
  location, created_at.
- `ai_recommendations` — AI-curated picks surfaced to merchants.
  id, title, reason, category, lift (numeric % expected conversion lift),
  confidence (numeric 0-1), image_url, accent, created_at.

2. Security
- RLS enabled on all three tables.
- anon + authenticated full CRUD — data is intentionally shared (no sign-in screen).
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('fashion','electronics','lifestyle')),
  price numeric(10,2) NOT NULL DEFAULT 0,
  stock int NOT NULL DEFAULT 0,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  image_url text,
  accent text DEFAULT 'emerald',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','low','out')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no text NOT NULL UNIQUE,
  customer text NOT NULL,
  email text,
  channel text NOT NULL DEFAULT 'web' CHECK (channel IN ('web','app','boutique')),
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
  items int NOT NULL DEFAULT 1,
  location text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  reason text,
  category text NOT NULL,
  lift numeric(5,2) NOT NULL DEFAULT 0,
  confidence numeric(3,2) NOT NULL DEFAULT 0.5,
  image_url text,
  accent text DEFAULT 'emerald',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_ai" ON ai_recommendations;
CREATE POLICY "anon_select_ai" ON ai_recommendations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_ai" ON ai_recommendations;
CREATE POLICY "anon_insert_ai" ON ai_recommendations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_ai" ON ai_recommendations;
CREATE POLICY "anon_delete_ai" ON ai_recommendations FOR DELETE TO anon, authenticated USING (true);
