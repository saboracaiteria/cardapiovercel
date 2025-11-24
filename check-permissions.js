import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

console.log('🔍 Verificando permissões de atualização...\n');

async function checkPermissions() {
    try {
        // Teste 1: SELECT (deve funcionar)
        console.log('1️⃣ Testando SELECT em products...');
        const { data: selectData, error: selectError } = await supabase
            .from('products')
            .select('*')
            .limit(1);

        if (selectError) {
            console.error('   ❌ SELECT falhou:', selectError.message);
            console.error('   Código:', selectError.code);
        } else {
            console.log('   ✅ SELECT funcionando');
        }

        // Teste 2: UPDATE (pode estar bloqueado por RLS)
        if (selectData && selectData.length > 0) {
            console.log('\n2️⃣ Testando UPDATE em products...');
            const testProduct = selectData[0];

            const { data: updateData, error: updateError } = await supabase
                .from('products')
                .update({ description: 'Teste de atualização' })
                .eq('id', testProduct.id)
                .select();

            if (updateError) {
                console.error('   ❌ UPDATE falhou:', updateError.message);
                console.error('   Código:', updateError.code);
                console.error('   Detalhes completos:', JSON.stringify(updateError, null, 2));

                if (updateError.code === 'PGRST301' || updateError.message.includes('policy')) {
                    console.log('\n   🔒 DIAGNÓSTICO: Políticas RLS estão bloqueando atualizações!');
                    console.log('   📋 SOLUÇÃO: Execute o arquivo fix-rls-now.sql no Supabase SQL Editor');
                }
            } else {
                console.log('   ✅ UPDATE funcionando');
                console.log('   Dado atualizado:', updateData);

                // Reverter
                await supabase
                    .from('products')
                    .update({ description: testProduct.description })
                    .eq('id', testProduct.id);
                console.log('   ↩️  Revertido');
            }
        }

        // Teste 3: Verificar cup_sizes
        console.log('\n3️⃣ Testando UPDATE em cup_sizes...');
        const { data: cupData, error: cupSelectError } = await supabase
            .from('cup_sizes')
            .select('*')
            .limit(1);

        if (cupSelectError) {
            console.error('   ❌ SELECT falhou:', cupSelectError.message);
        } else if (cupData && cupData.length > 0) {
            const { error: cupUpdateError } = await supabase
                .from('cup_sizes')
                .update({ price: cupData[0].price })
                .eq('name', cupData[0].name);

            if (cupUpdateError) {
                console.error('   ❌ UPDATE falhou:', cupUpdateError.message);
                console.error('   Código:', cupUpdateError.code);
            } else {
                console.log('   ✅ UPDATE funcionando');
            }
        }

    } catch (error) {
        console.error('❌ Erro geral:', error);
    }
}

checkPermissions();
