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

console.log('🌱 Populando banco de dados com dados iniciais...\n');

async function seedDatabase() {
    try {
        // 1. Inserir Cup Sizes
        console.log('1️⃣ Inserindo tamanhos de copos...');
        const cupSizes = [
            { name: '300ml', price: 14.00 },
            { name: '400ml', price: 17.00 },
            { name: '500ml', price: 20.00 }
        ];

        const { error: cupError } = await supabase
            .from('cup_sizes')
            .insert(cupSizes);

        if (cupError) console.log('   ⚠️ ', cupError.message);
        else console.log('   ✅ 3 tamanhos inseridos');

        // 2. Inserir Neighborhoods
        console.log('\n2️⃣ Inserindo bairros...');
        const neighborhoods = [
            { name: 'Jardim Europa', fee: 9.00 },
            { name: 'Amec', fee: 9.00 },
            { name: 'Vale dos Sonhos 1', fee: 9.00 },
            { name: 'Vale dos Sonhos 2', fee: 9.00 },
            { name: 'Vale da Benção', fee: 9.00 },
            { name: 'Jardim do Lago', fee: 12.00 },
            { name: 'Casas Populares', fee: 9.00 },
            { name: 'Nova Esperança 2', fee: 9.00 },
            { name: 'Outro Bairro', fee: 7.00 }
        ];

        const { error: hoodError } = await supabase
            .from('neighborhoods')
            .insert(neighborhoods);

        if (hoodError) console.log('   ⚠️ ', hoodError.message);
        else console.log(`   ✅ ${neighborhoods.length} bairros inseridos`);

        // 3. Inserir Products
        console.log('\n3️⃣ Inserindo produtos...');
        const products = [
            { id: 1, name: 'Copo 300ml', price: 14.00, disabled: false, type: 'base_acai', description: 'Monte seu açaí com seus acompanhamentos preferidos.' },
            { id: 2, name: 'Copo 400ml', price: 17.00, disabled: false, type: 'base_acai', description: 'Monte seu açaí com seus acompanhamentos preferidos.' },
            { id: 3, name: 'Copo 500ml', price: 20.00, disabled: false, type: 'base_acai', description: 'Monte seu açaí com seus acompanhamentos preferidos.' },
            { id: 5, name: 'Diet Granola', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: granola, leite em pó, leite condensado', sizes_key: 'cupSizes' },
            { id: 6, name: 'Refrescante', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: sorvete, calda de chocolate, leite em pó, leite condensado', sizes_key: 'cupSizes' },
            { id: 7, name: 'Mega Especial', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: leite em pó, leite condensado, banana, creme de avelã (Nutella)', sizes_key: 'cupSizes' },
            { id: 8, name: 'Preferido', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: paçoca, leite em pó, leite condensado, creme de avelã (Nutella)', sizes_key: 'cupSizes' },
            { id: 9, name: 'Maltine +', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: ovomaltine, tapioca, leite em pó, leite condensado', sizes_key: 'cupSizes' },
            { id: 10, name: 'Amendoimix', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: amendoim, leite em pó, leite condensado', sizes_key: 'cupSizes' },
            { id: 11, name: 'Megapower', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: chocopower, leite em pó, leite condensado, creme de avelã (Nutella)', sizes_key: 'cupSizes' },
            { id: 12, name: 'Açaí Banana', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: leite em pó, tapioca, leite condensado, banana', sizes_key: 'cupSizes' },
            { id: 13, name: 'Favorito Nutella', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: flocos, leite condensado, leite em pó, creme de avelã (Nutella)', sizes_key: 'cupSizes' },
            { id: 14, name: 'Sabores do Pará', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: banana, uva, leite em pó, leite condensado, creme de avelã (Nutella)', sizes_key: 'cupSizes' },
            { id: 15, name: 'Kids Especial', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: M&M\'s, uva, creme de avelã (Nutella), leite em pó, leite condensado, banana', sizes_key: 'cupSizes' },
            { id: 16, name: 'Namorados', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: uva, morango, creme de avelã (Nutella), leite em pó, leite condensado', sizes_key: 'cupSizes' },
            { id: 18, name: 'Euforia', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: morango, kiwi, banana, leite em pó, calda de morango', sizes_key: 'cupSizes' },
            { id: 19, name: 'Ninho (A)', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: leite em po, morango, banana, leite condensado', sizes_key: 'cupSizes' },
            { id: 20, name: 'Bombom', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: Sonho de Valsa, leite em pó, calda de chocolate, creme de avelã', sizes_key: 'cupSizes' },
            { id: 21, name: 'Maracujá', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: mousse de maracujá, creme de avelã, leite em pó, calda de chocolate', sizes_key: 'cupSizes' }
        ];

        const { error: prodError } = await supabase
            .from('products')
            .insert(products);

        if (prodError) console.log('   ⚠️ ', prodError.message);
        else console.log(`   ✅ ${products.length} produtos inseridos`);

        // 4. Verificar/Atualizar Settings
        console.log('\n4️⃣ Verificando configurações...');
        const { data: existingSettings } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (!existingSettings) {
            const defaultSettings = {
                id: 1,
                store_status: 'auto',
                delivery_mode: 'both',
                whatsapp_number: '5594991623576',
                address: 'Canaã dos Carajás',
                open_days: [0, 1, 2, 3, 4, 5, 6],
                daily_hours: [
                    { open: '15:30', close: '21:45' },
                    { open: '19:15', close: '22:00' },
                    { open: '19:15', close: '22:00' },
                    { open: '19:15', close: '22:00' },
                    { open: '19:15', close: '22:00' },
                    { open: '19:15', close: '22:00' },
                    { open: '15:30', close: '21:45' }
                ],
                weekday_delivery_start_time: '19:15',
                weekend_delivery_start_time: '15:30'
            };

            const { error: settError } = await supabase
                .from('settings')
                .insert([defaultSettings]);

            if (settError) console.log('   ⚠️ ', settError.message);
            else console.log('   ✅ Configurações padrão inseridas');
        } else {
            console.log('   ✅ Configurações já existem');
        }

        console.log('\n🎉 BANCO DE DADOS POPULADO COM SUCESSO!');
        console.log('✨ Recarregue http://localhost:3000/ para ver os produtos!');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

seedDatabase();
