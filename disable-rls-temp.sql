-- SOLUÇÃO TEMPORÁRIA: Desabilitar RLS para desenvolvimento
-- Execute este script no SQL Editor do Supabase
-- ATENÇÃO: Isso permite acesso TOTAL ao banco. Use apenas em desenvolvimento!

-- Desabilitar RLS em todas as tabelas
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cup_sizes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.neighborhoods DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Opcional: Verificar o status do RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('products', 'cup_sizes', 'neighborhoods', 'settings', 'orders');
