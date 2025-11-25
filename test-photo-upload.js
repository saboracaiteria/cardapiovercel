import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse env
function parseEnv(content) {
    const env = {};
    content.split('\n').forEach(line => {
        const cleanedLine = line.trim();
        if (!cleanedLine || cleanedLine.startsWith('#')) return;
        const match = cleanedLine.match(/^([^=]+)=(.*)$/);
        if (match) {
            env[match[1].trim()] = match[2].trim();
        }
    });
    return env;
}

let env = {};
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    env = { ...env, ...parseEnv(content) };
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Testando funcionalidade de upload de foto de perfil...\n');

async function testPhotoUpload() {
    try {
        // 1. Verificar se o bucket existe
        console.log('1️⃣ Verificando bucket "profile-photos"...');
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

        if (bucketsError) {
            console.log('   ❌ Erro ao listar buckets:', bucketsError.message);
            return;
        }

        const profileBucket = buckets.find(b => b.name === 'profile-photos');

        if (!profileBucket) {
            console.log('   ❌ Bucket "profile-photos" NÃO EXISTE!');
            console.log('\n📋 SOLUÇÃO: Crie o bucket no Supabase Dashboard:');
            console.log('   1. Acesse: https://supabase.com/dashboard/project/oydhuyfnvsblaabvzymr/storage/buckets');
            console.log('   2. Clique em "New bucket"');
            console.log('   3. Nome: profile-photos');
            console.log('   4. Marque "Public bucket" ✓');
            console.log('   5. Clique em "Create bucket"\n');
            return;
        }

        console.log('   ✅ Bucket encontrado!');
        console.log('   📦 Nome:', profileBucket.name);
        console.log('   🔓 Público:', profileBucket.public ? 'Sim' : 'Não');

        // 2. Verificar se conseguimos listar arquivos (testa permissões)
        console.log('\n2️⃣ Testando permissões de leitura...');
        const { data: files, error: listError } = await supabase.storage
            .from('profile-photos')
            .list();

        if (listError) {
            console.log('   ⚠️ Erro ao listar arquivos:', listError.message);
        } else {
            console.log('   ✅ Permissões OK!');
            console.log('   📁 Arquivos no bucket:', files.length);
        }

        // 3. Testar upload de uma imagem fake (muito pequena)
        console.log('\n3️⃣ Testando upload...');
        const testFileName = `test-${Date.now()}.txt`;
        const testContent = 'Test upload';

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile-photos')
            .upload(testFileName, testContent, {
                contentType: 'text/plain',
                upsert: false
            });

        if (uploadError) {
            console.log('   ❌ Erro ao fazer upload:', uploadError.message);
            console.log('\n📋 Possível causa: Permissões de escrita não configuradas.');
        } else {
            console.log('   ✅ Upload bem-sucedido!');
            console.log('   📤 Arquivo:', uploadData.path);

            // 4. Testar obtenção de URL pública
            console.log('\n4️⃣ Testando URL pública...');
            const { data: urlData } = supabase.storage
                .from('profile-photos')
                .getPublicUrl(testFileName);

            if (urlData?.publicUrl) {
                console.log('   ✅ URL pública gerada!');
                console.log('   🔗 URL:', urlData.publicUrl);

                // 5. Limpar arquivo de teste
                console.log('\n5️⃣ Limpando arquivo de teste...');
                await supabase.storage
                    .from('profile-photos')
                    .remove([testFileName]);
                console.log('   ✅ Arquivo removido!');
            }
        }

        // 6. Verificar coluna profile_photo_url na tabela settings
        console.log('\n6️⃣ Verificando coluna profile_photo_url...');
        const { data: settingsData, error: settingsError } = await supabase
            .from('settings')
            .select('profile_photo_url')
            .single();

        if (settingsError) {
            console.log('   ⚠️ Erro:', settingsError.message);
            console.log('   💡 Execute: add-profile-photo-url.sql no Supabase');
        } else {
            console.log('   ✅ Coluna existe!');
            console.log('   🖼️ URL atual:', settingsData.profile_photo_url || 'Nenhuma');
        }

        console.log('\n🎉 TESTE CONCLUÍDO!');
        console.log('\n📊 RESUMO:');
        console.log('   Bucket criado:', profileBucket ? '✅' : '❌');
        console.log('   Upload funcionando:', uploadError ? '❌' : '✅');
        console.log('   Coluna no banco:', settingsError ? '❌' : '✅');

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

testPhotoUpload();
