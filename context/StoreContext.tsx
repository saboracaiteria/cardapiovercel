
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AdminSettings, CartItem, AppliedCoupon, CustomerInfo, Coupon, Order, Product, Neighborhood, CupSize } from '../types';
import { DEFAULT_SETTINGS, COUPONS, PRODUCTS, DEFAULT_NEIGHBORHOODS, CUP_SIZES } from '../constants';
import { getStoreStatus } from '../utils/storeTime';

interface StoreContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (index: number) => void;
    updateQuantity: (index: number, delta: number) => void;
    clearCart: () => void;
    
    settings: AdminSettings;
    updateSettings: (newSettings: Partial<AdminSettings>) => void;
    isStoreOpen: boolean;
    isDeliveryAvailable: boolean;
    
    products: Product[];
    updateProduct: (id: number, updates: Partial<Product>) => void;
    addProduct: (product: Product) => void;
    removeProduct: (id: number) => void;

    cupSizes: CupSize[];
    updateCupSizes: (sizes: CupSize[]) => void;

    neighborhoods: Neighborhood[];
    updateNeighborhoods: (neighborhoods: Neighborhood[]) => void;
    
    customerInfo: CustomerInfo;
    updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
    
    appliedCoupon: AppliedCoupon | null;
    applyCoupon: (code: string) => { success: boolean; message: string };
    removeCoupon: () => void;
    
    orders: Order[];
    addOrder: (order: Order) => void;
    
    onlineCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- State ---
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('saborAcaiteriaCart');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [settings, setSettingsState] = useState<AdminSettings>(() => {
        const saved = localStorage.getItem('saborAcaiteriaSettings');
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    });

    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('saborAcaiteriaProducts');
        return saved ? JSON.parse(saved) : PRODUCTS;
    });

    const [cupSizes, setCupSizes] = useState<CupSize[]>(() => {
        const saved = localStorage.getItem('saborAcaiteriaCupSizes');
        return saved ? JSON.parse(saved) : CUP_SIZES;
    });

    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(() => {
        const saved = localStorage.getItem('saborAcaiteriaNeighborhoods');
        return saved ? JSON.parse(saved) : DEFAULT_NEIGHBORHOODS;
    });

    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('saborAcaiteriaOrders');
        return saved ? JSON.parse(saved) : [];
    });

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
        const saved = localStorage.getItem('saborAcaiteriaCustomer');
        return saved ? JSON.parse(saved) : { 
            name: '', address: '', neighborhood: '', deliveryOption: 'delivery', paymentMethod: 'Pix', observations: '' 
        };
    });

    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
    const [onlineCount, setOnlineCount] = useState(12);
    
    const [status, setStatus] = useState(getStoreStatus(settings));

    // --- Effects ---
    useEffect(() => { localStorage.setItem('saborAcaiteriaCart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('saborAcaiteriaCustomer', JSON.stringify(customerInfo)); }, [customerInfo]);
    useEffect(() => { localStorage.setItem('saborAcaiteriaSettings', JSON.stringify(settings)); }, [settings]);
    useEffect(() => { localStorage.setItem('saborAcaiteriaProducts', JSON.stringify(products)); }, [products]);
    useEffect(() => { localStorage.setItem('saborAcaiteriaCupSizes', JSON.stringify(cupSizes)); }, [cupSizes]);
    useEffect(() => { localStorage.setItem('saborAcaiteriaNeighborhoods', JSON.stringify(neighborhoods)); }, [neighborhoods]);
    useEffect(() => { localStorage.setItem('saborAcaiteriaOrders', JSON.stringify(orders)); }, [orders]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStatus(getStoreStatus(settings));
        }, 60000);
        // Update immediately on settings change
        setStatus(getStoreStatus(settings));
        return () => clearInterval(interval);
    }, [settings]);

    useEffect(() => {
        // Fake online counter
        const interval = setInterval(() => {
            setOnlineCount(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const next = prev + change;
                return Math.max(4, Math.min(25, next));
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // --- Actions ---
    const addToCart = (item: CartItem) => {
        setCart(prev => {
            const existingIdx = prev.findIndex(i => 
                i.id === item.id && 
                i.selectedSize === item.selectedSize &&
                JSON.stringify(i.toppings.sort()) === JSON.stringify(item.toppings.sort())
            );

            if (existingIdx >= 0) {
                const newCart = [...prev];
                newCart[existingIdx].quantity += item.quantity;
                return newCart;
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
        if (cart.length <= 1) setAppliedCoupon(null);
    };

    const updateQuantity = (index: number, delta: number) => {
        setCart(prev => {
            const newCart = [...prev];
            const item = newCart[index];
            if (item.quantity + delta > 0) {
                item.quantity += delta;
                return newCart;
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    const clearCart = () => {
        setCart([]);
        setAppliedCoupon(null);
    };

    const updateCustomerInfo = (info: Partial<CustomerInfo>) => {
        setCustomerInfo(prev => ({ ...prev, ...info }));
    };

    const updateSettings = (newSettings: Partial<AdminSettings>) => {
        setSettingsState(prev => ({ ...prev, ...newSettings }));
    };

    const updateProduct = (id: number, updates: Partial<Product>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const addProduct = (product: Product) => {
        setProducts(prev => [...prev, product]);
    };

    const removeProduct = (id: number) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const updateCupSizes = (sizes: CupSize[]) => {
        setCupSizes(sizes);
    };

    const updateNeighborhoods = (newNeighborhoods: Neighborhood[]) => {
        setNeighborhoods(newNeighborhoods);
    };

    const addOrder = (order: Order) => {
        setOrders(prev => [order, ...prev]);
    };

    const applyCoupon = (code: string) => {
        const normalizedCode = code.toUpperCase().trim();
        const coupon = COUPONS.find(c => c.code === normalizedCode);
        
        if (!coupon) return { success: false, message: 'Cupom inválido.' };
        
        const historyKey = 'saborAcaiteriaCouponHistory';
        const history = JSON.parse(localStorage.getItem(historyKey) || '{}');
        const today = new Date().toISOString().slice(0, 10);
        
        if (history[normalizedCode] === today) {
             return { success: false, message: 'Este cupom já foi utilizado hoje.' };
        }

        setAppliedCoupon({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            discountAmount: 0 
        });

        history[normalizedCode] = today;
        localStorage.setItem(historyKey, JSON.stringify(history));

        return { success: true, message: 'Cupom aplicado com sucesso!' };
    };

    const removeCoupon = () => setAppliedCoupon(null);

    return (
        <StoreContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            settings, updateSettings, isStoreOpen: status.isOpen, isDeliveryAvailable: status.isDeliveryAvailable,
            products, updateProduct, addProduct, removeProduct,
            cupSizes, updateCupSizes,
            neighborhoods, updateNeighborhoods,
            customerInfo, updateCustomerInfo,
            appliedCoupon, applyCoupon, removeCoupon,
            orders, addOrder,
            onlineCount
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within StoreProvider");
    return context;
};
