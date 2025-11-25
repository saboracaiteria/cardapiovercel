-- Políticas de Segurança para o Bucket profile-photos
-- Execute este SQL no Supabase Dashboard → SQL Editor

-- 1. Permitir leitura pública de todas as fotos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

-- 2. Permitir upload de fotos (qualquer pessoa pode fazer upload)
CREATE POLICY "Allow Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-photos');

-- 3. Permitir atualização de fotos
CREATE POLICY "Allow Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-photos');

-- 4. Permitir deletar fotos
CREATE POLICY "Allow Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-photos');
