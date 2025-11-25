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

console.log('🔧 Removendo constraint UNIQUE do nome de produtos...\n');

// Nota: A chave anon não tem permissão para ALTER TABLE
// Você precisa executar este SQL manualmente no Supabase SQL Editor:

const sqlScript = `
-- Remover constraint UNIQUE do nome de produtos
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_name_key;

-- Verificar constraints restantes
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'public.products'::regclass;
`;

console.log('📋 COPIE E EXECUTE ESTE SQL NO SUPABASE SQL EDITOR:\n');
console.log('━'.repeat(60));
console.log(sqlScript);
console.log('━'.repeat(60));
console.log('\n📍 Onde executar:');
console.log('1. Acesse: https://supabase.com/dashboard');
console.log('2. Selecione seu projeto');
console.log('3. Vá em "SQL Editor"');
console.log('4. Cole o SQL acima');
console.log('5. Clique em "Run"');
console.log('\n✅ Depois disso, você poderá adicionar produtos com nomes duplicados!');
