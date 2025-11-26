import { AdminSettings } from '../types';

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const getStoreStatus = (settings: AdminSettings) => {
    const now = new Date();
    const currentDay = now.getDay();
    const todayHours = settings.dailyHours?.[currentDay];

    if (settings.storeStatus === 'open') return { isOpen: true, isDeliveryAvailable: true };
    if (settings.storeStatus === 'closed') return { isOpen: false, isDeliveryAvailable: false };

    // Check if today is an open day
    if (!settings.openDays?.includes(currentDay)) {
        return { isOpen: false, isDeliveryAvailable: false };
    }

    if (!todayHours || !todayHours.open || !todayHours.close) {
        return { isOpen: false, isDeliveryAvailable: false };
    }

    const [openH, openM] = todayHours.open.split(':').map(Number);
    const [closeH, closeM] = todayHours.close.split(':').map(Number);

    const openTime = openH * 60 + openM;
    const closeTime = closeH * 60 + closeM;
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const isOpen = currentTime >= openTime && currentTime <= closeTime;

    // Delivery logic
    const deliveryStartStr = (currentDay === 0 || currentDay === 6)
        ? settings.weekendDeliveryStartTime
        : settings.weekdayDeliveryStartTime;

    // Check if delivery time is set before trying to split
    if (!deliveryStartStr) {
        return { isOpen, isDeliveryAvailable: false };
    }

    const [delH, delM] = deliveryStartStr.split(':').map(Number);
    const deliveryStartTime = delH * 60 + delM;

    const isDeliveryAvailable = isOpen && currentTime >= deliveryStartTime;

    return { isOpen, isDeliveryAvailable };
};

export const getNextOpeningDate = (settings: AdminSettings): Date | null => {
    const now = new Date();

    // Check later today
    const todayHours = settings.dailyHours?.[now.getDay()];
    if (todayHours?.open) {
        const [openH, openM] = todayHours.open.split(':').map(Number);
        const openingToday = new Date(now);
        openingToday.setHours(openH, openM, 0, 0);
        if (now < openingToday) return openingToday;
    }

    // Check next days
    for (let i = 1; i <= 7; i++) {
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + i);
        const dayOfWeek = nextDate.getDay();

        if (settings.openDays?.includes(dayOfWeek)) {
            const dayHours = settings.dailyHours?.[dayOfWeek];
            if (dayHours?.open) {
                const [h, m] = dayHours.open.split(':').map(Number);
                nextDate.setHours(h, m, 0, 0);
                return nextDate;
            }
        }
    }
    return null;
};

export const formatTimeRemaining = (ms: number): string => {
    if (ms <= 0) return '00:00:00';
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};