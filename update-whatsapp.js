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

console.log('📱 Atualizando número do WhatsApp...\n');

async function updateWhatsApp() {
    try {
        const { data, error } = await supabase
            .from('settings')
            .update({ whatsapp_number: '5594991623576' })
            .eq('id', 1)
            .select();

        if (error) {
            console.error('❌ Erro ao atualizar:', error.message);
        } else {
            console.log('✅ Número do WhatsApp atualizado com sucesso!');
            console.log('📱 Novo número: 5594991623576');
            console.log('🔗 Link do WhatsApp: https://wa.me/5594991623576');
        }
    } catch (err) {
        console.error('❌ Erro:', err.message);
    }
}

updateWhatsApp();
