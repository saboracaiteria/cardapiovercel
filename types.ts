

export interface Product {
    id: number;
    name: string;
    price: number;
    disabled: boolean;
    type: 'base_acai' | 'combo_selectable_size' | 'custom_combo';
    description?: string;
    sizesKey?: string;
    customToppingLimits?: Record<string, number>;
    customSize?: string; // Para custom_combo: tamanho livre (ex: "400ml", "Grande")
    includedItems?: string; // Para custom_combo: ingredientes inclusos
}

export interface ToppingItem {
    name: string;
    disabled?: boolean;
}

export interface ToppingCategory {
    title: string;
    limit: number;
    price: number;
    items: ToppingItem[];
}

export interface ToppingsConfig {
    free: ToppingCategory;
    caldas: ToppingCategory;
    [key: string]: ToppingCategory;
}

export interface CartItem {
    id: number;
    name: string;
    price: number;
    basePrice: number;
    quantity: number;
    type: 'base_acai' | 'combo_selectable_size' | 'custom_combo';
    selectedSize?: string;
    description?: string;
    toppings: { name: string; price: number }[];
    customSize?: string; // Para custom_combo
    includedItems?: string; // Para custom_combo
}

export interface Coupon {
    code: string;
    type: 'percentage' | 'free_delivery';
    value: number;
}

export interface AppliedCoupon {
    code: string;
    type: 'percentage' | 'free_delivery';
    value: number;
    discountAmount: number;
    isDeliveryFree?: boolean;
}

export interface DailyHours {
    open: string;
    close: string;
}

export interface Neighborhood {
    name: string;
    fee: number;
}

export interface CupSize {
    name: string;
    price: number;
}

export interface AdminSettings {
    storeStatus: 'auto' | 'open' | 'closed';
    deliveryMode: 'both' | 'delivery' | 'takeout';
    whatsappNumber: string;
    address: string;
    openDays: number[];
    dailyHours: DailyHours[];
    weekdayDeliveryStartTime: string;
    weekendDeliveryStartTime: string;
    profilePhotoUrl?: string;
}

export interface CustomerInfo {
    name: string;
    address: string;
    neighborhood: string;
    deliveryOption: 'delivery' | 'takeout';
    paymentMethod: string;
    observations: string;
}

export interface Order {
    id: string;
    date: string; // ISO String
    customer: CustomerInfo;
    items: CartItem[];
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
}
