import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getNextOpeningDate, formatTimeRemaining } from '../utils/storeTime';
import { Clock, Bike } from 'lucide-react';

const StatusBanners: React.FC = () => {
    const { isStoreOpen, isDeliveryAvailable, settings } = useStore();
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const currentDay = now.getDay();
            const todayHours = settings.dailyHours?.[currentDay];

            if (!todayHours) return;

            let targetTime: Date;

            if (isStoreOpen) {
                // Store is open - count down to closing
                if (!todayHours.close) return;
                const [closeH, closeM] = todayHours.close.split(':').map(Number);
                targetTime = new Date(now);
                targetTime.setHours(closeH, closeM, 0, 0);
            } else {
                // Store is closed - count down to opening
                const nextOpening = getNextOpeningDate(settings);
                if (!nextOpening) return;
                targetTime = nextOpening;
            }

            const diff = targetTime.getTime() - now.getTime();
            setTimeLeft(diff);
        };

        // Update immediately and then every second
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [isStoreOpen, isDeliveryAvailable, settings]);

    const formattedTime = formatTimeRemaining(Math.max(0, timeLeft));

    return (
        <>
            {/* Sticky Timer Top Left */}
            <div className={`fixed top-20 left-4 z-40 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-full px-4 py-1.5 shadow-xl flex items-center gap-2 text-xs font-medium ${isStoreOpen ? 'text-red-400' : 'text-green-400'
                }`}>
                <Clock size={14} />
                <span className="text-gray-200">
                    {isStoreOpen ? 'Fecha em: ' : 'Abre em: '}
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