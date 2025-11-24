import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper to parse env file
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

// Load env vars
let env = {};
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    env = { ...env, ...parseEnv(content) };
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testando conexão com Supabase...\n');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Credenciais não encontradas no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
    try {
        console.log('1️⃣ Testando tabela PRODUCTS...');
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*')
            .limit(5);

        if (productsError) {
            console.log('   ❌ Erro:', productsError.message);
        } else {
            console.log(`   ✅ ${products.length} produtos encontrados`);
            if (products.length > 0) {
                console.log('   Exemplo:', products[0].name);
            }
        }

        console.log('\n2️⃣ Testando tabela CUP_SIZES...');
        const { data: cupSizes, error: cupError } = await supabase
            .from('cup_sizes')
            .select('*');

        if (cupError) {
            console.log('   ❌ Erro:', cupError.message);
        } else {
            console.log(`   ✅ ${cupSizes.length} tamanhos encontrados`);
        }

        console.log('\n3️⃣ Testando tabela NEIGHBORHOODS...');
        const { data: hoods, error: hoodsError } = await supabase
            .from('neighborhoods')
            .select('*')
            .limit(3);

        if (hoodsError) {
            console.log('   ❌ Erro:', hoodsError.message);
        } else {
            console.log(`   ✅ ${hoods.length} bairros encontrados`);
        }

        console.log('\n4️⃣ Testando tabela SETTINGS...');
        const { data: settings, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (settingsError) {
            console.log('   ❌ Erro:', settingsError.message);
        } else {
            console.log('   ✅ Configurações encontradas');
        }

        console.log('\n📊 RESUMO:');
        const errors = [productsError, cupError, hoodsError, settingsError].filter(e => e);
        if (errors.length === 0) {
            console.log('✅ TODOS OS DADOS ESTÃO ACESSÍVEIS!');
            console.log('🎉 A aplicação deve estar funcionando corretamente!');
        } else {
            console.log(`⚠️  ${errors.length} tabela(s) com erro de acesso`);
            console.log('💡 Você precisa executar o script fix-rls-policies.sql no Supabase');
        }

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
    }
}

testDatabase();
