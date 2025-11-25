
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AdminSettings, CartItem, AppliedCoupon, CustomerInfo, Coupon, Order, Product, Neighborhood, CupSize } from '../types';
import { DEFAULT_SETTINGS, COUPONS, PRODUCTS, DEFAULT_NEIGHBORHOODS, CUP_SIZES } from '../constants';
import { getStoreStatus } from '../utils/storeTime';
import { supabase } from '../utils/supabase';

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

    refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // --- State ---
    // Cart and CustomerInfo remain local (localStorage)
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('saborAcaiteriaCart');
        return saved ? JSON.parse(saved) : [];
    });

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
        const saved = localStorage.getItem('saborAcaiteriaCustomer');
        return saved ? JSON.parse(saved) : {
            name: '', address: '', neighborhood: '', deliveryOption: 'delivery', paymentMethod: 'Pix', observations: ''
        };
    });

    // Shared Data (Supabase)
    const [settings, setSettingsState] = useState<AdminSettings>(DEFAULT_SETTINGS);
    const [products, setProducts] = useState<Product[]>([]);
    const [cupSizes, setCupSizes] = useState<CupSize[]>([]);
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
    const [onlineCount, setOnlineCount] = useState(12);

    const [status, setStatus] = useState(getStoreStatus(DEFAULT_SETTINGS));

    // --- Fetch Data from Supabase ---
    const fetchData = async () => {
        try {
            // 1. Settings
            const { data: settingsData } = await supabase.from('settings').select('*').single();
            if (settingsData) {
                setSettingsState({
                    storeStatus: settingsData.store_status as any,
                    deliveryMode: settingsData.delivery_mode as any,
                    whatsappNumber: settingsData.whatsapp_number,
                    address: settingsData.address,
                    openDays: settingsData.open_days || [],
                    dailyHours: settingsData.daily_hours || [],
                    weekdayDeliveryStartTime: settingsData.weekday_delivery_start_time,
                    weekendDeliveryStartTime: settingsData.weekend_delivery_start_time,
                    profilePhotoUrl: settingsData.profile_photo_url || 'https://raw.githubusercontent.com/saboracaiteria/SABOR-/main/175.jpg'
                });
            } else {
                // Initialize settings if empty
                await supabase.from('settings').insert([{
                    id: 1,
                    store_status: DEFAULT_SETTINGS.storeStatus,
                    delivery_mode: DEFAULT_SETTINGS.deliveryMode,
                    whatsapp_number: DEFAULT_SETTINGS.whatsappNumber,
                    address: DEFAULT_SETTINGS.address,
                    open_days: DEFAULT_SETTINGS.openDays,
                    daily_hours: DEFAULT_SETTINGS.dailyHours,
                    weekday_delivery_start_time: DEFAULT_SETTINGS.weekdayDeliveryStartTime,
                    weekend_delivery_start_time: DEFAULT_SETTINGS.weekendDeliveryStartTime
                }]);
            }

            // 2. Products
            const { data: productsData } = await supabase.from('products').select('*').order('id');
            if (productsData) {
                setProducts(productsData.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    disabled: p.disabled,
                    type: p.type as any,
                    description: p.description,
                    sizesKey: p.sizes_key,
                    customToppingLimits: p.custom_topping_limits,
                    customSize: p.custom_size,
                    includedItems: p.included_items
                })));
            }

            // 3. Cup Sizes
            const { data: cupSizesData } = await supabase.from('cup_sizes').select('*').order('price');
            if (cupSizesData) {
                setCupSizes(cupSizesData);
            }

            // 4. Neighborhoods
            const { data: neighborhoodsData } = await supabase.from('neighborhoods').select('*').order('name');
            if (neighborhoodsData) {
                setNeighborhoods(neighborhoodsData);
            }

            // 5. Orders
            const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
            if (ordersData) {
                setOrders(ordersData.map(o => ({
                    id: o.id,
                    date: o.created_at,
                    customer: o.customer,
                    items: o.items,
                    subtotal: o.subtotal,
                    discount: o.discount,
                    deliveryFee: o.delivery_fee,
                    total: o.total,
                    status: o.status as any
                })));
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // --- Effects ---
    useEffect(() => {
        fetchData();

        // Realtime subscription for Orders (example)
        const ordersSubscription = supabase
            .channel('public:orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
                // Simple refresh for now, could be optimized
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(ordersSubscription);
        };
    }, []);

    useEffect(() => { localStorage.setItem('saborAcaiteriaCart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('saborAcaiteriaCustomer', JSON.stringify(customerInfo)); }, [customerInfo]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStatus(getStoreStatus(settings));
        }, 60000);
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

    const updateSettings = async (newSettings: Partial<AdminSettings>) => {
        // Optimistic update
        setSettingsState(prev => ({ ...prev, ...newSettings }));

        // Map to DB columns
        const dbUpdates: any = {};
        if (newSettings.storeStatus) dbUpdates.store_status = newSettings.storeStatus;
        if (newSettings.deliveryMode) dbUpdates.delivery_mode = newSettings.deliveryMode;
        if (newSettings.whatsappNumber) dbUpdates.whatsapp_number = newSettings.whatsappNumber;
        if (newSettings.address) dbUpdates.address = newSettings.address;
        if (newSettings.openDays) dbUpdates.open_days = newSettings.openDays;
        if (newSettings.dailyHours) dbUpdates.daily_hours = newSettings.dailyHours;
        if (newSettings.weekdayDeliveryStartTime) dbUpdates.weekday_delivery_start_time = newSettings.weekdayDeliveryStartTime;
        if (newSettings.weekendDeliveryStartTime) dbUpdates.weekend_delivery_start_time = newSettings.weekendDeliveryStartTime;
        if (newSettings.profilePhotoUrl !== undefined) dbUpdates.profile_photo_url = newSettings.profilePhotoUrl;

        await supabase.from('settings').update(dbUpdates).eq('id', 1);
    };

    const updateProduct = async (id: number, updates: Partial<Product>) => {
        // Atualização otimista
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

        try {
            const dbUpdates: any = {};
            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.price !== undefined) dbUpdates.price = updates.price;
            if (updates.disabled !== undefined) dbUpdates.disabled = updates.disabled;
            if (updates.description !== undefined) dbUpdates.description = updates.description;

            console.log('Atualizando produto:', id, dbUpdates);

            const { data, error } = await supabase
                .from('products')
                .update(dbUpdates)
                .eq('id', id)
                .select();

            if (error) {
                console.error('Erro ao atualizar produto:', error);
                // Reverter atualização otimista em caso de erro
                await fetchData();
            } else {
                console.log('Produto atualizado com sucesso:', data);
            }
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            await fetchData();
        }
    };

    const addProduct = async (product: Product) => {
        try {
            console.log('Adicionando produto:', product);

            // Optimistic
            setProducts(prev => [...prev, product]);

            const dbProduct = {
                name: product.name,
                price: product.price,
                disabled: product.disabled,
                type: product.type,
                description: product.description,
                sizes_key: product.sizesKey,
                custom_topping_limits: product.customToppingLimits,
                custom_size: product.customSize,
                included_items: product.includedItems
            };

            const { data, error } = await supabase
                .from('products')
                .insert([dbProduct])
                .select()
                .single();

            if (error) {
                console.error('Erro ao adicionar produto:', error);
                // Reverter otimistic update
                setProducts(prev => prev.filter(p => p.id !== product.id));
            } else if (data) {
                console.log('Produto adicionado com sucesso:', data);
                // Update with real ID from DB
                setProducts(prev => prev.map(p => p.id === product.id ? { ...p, id: data.id } : p));
            }
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            setProducts(prev => prev.filter(p => p.id !== product.id));
        }
    };

    const removeProduct = async (id: number) => {
        try {
            console.log('Removendo produto:', id);

            // Optimistic
            setProducts(prev => prev.filter(p => p.id !== id));

            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Erro ao remover produto:', error);
                // Could refetch to restore
                await fetchData();
            } else {
                console.log('Produto removido com sucesso');
            }
        } catch (error) {
            console.error('Erro ao remover produto:', error);
            await fetchData();
        }
    };

    const updateCupSizes = async (sizes: CupSize[]) => {
        // Atualização otimista
        setCupSizes(sizes);

        try {
            console.log('Atualizando tamanhos de copos:', sizes);

            for (const size of sizes) {
                const { data, error } = await supabase
                    .from('cup_sizes')
                    .update({ price: size.price })
                    .eq('name', size.name)
                    .select();

                if (error) {
                    console.error(`Erro ao atualizar tamanho ${size.name}:`, error);
                } else {
                    console.log(`Tamanho ${size.name} atualizado:`, data);
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar tamanhos:', error);
            await fetchData();
        }
    };

    const updateNeighborhoods = async (newNeighborhoods: Neighborhood[]) => {
        setNeighborhoods(newNeighborhoods);
        // Similar issue: Neighborhood interface has no ID.
        // We will assume 'name' is unique or just handle additions/removals.
        // Simplest: Delete all and insert all (since it's a small list).

        await supabase.from('neighborhoods').delete().neq('id', 0); // Delete all
        await supabase.from('neighborhoods').insert(newNeighborhoods.map(n => ({
            name: n.name,
            fee: n.fee
        })));
    };

    const addOrder = async (order: Order) => {
        setOrders(prev => [order, ...prev]);

        await supabase.from('orders').insert([{
            id: order.id,
            customer: order.customer,
            items: order.items,
            subtotal: order.subtotal,
            discount: order.discount,
            delivery_fee: order.deliveryFee,
            total: order.total,
            status: order.status
        }]);
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
            onlineCount,
            refreshData: fetchData
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
