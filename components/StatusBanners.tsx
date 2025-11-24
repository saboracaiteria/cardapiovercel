import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getNextOpeningDate, formatTimeRemaining } from '../utils/storeTime';
import { Clock, Bike } from 'lucide-react';

const StatusBanners: React.FC = () => {
    const { isStoreOpen, isDeliveryAvailable, settings } = useStore();
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [targetDate, setTargetDate] = useState<Date | null>(null);
    const [bannerType, setBannerType] = useState<'closing' | 'opening' | 'delivery' | null>(null);

    useEffect(() => {
        const now = new Date();
        const currentDay = now.getDay();
        const todayHours = settings.dailyHours[currentDay];

        let target: Date | null = null;
        let type: 'closing' | 'opening' | 'delivery' | null = null;

        if (isStoreOpen) {
            // Check closing time
            const [closeH, closeM] = todayHours.close.split(':').map(Number);
            const closeTime = new Date(now);
            closeTime.setHours(closeH, closeM, 0, 0);
            
            // Check delivery start
            const deliveryStartStr = (currentDay === 0 || currentDay === 6) 
                ? settings.weekendDeliveryStartTime 
                : settings.weekdayDeliveryStartTime;
            const [delH, delM] = deliveryStartStr.split(':').map(Number);
            const deliveryTime = new Date(now);
            deliveryTime.setHours(delH, delM, 0, 0);

            if (!isDeliveryAvailable && deliveryTime > now) {
                target = deliveryTime;
                type = 'delivery';
            } else {
                target = closeTime;
                type = 'closing';
            }
        } else {
            // Store closed, check opening
            target = getNextOpeningDate(settings);
            type = 'opening';
        }

        setTargetDate(target);
        setBannerType(type);
    }, [isStoreOpen, isDeliveryAvailable, settings]);

    useEffect(() => {
        if (!targetDate) return;
        const interval = setInterval(() => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();
            setTimeLeft(diff);
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (!bannerType || timeLeft <= 0) return null;

    const formattedTime = formatTimeRemaining(timeLeft);

    return (
        <>
            {/* Sticky Timer Top Left */}
            <div className={`fixed top-4 left-4 z-40 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-full px-4 py-1.5 shadow-xl flex items-center gap-2 text-xs font-medium ${
                bannerType === 'closing' ? 'text-red-400' : 
                bannerType === 'opening' ? 'text-green-400' : 'text-blue-400'
            }`}>
                {bannerType === 'delivery' ? <Bike size={14} /> : <Clock size={14} />}
                <span className="text-gray-200">
                    {bannerType === 'closing' && 'Fecha em: '}
                    {bannerType === 'opening' && 'Abre em: '}
                    {bannerType === 'delivery' && 'Delivery em: '}
                    <span className="font-bold tracking-wider">{formattedTime}</span>
                </span>
            </div>

            {/* Main Content Banners */}
            <div className="container mx-auto max-w-3xl px-4 mb-6 space-y-4">
                {!isStoreOpen && (
                    <div className="bg-red-900/40 border border-red-800 text-red-200 p-4 rounded-xl text-center">
                        <p className="font-bold">Estamos fechados!</p>
                        <p className="text-sm opacity-80">O cardápio está disponível para visualização.</p>
                    </div>
                )}
                
                {isStoreOpen && !isDeliveryAvailable && (
                    <div className="bg-blue-900/40 border border-blue-800 text-blue-200 p-4 rounded-xl text-center">
                        <p className="font-bold">Entregas em breve!</p>
                        <p className="text-sm opacity-80">Pedidos para retirada já estão disponíveis.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default StatusBanners;