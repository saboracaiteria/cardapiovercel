import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/storeTime';
import { Order } from '../../types';
import Button from '../ui/Button';
import { X, Trash2, Plus, Minus, Bike, Store, CheckCircle } from 'lucide-react';

interface CartModalProps {
    onClose: () => void;
    onOrderSent: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose, onOrderSent }) => {
    const { 
        cart, removeFromCart, updateQuantity, clearCart,
        settings, isStoreOpen, customerInfo, updateCustomerInfo,
        appliedCoupon, applyCoupon, removeCoupon, addOrder, neighborhoods
    } = useStore();

    const [couponInput, setCouponInput] = useState('');
    const [couponMsg, setCouponMsg] = useState({ text: '', isError: false });

    // --- Calculations ---
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let discount = 0;
    if (appliedCoupon?.type === 'percentage') {
        discount = subtotal * appliedCoupon.value;
    }

    const subtotalAfterDiscount = subtotal - discount;

    let deliveryFee = 0;
    if (customerInfo.deliveryOption === 'delivery') {
        const hood = neighborhoods.find(n => n.name === customerInfo.neighborhood);
        if (hood) {
            deliveryFee = hood.fee;
            if (appliedCoupon?.type === 'free_delivery') {
                deliveryFee = 0;
            }
        }
    }

    const total = subtotalAfterDiscount + deliveryFee;

    // --- Handlers ---
    const handleApplyCoupon = () => {
        const result = applyCoupon(couponInput);
        setCouponMsg({ text: result.message, isError: !result.success });
        if (result.success) setCouponInput('');
    };

    const handleCheckout = () => {
        if (!customerInfo.name) return alert('Por favor, informe seu nome.');
        if (customerInfo.deliveryOption === 'delivery' && (!customerInfo.address || !customerInfo.neighborhood)) {
            return alert('Para entrega, endereço e bairro são obrigatórios.');
        }

        // 1. Save Order to Internal "Database" (Context/LocalStorage)
        const newOrder: Order = {
            id: '#' + Math.floor(100000 + Math.random() * 900000).toString(),
            date: new Date().toISOString(),
            customer: customerInfo,
            items: [...cart],
            subtotal,
            discount,
            deliveryFee,
            total,
            status: 'pending'
        };
        addOrder(newOrder);

        // 2. Construct WhatsApp Message
        let msg = `*NOVO PEDIDO - SABOR AÇAÍTERIA*\n`;
        msg += `*Pedido:* ${newOrder.id}\n\n`;
        msg += `*Cliente:* ${customerInfo.name}\n`;
        msg += `*Tipo:* ${customerInfo.deliveryOption === 'delivery' ? 'ENTREGA 🛵' : 'RETIRADA 🏪'}\n`;
        if (customerInfo.deliveryOption === 'delivery') {
            msg += `*Endereço:* ${customerInfo.address}\n*Bairro:* ${customerInfo.neighborhood}\n`;
        }
        
        if (appliedCoupon) {
            msg += `\n*CUPOM APLICADO:* ${appliedCoupon.code} (${appliedCoupon.type === 'percentage' ? 'Desconto %' : 'Entrega Grátis'})\n`;
        }

        msg += `\n*ITENS:*\n`;
        cart.forEach(item => {
            msg += `------------------------\n`;
            msg += `*${item.quantity}x ${item.name}*`;
            if (item.selectedSize) msg += ` (${item.selectedSize})`;
            msg += `\n`;
            if (item.toppings.length > 0) {
                item.toppings.forEach(t => msg += `  + ${t.name}\n`);
            }
            if (item.description) msg += `  (${item.description.replace('Sugestão: ', '')})\n`;
            msg += `  Sub: ${formatCurrency(item.price * item.quantity)}\n`;
        });

        msg += `------------------------\n`;
        msg += `*Resumo:*\n`;
        msg += `Itens: ${formatCurrency(subtotal)}\n`;
        if (discount > 0) msg += `Desconto: -${formatCurrency(discount)}\n`;
        msg += `Taxa Entrega: ${deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}\n`;
        msg += `*TOTAL FINAL: ${formatCurrency(total)}*\n\n`;
        msg += `*Pagamento:* ${customerInfo.paymentMethod}\n`;
        if (customerInfo.observations) msg += `*Obs:* ${customerInfo.observations}`;

        const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
        
        onOrderSent();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-3xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl">
                
                {/* Header */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-100">Seu Pedido</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-2"><X size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Items List */}
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">Seu carrinho está vazio.</p>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start border-b border-gray-800 pb-4 last:border-0">
                                    <div>
                                        <p className="font-bold text-gray-100">{item.quantity}x {item.name} {item.selectedSize && `(${item.selectedSize})`}</p>
                                        <div className="text-xs text-gray-400 mt-1 pl-2 border-l-2 border-gray-700">
                                            {item.toppings.map((t, i) => (
                                                <span key={i} className="block">• {t.name}</span>
                                            ))}
                                            {item.description && <span className="block italic mt-1">{item.description.replace('Sugestão: ', '')}</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="font-bold text-gray-200">{formatCurrency(item.price * item.quantity)}</span>
                                        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                                            <button onClick={() => updateQuantity(idx, -1)} className="p-1 hover:bg-gray-700 rounded"><Minus size={14} /></button>
                                            <span className="text-xs w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(idx, 1)} className="p-1 hover:bg-gray-700 rounded"><Plus size={14} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1 mt-1">
                                            <Trash2 size={12} /> Remover
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {cart.length > 0 && (
                        <>
                            {/* Coupon Section */}
                            <div className="pt-4 border-t border-gray-700">
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
                                        <div className="flex items-center gap-2 text-green-400">
                                            <CheckCircle size={18} />
                                            <span className="font-bold text-sm">CUPOM APLICADO: {appliedCoupon.code}</span>
                                        </div>
                                        <button onClick={removeCoupon} className="text-red-400 hover:text-red-300"><X size={18} /></button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                placeholder="CÓDIGO DO CUPOM"
                                                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500 outline-none"
                                            />
                                            <button onClick={handleApplyCoupon} className="bg-pink-600 text-white font-bold px-4 rounded-lg hover:bg-pink-700">Aplicar</button>
                                        </div>
                                        {couponMsg.text && (
                                            <p className={`text-xs ${couponMsg.isError ? 'text-red-400' : 'text-green-400'}`}>{couponMsg.text}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Info Form */}
                            <div className="pt-4 border-t border-gray-700 space-y-4">
                                <h4 className="font-bold text-white">Dados da Entrega</h4>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${customerInfo.deliveryOption === 'delivery' ? 'border-pink-500 bg-pink-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                                        <input 
                                            type="radio" name="delivery" className="hidden" 
                                            checked={customerInfo.deliveryOption === 'delivery'}
                                            onChange={() => updateCustomerInfo({ deliveryOption: 'delivery' })}
                                        />
                                        <Bike size={24} className={customerInfo.deliveryOption === 'delivery' ? 'text-pink-500' : 'text-gray-400'} />
                                        <span className="font-bold text-sm">Entrega</span>
                                    </label>
                                    <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${customerInfo.deliveryOption === 'takeout' ? 'border-pink-500 bg-pink-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                                        <input 
                                            type="radio" name="delivery" className="hidden" 
                                            checked={customerInfo.deliveryOption === 'takeout'}
                                            onChange={() => updateCustomerInfo({ deliveryOption: 'takeout' })}
                                        />
                                        <Store size={24} className={customerInfo.deliveryOption === 'takeout' ? 'text-pink-500' : 'text-gray-400'} />
                                        <span className="font-bold text-sm">Retirada</span>
                                    </label>
                                </div>

                                <input 
                                    type="text" placeholder="Seu Nome Completo"
                                    value={customerInfo.name}
                                    onChange={(e) => updateCustomerInfo({ name: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500"
                                />

                                {customerInfo.deliveryOption === 'delivery' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <select 
                                            value={customerInfo.neighborhood}
                                            onChange={(e) => updateCustomerInfo({ neighborhood: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500"
                                        >
                                            <option value="">Selecione o Bairro</option>
                                            {neighborhoods.map(n => (
                                                <option key={n.name} value={n.name}>{n.name} (+{formatCurrency(n.fee)})</option>
                                            ))}
                                        </select>
                                        <input 
                                            type="text" placeholder="Endereço (Rua, Número, Comp.)"
                                            value={customerInfo.address}
                                            onChange={(e) => updateCustomerInfo({ address: e.target.value })}
                                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500"
                                        />
                                    </div>
                                )}

                                <select 
                                    value={customerInfo.paymentMethod}
                                    onChange={(e) => updateCustomerInfo({ paymentMethod: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500"
                                >
                                    <option value="Pix">Pix</option>
                                    <option value="Dinheiro">Dinheiro</option>
                                    <option value="Cartão (Entrega)">Cartão (Na Entrega)</option>
                                </select>

                                <textarea 
                                    placeholder="Observações (Troco, tirar cebola, etc)"
                                    value={customerInfo.observations}
                                    onChange={(e) => updateCustomerInfo({ observations: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500 h-24 resize-none"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Totals */}
                <div className="p-4 bg-black/50 border-t border-gray-800 space-y-2">
                    <div className="flex justify-between text-gray-400 text-sm">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-400 text-sm">
                            <span>Desconto</span>
                            <span>- {formatCurrency(discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-400 text-sm">
                        <span>Entrega</span>
                        <span>{deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                        <span className="font-bold text-white text-lg">Total</span>
                        <span className="font-bold text-white text-2xl">{formatCurrency(total)}</span>
                    </div>
                    <Button 
                        fullWidth 
                        onClick={handleCheckout} 
                        disabled={!isStoreOpen || cart.length === 0}
                    >
                        {isStoreOpen ? 'Finalizar no WhatsApp' : 'Loja Fechada'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;