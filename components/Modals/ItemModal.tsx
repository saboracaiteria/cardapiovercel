import React, { useState, useEffect } from 'react';
import { Product, ToppingsConfig, CartItem } from '../../types';
import { formatCurrency } from '../../utils/storeTime';
import { TOPPINGS } from '../../constants';
import Button from '../ui/Button';
import { X, Minus, Plus } from 'lucide-react';

interface ItemModalProps {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (item: CartItem) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedToppings, setSelectedToppings] = useState<{name: string, price: number}[]>([]);

    useEffect(() => {
        if (product) {
            setQuantity(1);
            setSelectedToppings([]);
        }
    }, [product]);

    if (!product) return null;

    const handleToppingToggle = (categoryKey: string, name: string, price: number) => {
        const categoryConfig = TOPPINGS[categoryKey];
        // Handle logic for checking existing toppings in this category
        const currentCategoryToppings = selectedToppings.filter(t => 
            categoryConfig.items.some(i => i.name === t.name)
        );
        
        const isSelected = selectedToppings.some(t => t.name === name);

        if (isSelected) {
            setSelectedToppings(prev => prev.filter(t => t.name !== name));
        } else {
            // Check limits
            const limit = product.customToppingLimits?.[categoryKey] ?? categoryConfig.limit;
            if (limit !== 999 && currentCategoryToppings.length >= limit) {
                return; // Limit reached
            }
            setSelectedToppings(prev => [...prev, { name, price }]);
        }
    };

    const toppingsTotal = selectedToppings.reduce((acc, t) => acc + t.price, 0);
    const unitPrice = product.price + toppingsTotal;
    const totalPrice = unitPrice * quantity;

    const handleAddToCart = () => {
        onAddToCart({
            id: product.id,
            name: product.name,
            basePrice: product.price,
            price: unitPrice,
            quantity,
            type: product.type,
            toppings: selectedToppings
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900 rounded-t-2xl">
                    <h3 className="text-xl font-bold text-gray-100">Monte seu {product.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Quantity */}
                    <div className="flex flex-col items-center pb-6 border-b border-gray-800">
                        <span className="text-sm text-gray-400 mb-2">Quantidade</span>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-colors"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="text-3xl font-bold text-white w-12 text-center">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Toppings Categories */}
                    {Object.entries(TOPPINGS).map(([key, config]) => {
                        const limit = product.customToppingLimits?.[key] ?? config.limit;
                        const currentCount = selectedToppings.filter(t => config.items.some(i => i.name === t.name)).length;
                        const isMaxed = limit !== 999 && currentCount >= limit;

                        let title = config.title;
                        let sub = `(Escolha até ${limit})`;
                        if (key === 'free') { title = '🍒 Acompanhamentos'; sub = `(Grátis, escolha até ${limit})`; }
                        if (key === 'caldas') { title = '🍯 Caldas'; sub = `(Grátis, escolha até ${limit})`; }

                        return (
                            <div key={key}>
                                <div className="mb-3">
                                    <h4 className="text-lg font-bold text-gray-200">{title}</h4>
                                    <p className="text-xs text-gray-500">{sub} • <span className={isMaxed ? 'text-red-400' : 'text-green-400'}>{currentCount}/{limit === 999 ? '∞' : limit}</span></p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {config.items.map(item => {
                                        const isSelected = selectedToppings.some(t => t.name === item.name);
                                        const isDisabled = !isSelected && isMaxed;
                                        
                                        return (
                                            <label 
                                                key={item.name}
                                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                                    isSelected 
                                                    ? 'bg-pink-900/20 border-pink-500/50' 
                                                    : isDisabled 
                                                        ? 'opacity-40 cursor-not-allowed border-transparent bg-gray-800/50' 
                                                        : 'bg-gray-800 border-transparent hover:bg-gray-750'
                                                }`}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden"
                                                    checked={isSelected}
                                                    disabled={isDisabled}
                                                    onChange={() => handleToppingToggle(key, item.name, config.price)}
                                                />
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-pink-500 border-pink-500' : 'border-gray-500'}`}>
                                                    {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-gray-300'}`}>{item.name}</span>
                                                    {config.price > 0 && (
                                                        <span className="text-[10px] text-yellow-400">+ {formatCurrency(config.price)}</span>
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 bg-black/50 border-t border-gray-800 flex items-center justify-between rounded-b-2xl">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Total</span>
                        <span className="text-2xl font-bold text-white">{formatCurrency(totalPrice)}</span>
                    </div>
                    <Button onClick={handleAddToCart}>
                        Adicionar ao Carrinho
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ItemModal;