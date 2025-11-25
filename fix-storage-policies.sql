-- Verificar e corrigir políticas do bucket profile-photos
-- Execute este SQL no Supabase Dashboard → SQL Editor

-- 1. REMOVER políticas antigas (se existirem)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow Update" ON storage.objects;
DROP POLICY IF EXISTS "Allow Delete" ON storage.objects;

-- 2. CRIAR políticas corretas

-- Permitir leitura pública
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-photos');

-- Permitir INSERT (upload) para todos
CREATE POLICY "Allow Upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'profile-photos');

-- Permitir UPDATE para todos
CREATE POLICY "Allow Update" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'profile-photos')
  WITH CHECK (bucket_id = 'profile-photos');

-- Permitir DELETE para todos
CREATE POLICY "Allow Delete" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'profile-photos');
