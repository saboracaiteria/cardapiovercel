import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { formatCurrency } from '../utils/storeTime';
import ItemModal from './Modals/ItemModal';
import ComboModal from './Modals/ComboModal';
import CustomComboModal from './Modals/CustomComboModal';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

const ProductList: React.FC = () => {
    const { addToCart, products, cupSizes } = useStore();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalType, setModalType] = useState<'item' | 'combo' | 'custom_combo' | null>(null);

    const handleProductClick = (product: Product) => {
        if (product.disabled) return;
        setSelectedProduct(product);
        if (product.type === 'base_acai') {
            setModalType('item');
        } else if (product.type === 'custom_combo') {
            setModalType('custom_combo');
        } else {
            setModalType('combo');
        }
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedProduct(null);
    };

    const handleAddToCart = (item: CartItem) => {
        addToCart(item);
    };

    // Helper to highlight specific ids (simulating "most ordered")
    const highlights = [2, 5, 8, 10, 12, 19];

    return (
        <section className="mb-20">
            <div className="text-center mb-8">
                <p className="text-gray-400 text-lg mb-2">👇 Clique em <span className="font-bold text-white">"Montar"</span> para começar 👇</p>
                <h2 className="text-2xl font-bold text-white tracking-wide">MONTE SEU AÇAÍ</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {products.map(product => {
                    const isHighlight = highlights.includes(product.id);
                    const isCup = product.name.toLowerCase().includes('copo');

                    // Determine styling based on type
                    const borderClass = (isCup || isHighlight)
                        ? 'border-pink-500 shadow-lg shadow-pink-500/10'
                        : 'border-gray-800 hover:border-gray-600';

                    return (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className={`group relative bg-gray-900 rounded-xl border-2 p-4 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-1 ${borderClass}`}
                        >
                            {isHighlight && (
                                <div className="absolute -top-3 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg transform rotate-6 z-10">
                                    MAIS PEDIDO!
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="font-bold text-gray-100 text-base leading-tight mb-1">{product.name}</h3>
                                {product.description && (
                                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                                        {product.description.replace('Sugestão: ', '')}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    {product.type === 'combo_selectable_size' && <p className="text-[10px] text-gray-400">A partir de</p>}
                                    <span className="font-bold text-white">
                                        {formatCurrency(product.price > 0 ? product.price : (cupSizes[0]?.price || 14.00))}
                                    </span>
                                </div>
                                <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-1.5 rounded-lg text-white transform group-hover:scale-110 transition-transform">
                                    <ArrowRight size={16} />
                                </div>
                            </div>

                            {product.disabled && (
                                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-20 cursor-not-allowed">
                                    <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs font-bold border border-gray-600">Esgotado</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {modalType === 'item' && (
                <ItemModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    onAddToCart={handleAddToCart}
                />
            )}
            {modalType === 'combo' && (
                <ComboModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    onAddToCart={handleAddToCart}
                />
            )}
            {modalType === 'custom_combo' && (
                <CustomComboModal
                    product={selectedProduct}
                    onClose={handleCloseModal}
                    onAddToCart={handleAddToCart}
                />
            )}
        </section>
    );
};

export default ProductList;