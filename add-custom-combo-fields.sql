-- Adicionar colunas para Combo Personalizado
-- Execute no SQL Editor do Supabase

-- 1. Adicionar coluna para tamanho customizado
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS custom_size text;

-- 2. Adicionar coluna para ingredientes inclusos
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS included_items text;

-- 3. Verificar se as colunas foram adicionadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'products'
ORDER BY ordinal_position;
