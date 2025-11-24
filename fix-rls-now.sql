-- Script para verificar e corrigir políticas RLS
-- Execute no SQL Editor do Supabase

-- 1. Verificar políticas atuais
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename IN ('products', 'cup_sizes', 'neighborhoods', 'settings', 'orders');

-- 2. DESABILITAR RLS TEMPORARIAMENTE para debug
-- ATENÇÃO: Isso permite acesso total. Use apenas para desenvolvimento!
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cup_sizes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- 3. Verificar se RLS está desabilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('products', 'cup_sizes', 'neighborhoods', 'settings', 'orders');
