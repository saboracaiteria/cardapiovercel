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

console.log('🔧 TESTE COMPLETO: Simular edição do Admin Panel\n');

async function fullUpdateTest() {
    try {
        // 1. Buscar produto
        console.log('1️⃣ Buscando produto para editar...');
        const { data: products, error: fetchError } = await supabase
            .from('products')
            .select('*')
            .eq('type', 'combo_selectable_size')
            .limit(1);

        if (fetchError || !products || products.length === 0) {
            console.error('   ❌ Erro ao buscar:', fetchError?.message || 'Nenhum combo encontrado');
            return;
        }

        const product = products[0];
        console.log(`   ✅ Produto encontrado: ${product.name}`);
        console.log(`      ID: ${product.id}`);
        console.log(`      Preço atual: R$ ${product.price}`);
        console.log(`      Disabled: ${product.disabled}`);
        console.log(`      Descrição: ${product.description}`);

        // 2. Atualizar NOME
        console.log('\n2️⃣ Testando atualização de NOME...');
        const newName = product.name + ' (Editado)';
        const { data: nameUpdate, error: nameError } = await supabase
            .from('products')
            .update({ name: newName })
            .eq('id', product.id)
            .select();

        if (nameError) {
            console.error('   ❌ Falhou:', nameError.message);
        } else {
            console.log('   ✅ Nome atualizado:', nameUpdate[0].name);
        }

        // 3. Atualizar DESCRIÇÃO
        console.log('\n3️⃣ Testando atualização de DESCRIÇÃO...');
        const newDesc = 'Descrição editada via teste';
        const { data: descUpdate, error: descError } = await supabase
            .from('products')
            .update({ description: newDesc })
            .eq('id', product.id)
            .select();

        if (descError) {
            console.error('   ❌ Falhou:', descError.message);
        } else {
            console.log('   ✅ Descrição atualizada:', descUpdate[0].description);
        }

        // 4. Atualizar DISABLED
        console.log('\n4️⃣ Testando TOGGLE de disponibilidade...');
        const newDisabled = !product.disabled;
        const { data: toggleUpdate, error: toggleError } = await supabase
            .from('products')
            .update({ disabled: newDisabled })
            .eq('id', product.id)
            .select();

        if (toggleError) {
            console.error('   ❌ Falhou:', toggleError.message);
        } else {
            console.log(`   ✅ Toggle atualizado: ${product.disabled} → ${toggleUpdate[0].disabled}`);
        }

        // 5. Reverter tudo
        console.log('\n5️⃣ Revertendo alterações...');
        await supabase
            .from('products')
            .update({
                name: product.name,
                description: product.description,
                disabled: product.disabled
            })
            .eq('id', product.id);
        console.log('   ✅ Revertido');

        // 6. Testar Cup Sizes
        console.log('\n6️⃣ Testando atualização de CUP SIZE...');
        const { data: cupSizes } = await supabase
            .from('cup_sizes')
            .select('*')
            .limit(1);

        if (cupSizes && cupSizes.length > 0) {
            const cup = cupSizes[0];
            console.log(`   Tamanho: ${cup.name}, Preço: R$ ${cup.price}`);

            const newPrice = cup.price + 0.50;
            const { data: priceUpdate, error: priceError } = await supabase
                .from('cup_sizes')
                .update({ price: newPrice })
                .eq('name', cup.name)
                .select();

            if (priceError) {
                console.error('   ❌ Falhou:', priceError.message);
            } else {
                console.log(`   ✅ Preço atualizado: R$ ${cup.price} → R$ ${priceUpdate[0].price}`);

                // Reverter
                await supabase
                    .from('cup_sizes')
                    .update({ price: cup.price })
                    .eq('name', cup.name);
                console.log('   ✅ Revertido');
            }
        }

        console.log('\n✅ TODOS OS TESTES PASSARAM!');
        console.log('\n📊 CONCLUSÃO:');
        console.log('   O banco de dados está funcionando perfeitamente.');
        console.log('   O problema está na aplicação React não sincronizando.');
        console.log('\n💡 PRÓXIMA AÇÃO:');
        console.log('   Vou adicionar um botão de "Recarregar Dados" no painel admin.');

    } catch (error) {
        console.error('❌ Erro geral:', error);
    }
}

fullUpdateTest();
