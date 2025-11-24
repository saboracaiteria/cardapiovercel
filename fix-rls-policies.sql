-- Script para corrigir as políticas RLS do Supabase
-- Execute este script no SQL Editor do Painel do Supabase

-- 1. Remover todas as políticas existentes (para evitar conflitos)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.products;
DROP POLICY IF EXISTS "Enable update for all users" ON public.products;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.products;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.cup_sizes;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.cup_sizes;
DROP POLICY IF EXISTS "Enable update for all users" ON public.cup_sizes;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.cup_sizes;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.neighborhoods;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.neighborhoods;
DROP POLICY IF EXISTS "Enable update for all users" ON public.neighborhoods;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.neighborhoods;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.settings;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.settings;
DROP POLICY IF EXISTS "Enable update for all users" ON public.settings;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable update for all users" ON public.orders;

-- 2. Criar políticas permitindo acesso público total
-- Products
CREATE POLICY "Enable read access for all users" ON public.products 
  FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.products 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.products 
  FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON public.products 
  FOR DELETE USING (true);

-- Cup Sizes
CREATE POLICY "Enable read access for all users" ON public.cup_sizes 
  FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.cup_sizes 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.cup_sizes 
  FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON public.cup_sizes 
  FOR DELETE USING (true);

-- Neighborhoods
CREATE POLICY "Enable read access for all users" ON public.neighborhoods 
  FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.neighborhoods 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.neighborhoods 
  FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON public.neighborhoods 
  FOR DELETE USING (true);

-- Settings
CREATE POLICY "Enable read access for all users" ON public.settings 
  FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.settings 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.settings 
  FOR UPDATE USING (true) WITH CHECK (true);

-- Orders
CREATE POLICY "Enable read access for all users" ON public.orders 
  FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.orders 
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.orders 
  FOR UPDATE USING (true) WITH CHECK (true);

-- 3. Garantir que RLS está habilitado
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cup_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
