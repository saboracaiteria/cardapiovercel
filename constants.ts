import { Product, ToppingsConfig, Coupon, AdminSettings, Neighborhood } from './types';

export const DEFAULT_SETTINGS: AdminSettings = {
    storeStatus: 'auto',
    deliveryMode: 'both',
    whatsappNumber: '5594991623576',
    address: 'Canaã dos Carajás',
    openDays: [0, 1, 2, 3, 4, 5, 6],
    dailyHours: [
        { open: '15:30', close: '21:45' }, // Sun (0)
        { open: '19:15', close: '22:00' }, // Mon (1)
        { open: '19:15', close: '22:00' }, // Tue (2)
        { open: '19:15', close: '22:00' }, // Wed (3)
        { open: '19:15', close: '22:00' }, // Thu (4)
        { open: '19:15', close: '22:00' }, // Fri (5)
        { open: '15:30', close: '21:45' }  // Sat (6)
    ],
    weekdayDeliveryStartTime: '19:15',
    weekendDeliveryStartTime: '15:30'
};

export const PRODUCTS: Product[] = [
    { id: 1, name: 'Copo 300ml', price: 14.00, disabled: false, type: 'base_acai', description: 'Monte seu açaí com seus acompanhamentos preferidos.' },
    { id: 2, name: 'Copo 400ml', price: 17.00, disabled: false, type: 'base_acai', description: 'Monte seu açaí com seus acompanhamentos preferidos.' },
    { id: 3, name: 'Copo 500ml', price: 20.00, disabled: false, type: 'base_acai', description: 'Monte seu açaí com seus acompanhamentos preferidos.' },
    { id: 5, name: 'Diet Granola', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: granola, leite em pó, leite condensado', sizesKey: 'cupSizes' },
    { id: 6, name: 'Refrescante', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: sorvete, calda de chocolate, leite em pó, leite condensado', sizesKey: 'cupSizes' },
    { id: 7, name: 'Mega Especial', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: leite em pó, leite condensado, banana, creme de avelã (Nutella)', sizesKey: 'cupSizes' },
    { id: 8, name: 'Preferido', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: paçoca, leite em pó, leite condensado, creme de avelã (Nutella)', sizesKey: 'cupSizes' },
    { id: 9, name: 'Maltine +', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: ovomaltine, tapioca, leite em pó, leite condensado', sizesKey: 'cupSizes' },
    { id: 10, name: 'Amendoimix', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: amendoim, leite em pó, leite condensado', sizesKey: 'cupSizes' },
    { id: 11, name: 'Megapower', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: chocopower, leite em pó, leite condensado, creme de avelã (Nutella)', sizesKey: 'cupSizes' },
    { id: 12, name: 'Açaí Banana', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: leite em pó, tapioca, leite condensado, banana', sizesKey: 'cupSizes' },
    { id: 13, name: 'Favorito Nutella', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: flocos, leite condensado, leite em pó, creme de avelã (Nutella)', sizesKey: 'cupSizes' },
    { id: 14, name: 'Sabores do Pará', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: banana, uva, leite em pó, leite condensado, creme de avelã (Nutella)', sizesKey: 'cupSizes' },
    { id: 15, name: 'Kids Especial', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: M&M\'s, uva, creme de avelã (Nutella), leite em pó, leite condensado, banana', sizesKey: 'cupSizes' },
    { id: 16, name: 'Namorados', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: uva, morango, creme de avelã (Nutella), leite em pó, leite condensado', sizesKey: 'cupSizes' },
    { id: 18, name: 'Euforia', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: morango, kiwi, banana, leite em pó, calda de morango', sizesKey: 'cupSizes' },
    { id: 19, name: 'Ninho (A)', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: leite em po, morango, banana, leite condensado', sizesKey: 'cupSizes' },
    { id: 20, name: 'Bombom', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: Sonho de Valsa, leite em pó, calda de chocolate, creme de avelã', sizesKey: 'cupSizes' },
    { id: 21, name: 'Maracujá', price: 0, disabled: false, type: 'combo_selectable_size', description: 'Sugestão: mousse de maracujá, creme de avelã, leite em pó, calda de chocolate', sizesKey: 'cupSizes' },
];

export const CUP_SIZES = [
    { name: '300ml', price: 14.00 },
    { name: '400ml', price: 17.00 },
    { name: '500ml', price: 20.00 }
];

export const TOPPINGS: ToppingsConfig = {
    free: {
        title: '🍒 Acompanhamentos (Frutas, Cremes, Grãos, Doces - Tudo Grátis, escolha até 3)',
        limit: 3,
        price: 0.00,
        items: [
            { name: 'Amendoim' }, { name: 'Aveia' }, { name: 'Banana' }, { name: 'Coco Ralado' }, { name: 'Creme de Avelã' },
            { name: 'Creme de Cupuaçu' }, { name: 'Creme de Leite Ninho' }, { name: 'Flocos' }, { name: 'Granola Tradicional' },
            { name: 'Kiwi' }, { name: 'Leite em Pó' }, { name: 'Manga' }, { name: 'Morango' }, { name: 'Mousse de Maracujá' },
            { name: 'Paçoca' }, { name: 'Sorvete' }, { name: 'Tapioca' }, { name: 'Uva' },
            { name: 'Bis Picado' }, { name: 'Chocopower' }, { name: 'Confetes' }, { name: 'Gotas de Chocolate' },
            { name: 'M&M\'s' }, { name: 'Ovomaltine' }, { name: 'Sonho de Valsa' }
        ]
    },
    caldas: {
        title: '🍯 Caldas (Grátis, escolha até 1)',
        limit: 1,
        price: 0.00,
        items: [
            { name: 'Calda de Açaí' }, { name: 'Calda de Caramelo' }, { name: 'Calda de Chocolate' },
            { name: 'Calda de Kiwi' }, { name: 'Calda de Morango' }, { name: 'Leite Condensado' }
        ]
    }
};

export const COUPONS: Coupon[] = [
    { code: 'TAXAZERO', type: 'free_delivery', value: 0 },
    { code: 'SABOR10', type: 'percentage', value: 0.10 },
    { code: 'SABOR15', type: 'percentage', value: 0.15 },
    { code: 'SABOR25', type: 'percentage', value: 0.25 }
];

export const DEFAULT_NEIGHBORHOODS: Neighborhood[] = [
    { name: 'Jardim Europa', fee: 9.00 },
    { name: 'Amec', fee: 9.00 },
    { name: 'Vale dos Sonhos 1', fee: 9.00 },
    { name: 'Vale dos Sonhos 2', fee: 9.00 },
    { name: 'Vale da Benção', fee: 9.00 },
    { name: 'Jardim do Lago', fee: 12.00 },
    { name: 'Casas Populares', fee: 9.00 },
    { name: 'Nova Esperança 2', fee: 9.00 },
    { name: 'Outro Bairro', fee: 7.00 },
];