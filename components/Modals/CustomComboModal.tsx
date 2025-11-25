
import React, { useState } from 'react';
import { Product, CartItem } from '../../types';
import { formatCurrency } from '../../utils/storeTime';
import Button from '../ui/Button';
import { X, Minus, Plus, Package } from 'lucide-react';

interface CustomComboModalProps {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (item: CartItem) => void;
}

const CustomComboModal: React.FC<CustomComboModalProps> = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const handleAddToCart = () => {
        onAddToCart({
            id: product.id,
            name: product.name,
            basePrice: product.price,
            price: product.price,
            quantity,
            type: 'custom_combo',
            description: product.description,
            toppings: [],
            customSize: product.customSize,
            includedItems: product.includedItems
        });
        onClose();
    };

    // Parse included items if they exist
    const includedItemsList = product.includedItems
        ? product.includedItems.split(',').map(item => item.trim())
        : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-2xl flex flex-col shadow-2xl">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-100">{product.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Product Info */}
                    <div className="bg-gray-800 p-4 rounded-xl space-y-3">
                        {product.customSize && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">Tamanho:</span>
                                <span className="text-base font-bold text-pink-400">{product.customSize}</span>
                            </div>
                        )}

                        {product.description && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Descrição:</p>
                                <p className="text-sm text-gray-300">{product.description}</p>
                            </div>
                        )}

                        {includedItemsList.length > 0 && (
                            <div>
                                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                    <Package size={14} />
                                    Itens Inclusos:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {includedItemsList.map((item, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs bg-gray-900 text-gray-300 px-2 py-1 rounded-full border border-gray-700"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price Display */}
                    <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 p-4 rounded-xl border border-pink-800/30">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Preço Fixo</span>
                            <span className="text-2xl font-bold text-white">{formatCurrency(product.price)}</span>
                        </div>
                    </div>

                    {/* Quantity Selector */}
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
                        onClick={handleAddToCart}
                    >
                        Adicionar - {formatCurrency(product.price * quantity)}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomComboModal;
