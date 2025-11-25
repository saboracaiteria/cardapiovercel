-- Script para remover constraint UNIQUE do nome de produtos
-- Execute no SQL Editor do Supabase

-- Verificar constraints existentes
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.products'::regclass;

-- Remover constraint UNIQUE do nome (se existir)
-- Substitua 'products_name_key' pelo nome real da constraint se for diferente
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_name_key;

-- Verificar novamente
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'public.products'::regclass;
