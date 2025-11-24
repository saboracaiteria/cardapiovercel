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

// Try .env
const envPath = path.join(__dirname, '.env');
console.log('Looking for .env at:', envPath);
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    console.log('.env found, length:', content.length);
    const envConfig = parseEnv(content);
    console.log('Parsed keys from .env:', Object.keys(envConfig));
    env = { ...env, ...envConfig };
} else {
    console.log('.env NOT found');
}

// Try .env.local (overrides .env)
const localEnvPath = path.join(__dirname, '.env.local');
if (fs.existsSync(localEnvPath)) {
    const content = fs.readFileSync(localEnvPath, 'utf-8');
    console.log('.env.local found, length:', content.length);
    const envLocalConfig = parseEnv(content);
    console.log('Parsed keys from .env.local:', Object.keys(envLocalConfig));
    env = { ...env, ...envLocalConfig };
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

console.log('Checking configuration...');
console.log(`URL: ${supabaseUrl ? 'Found' : 'Missing'}`);
console.log(`Key: ${supabaseKey ? (supabaseKey.startsWith('COLE_') ? 'Placeholder (Invalid)' : 'Found') : 'Missing'}`);

if (!supabaseUrl || !supabaseKey || supabaseKey.startsWith('COLE_')) {
    console.error('❌ Cannot test connection: Missing or invalid credentials.');
    process.exit(1);
}

console.log('Initializing Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        // We don't know any tables, so we just check if we can get the session or a simple error that implies connection
        // A query to a non-existent table usually returns a specific error from Supabase, proving we reached it.
        // Or we can try to get auth settings.

        console.log('Attempting to connect...');
        const { data, error } = await supabase.from('non_existent_table_test_123').select('*').limit(1);

        // If we get a 404 or "relation does not exist", it means we CONNECTED but the table is missing.
        // If we get "Invalid API Key", then auth failed.
        // If we get network error, then connection failed.

        if (error) {
            if (error.code === 'PGRST200' || error.message.includes('relation') || error.message.includes('does not exist')) {
                console.log('✅ Connection Successful! (Supabase responded, table check passed)');
            } else if (error.code === '401' || error.message.includes('JWT')) {
                console.log('❌ Connection Failed: Invalid API Key');
            } else {
                console.log('⚠️  Connection made, but received error:', error.message);
                console.log('This usually means the connection works but the query failed (which is expected for a test query).');
            }
        } else {
            console.log('✅ Connection Successful!');
        }
    } catch (err) {
        console.error('❌ Connection Error:', err.message);
    }
}

testConnection();
