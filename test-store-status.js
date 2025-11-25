// Script para testar a lógica do StatusBanners localmente
import { getStoreStatus } from './utils/storeTime.js';

const settings = {
    storeStatus: 'auto',
    openDays: [0, 1, 2, 3, 4, 5, 6],
    dailyHours: [
        { open: '15:30', close: '21:45' }, // Dom
        { open: '19:15', close: '22:00' }, // Seg
        { open: '19:15', close: '22:00' }, // Ter
        { open: '19:15', close: '22:00' }, // Qua
        { open: '19:15', close: '22:00' }, // Qui
        { open: '19:15', close: '22:00' }, // Sex
        { open: '15:30', close: '21:45' }  // Sab
    ],
    weekdayDeliveryStartTime: '19:15',
    weekendDeliveryStartTime: '15:30'
};

console.log('========================================');
console.log('TESTE DE LÓGICA - STATUS DA LOJA');
console.log('========================================');
console.log('Horário atual:', new Date().toLocaleString('pt-BR'));
console.log('Dia da semana:', new Date().getDay(), '(0=Dom, 6=Sáb)');
console.log('');

const status = getStoreStatus(settings);

console.log('Resultado:');
console.log('  isOpen:', status.isOpen);
console.log('  isDeliveryAvailable:', status.isDeliveryAvailable);
console.log('');

if (!status.isOpen) {
    console.log('✅ Loja FECHADA - Banner DEVE aparecer!');
    console.log('   Banner vermelho: "Estamos fechados!"');
    console.log('   Cronômetro: "Abre em: HH:MM:SS"');
} else {
    console.log('🟢 Loja ABERTA');
    if (!status.isDeliveryAvailable) {
        console.log('   Banner azul: "Entregas em breve!"');
        console.log('   Cronômetro: "Delivery em: HH:MM:SS"');
    } else {
        console.log('   Cronômetro: "Fecha em: HH:MM:SS"');
    }
}

console.log('========================================');
