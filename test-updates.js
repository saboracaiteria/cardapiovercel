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

console.log('🧪 Testando atualizações no banco de dados...\n');

async function testUpdates() {
    try {
        // Test 1: Testar atualização de produto
        console.log('1️⃣ Teste: Atualizar desativação de produto');
        const { data: products, error: prodErr } = await supabase
            .from('products')
            .select('*')
            .limit(1);

        if (prodErr) {
            console.error('   ❌ Erro ao buscar produtos:', prodErr.message);
        } else if (products && products.length > 0) {
            const testProduct = products[0];
            console.log(`   Produto atual: ${testProduct.name}, disabled: ${testProduct.disabled}`);

            // Tentar atualizar
            const newDisabled = !testProduct.disabled;
            const { data: updated, error: updateErr } = await supabase
                .from('products')
                .update({ disabled: newDisabled })
                .eq('id', testProduct.id)
                .select();

            if (updateErr) {
                console.error('   ❌ Erro ao atualizar:', updateErr.message);
                console.error('   Detalhes:', updateErr);
            } else {
                console.log(`   ✅ Atualizado! Novo valor disabled: ${updated[0].disabled}`);

                // Reverter
                await supabase
                    .from('products')
                    .update({ disabled: testProduct.disabled })
                    .eq('id', testProduct.id);
                console.log('   ↩️  Revertido para estado original');
            }
        }

        // Test 2: Testar atualização de preço
        console.log('\n2️⃣ Teste: Atualizar preço de produto');
        if (products && products.length > 0) {
            const testProduct = products[0];
            console.log(`   Preço atual: R$ ${testProduct.price}`);

            const newPrice = testProduct.price + 1;
            const { data: updated, error: updateErr } = await supabase
                .from('products')
                .update({ price: newPrice })
                .eq('id', testProduct.id)
                .select();

            if (updateErr) {
                console.error('   ❌ Erro ao atualizar:', updateErr.message);
            } else {
                console.log(`   ✅ Atualizado! Novo preço: R$ ${updated[0].price}`);

                // Reverter
                await supabase
                    .from('products')
                    .update({ price: testProduct.price })
                    .eq('id', testProduct.id);
                console.log('   ↩️  Revertido para estado original');
            }
        }

        // Test 3: Testar atualização de cup size
        console.log('\n3️⃣ Teste: Atualizar preço de tamanho de copo');
        const { data: cupSizes, error: cupErr } = await supabase
            .from('cup_sizes')
            .select('*')
            .limit(1);

        if (cupErr) {
            console.error('   ❌ Erro ao buscar tamanhos:', cupErr.message);
        } else if (cupSizes && cupSizes.length > 0) {
            const testSize = cupSizes[0];
            console.log(`   Tamanho ${testSize.name}, preço atual: R$ ${testSize.price}`);

            const newPrice = testSize.price + 1;
            const { data: updated, error: updateErr } = await supabase
                .from('cup_sizes')
                .update({ price: newPrice })
                .eq('name', testSize.name)
                .select();

            if (updateErr) {
                console.error('   ❌ Erro ao atualizar:', updateErr.message);
            } else {
                console.log(`   ✅ Atualizado! Novo preço: R$ ${updated[0].price}`);

                // Reverter
                await supabase
                    .from('cup_sizes')
                    .update({ price: testSize.price })
                    .eq('name', testSize.name);
                console.log('   ↩️  Revertido para estado original');
            }
        }

        console.log('\n✅ TODOS OS TESTES CONCLUÍDOS!');
        console.log('\n💡 Agora abra o navegador em http://localhost:3000/');
        console.log('   Abra o console (F12) e tente editar um produto.');
        console.log('   Você deve ver os logs de debug no console.');

    } catch (error) {
        console.error('❌ Erro geral:', error);
    }
}

testUpdates();
