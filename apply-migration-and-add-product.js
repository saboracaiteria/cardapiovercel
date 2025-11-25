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

console.log('🔧 Aplicando migração e adicionando produto Custom Combo...\n');

async function applyMigrationAndAddProduct() {
    try {
        // Step 1: Aplicar migração SQL
        console.log('1️⃣ Aplicando migração SQL...');
        const sqlPath = path.join(__dirname, 'add-custom-combo-fields.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        // Executar cada comando SQL separadamente
        const commands = sql.split(';').filter(cmd => cmd.trim());
        for (const cmd of commands) {
            if (cmd.trim()) {
                const { error } = await supabase.rpc('exec_sql', { sql_query: cmd });
                if (error && !error.message.includes('already exists')) {
                    console.log('   ⚠️ SQL:', error.message);
                }
            }
        }
        console.log('   ✅ Migração aplicada (ou já existia)');

        // Step 2: Adicionar produto custom_combo
        console.log('\n2️⃣ Adicionando Combo Casal...');
        const customCombo = {
            name: 'Combo Casal 💑',
            price: 35.00,
            disabled: false,
            type: 'custom_combo',
            description: 'Combo especial para compartilhar com quem você ama',
            custom_size: '1L',
            included_items: 'Morango, Banana, M&M\'s, Granola, Leite em Pó, Leite Condensado, Creme de Avelã'
        };

        const { data, error } = await supabase
            .from('products')
            .insert([customCombo])
            .select()
            .single();

        if (error) {
            console.log('   ⚠️ Erro:', error.message);
        } else {
            console.log('   ✅ Produto adicionado com sucesso!');
            console.log('   📦 ID:', data.id);
            console.log('   🎨 Nome:', data.name);
            console.log('   💰 Preço: R$', data.price);
            console.log('   📏 Tamanho:', data.custom_size);
            console.log('   🎁 Itens:', data.included_items);
        }

        console.log('\n🎉 CONCLUÍDO! Recarregue a página para ver o produto.');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

applyMigrationAndAddProduct();
