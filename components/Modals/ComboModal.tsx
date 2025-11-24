
import React, { useState } from 'react';
import { Product, CartItem } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/storeTime';
import Button from '../ui/Button';
import { X, Minus, Plus } from 'lucide-react';

interface ComboModalProps {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (item: CartItem) => void;
}

const ComboModal: React.FC<ComboModalProps> = ({ product, onClose, onAddToCart }) => {
    const { cupSizes } = useStore();
    const [quantity, setQuantity] = useState(1);
    const [selectedSizeName, setSelectedSizeName] = useState<string>('');
    const [selectedPrice, setSelectedPrice] = useState<number>(0);

    if (!product) return null;

    const sizes = cupSizes; 

    const handleSelectSize = (name: string, price: number) => {
        setSelectedSizeName(name);
        setSelectedPrice(price);
    };

    const handleAddToCart = () => {
        if (!selectedSizeName) return;
        onAddToCart({
            id: product.id,
            name: product.name,
            basePrice: selectedPrice,
            price: selectedPrice,
            quantity,
            type: 'combo_selectable_size',
            selectedSize: selectedSizeName,
            description: product.description,
            toppings: [] // Combos don't have custom toppings in this flow
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-2xl flex flex-col shadow-2xl">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-100">Escolha o Tamanho</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-gray-800 p-4 rounded-xl">
                        <p className="text-sm text-gray-300 font-medium mb-1">Combo: <span className="text-pink-400">{product.name}</span></p>
                        <p className="text-xs text-gray-500 italic">{product.description?.replace('Sugestão: ', '')}</p>
                    </div>

                    <div className="space-y-3">
                        {sizes.map((size) => (
                            <div 
                                key={size.name}
                                onClick={() => handleSelectSize(size.name, size.price)}
                                className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                                    selectedSizeName === size.name 
                                    ? 'border-pink-500 bg-pink-900/10' 
                                    : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                                }`}
                            >
                                <span className={`font-bold ${selectedSizeName === size.name ? 'text-white' : 'text-gray-300'}`}>{size.name}</span>
                                <span className="text-gray-400">{formatCurrency(size.price)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center pt-4">
                        <span className="text-sm text-gray-400 mb-2">Quantidade</span>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="text-2xl font-bold text-white w-8 text-center">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-800">
                    <Button 
                        fullWidth 
                        disabled={!selectedSizeName} 
                        onClick={handleAddToCart}
                    >
                        Adicionar {selectedSizeName ? ` - ${formatCurrency(selectedPrice * quantity)}` : ''}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ComboModal;
