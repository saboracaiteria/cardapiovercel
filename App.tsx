import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import StatusBanners from './components/StatusBanners';
import CartModal from './components/Modals/CartModal';
import AdminPanel from './components/Admin/AdminPanel';
import { ShoppingBag } from 'lucide-react';

const OnlineCounter = () => {
    const { onlineCount } = useStore();
    return (
        <div className="fixed top-2 right-4 z-40 bg-gray-900/80 border border-gray-700 rounded-full px-3 py-1 flex items-center gap-2 shadow-lg">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-gray-300 font-medium">{onlineCount} online</span>
        </div>
    );
};

const CartButton = ({ onClick }: { onClick: () => void }) => {
    const { cart } = useStore();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (count === 0) return null;

    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full shadow-xl flex items-center justify-center text-white transform hover:scale-105 transition-all active:scale-95"
        >
            <ShoppingBag size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 border-2 border-gray-900 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {count}
            </span>
        </button>
    );
};

const WhatsAppFloat = () => {
    const { settings } = useStore();
    return (
        <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-green-500 rounded-full shadow-xl flex items-center justify-center text-white transform hover:scale-105 transition-all"
        >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
        </a>
    );
}

const AppContent: React.FC = () => {
    const { clearCart } = useStore();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    return (
        <div className="min-h-screen pb-12">
            <OnlineCounter />
            <StatusBanners />

            <div className="container mx-auto max-w-3xl px-4 py-4">
                <Header />
                <ProductList />

                <footer className="text-center mt-12 py-8 border-t border-gray-800 text-gray-600 text-sm">
                    <p className="mb-2">Sabor Açaíteria • Canaã dos Carajás</p>
                    <button
                        onClick={() => setIsAdminOpen(true)}
                        className="hover:text-gray-400 transition-colors text-xs underline decoration-gray-700"
                    >
                        Painel Administrativo
                    </button>
                </footer>
            </div>

            <CartButton onClick={() => setIsCartOpen(true)} />
            <WhatsAppFloat />

            {isCartOpen && (
                <CartModal
                    onClose={() => setIsCartOpen(false)}
                    onOrderSent={() => {
                        clearCart();
                        setIsCartOpen(false);
                        // No alert here, the CartModal handles the flow to whatsapp
                    }}
                />
            )}

            {isAdminOpen && (
                <AdminPanel onClose={() => setIsAdminOpen(false)} />
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <StoreProvider>
            <AppContent />
        </StoreProvider>
    );
};

export default App;