
import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/storeTime';
import { Order } from '../../types';
import { X, LayoutDashboard, Coffee, Settings, History, TrendingUp, DollarSign, Calendar, CreditCard, Lock, Bike, Trash2, Plus, Edit2, Save, CheckCircle, Clock } from 'lucide-react';
import Button from '../ui/Button';

interface AdminPanelProps {
    onClose: () => void;
}

type Tab = 'dashboard' | 'products' | 'settings' | 'orders';

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
    const { 
        orders, settings, updateSettings, 
        products, updateProduct, addProduct, removeProduct,
        cupSizes, updateCupSizes,
        isStoreOpen, isDeliveryAvailable, neighborhoods, updateNeighborhoods 
    } = useStore();
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [dateFilter, setDateFilter] = useState<'day' | 'week' | 'month'>('day');
    const [showSaveToast, setShowSaveToast] = useState(false);

    // State for new neighborhood
    const [newHoodName, setNewHoodName] = useState('');
    const [newHoodFee, setNewHoodFee] = useState('');

    // State for new product
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProdType, setNewProdType] = useState<'base_acai' | 'combo_selectable_size'>('combo_selectable_size');
    const [newProdName, setNewProdName] = useState('');
    const [newProdDesc, setNewProdDesc] = useState('');
    const [newProdPrice, setNewProdPrice] = useState('');

    // --- Auth ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '124578') {
            setIsAuthenticated(true);
        } else {
            alert('Senha incorreta');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 w-full max-w-sm text-center">
                    <div className="flex justify-center mb-4 text-pink-500">
                        <Lock size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Área Restrita</h2>
                    <p className="text-gray-400 mb-6">Digite a senha de administrador</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-center text-lg tracking-widest outline-none focus:border-pink-500"
                            placeholder="••••••••"
                        />
                        <div className="flex gap-2">
                            <Button type="button" variant="secondary" onClick={onClose} fullWidth>Cancelar</Button>
                            <Button type="submit" fullWidth>Entrar</Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // --- Handlers ---
    const handleManualSave = () => {
        setShowSaveToast(true);
        setTimeout(() => setShowSaveToast(false), 3000);
    };

    const handleUpdateNeighborhood = (index: number, field: 'name' | 'fee', value: string) => {
        const updated = [...neighborhoods];
        if (field === 'name') {
            updated[index].name = value;
        } else {
            updated[index].fee = parseFloat(value) || 0;
        }
        updateNeighborhoods(updated);
    };

    const handleDeleteNeighborhood = (index: number) => {
        if (window.confirm('Tem certeza que deseja remover este bairro?')) {
            const updated = neighborhoods.filter((_, i) => i !== index);
            updateNeighborhoods(updated);
        }
    };

    const handleAddNeighborhood = () => {
        if (!newHoodName || !newHoodFee) return;
        const fee = parseFloat(newHoodFee);
        if (isNaN(fee)) return;

        updateNeighborhoods([...neighborhoods, { name: newHoodName, fee }]);
        setNewHoodName('');
        setNewHoodFee('');
    };

    const handleUpdateCupSize = (index: number, newPrice: string) => {
        const price = parseFloat(newPrice);
        if (isNaN(price)) return;
        const updated = [...cupSizes];
        updated[index].price = price;
        updateCupSizes(updated);
    };

    const handleAddNewProduct = () => {
        if (!newProdName) return;
        const price = parseFloat(newProdPrice) || 0;
        
        const newProduct = {
            id: Date.now(),
            name: newProdName,
            type: newProdType,
            price: newProdType === 'base_acai' ? price : 0,
            description: newProdDesc,
            disabled: false,
            sizesKey: newProdType === 'combo_selectable_size' ? 'cupSizes' : undefined
        };

        addProduct(newProduct as any);
        setIsAddingProduct(false);
        setNewProdName('');
        setNewProdDesc('');
        setNewProdPrice('');
        handleManualSave();
    };

    const handleDeleteProduct = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            removeProduct(id);
        }
    };

    // Schedule Handlers
    const handleDayToggle = (dayIndex: number) => {
        let newOpenDays = [...settings.openDays];
        if (newOpenDays.includes(dayIndex)) {
            newOpenDays = newOpenDays.filter(d => d !== dayIndex);
        } else {
            newOpenDays.push(dayIndex);
        }
        updateSettings({ openDays: newOpenDays });
    };

    const handleTimeChange = (dayIndex: number, field: 'open' | 'close', value: string) => {
        const newDailyHours = [...settings.dailyHours];
        // Ensure the object exists
        if (!newDailyHours[dayIndex]) {
            newDailyHours[dayIndex] = { open: '00:00', close: '00:00' };
        }
        newDailyHours[dayIndex] = { ...newDailyHours[dayIndex], [field]: value };
        updateSettings({ dailyHours: newDailyHours });
    };

    // --- Dashboard Logic ---
    const getFilteredOrders = () => {
        const now = new Date();
        return orders.filter(order => {
            const orderDate = new Date(order.date);
            if (dateFilter === 'day') {
                return orderDate.getDate() === now.getDate() && 
                       orderDate.getMonth() === now.getMonth() && 
                       orderDate.getFullYear() === now.getFullYear();
            }
            if (dateFilter === 'week') {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return orderDate >= oneWeekAgo;
            }
            if (dateFilter === 'month') {
                return orderDate.getMonth() === now.getMonth() && 
                       orderDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    };

    const filteredOrders = getFilteredOrders();
    const totalRevenue = filteredOrders.reduce((acc, o) => acc + o.total, 0);
    const totalDeliveryFees = filteredOrders.reduce((acc, o) => acc + o.deliveryFee, 0);
    const totalOrders = filteredOrders.length;
    
    const paymentMethods = filteredOrders.reduce((acc: Record<string, number>, order) => {
        const method = order.customer.paymentMethod || 'Outro';
        acc[method] = (acc[method] || 0) + order.total;
        return acc;
    }, {} as Record<string, number>);

    const baseProducts = products.filter(p => p.type === 'base_acai');
    const comboProducts = products.filter(p => p.type === 'combo_selectable_size');

    return (
        <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col">
            {/* Top Bar */}
            <div className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded">ADMIN</span>
                    <h2 className="text-white font-bold text-lg">Painel de Controle</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            {/* Success Toast */}
            <div className={`fixed top-4 right-4 z-[60] bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 transition-all duration-500 transform ${showSaveToast ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
                <CheckCircle size={20} />
                <span className="font-bold">Alterações salvas com sucesso!</span>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
                    <nav className="p-4 space-y-2">
                        <SidebarItem icon={<LayoutDashboard size={20} />} label="Visão Geral" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                        <SidebarItem icon={<History size={20} />} label="Histórico de Vendas" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                        <SidebarItem icon={<Coffee size={20} />} label="Cardápio / Produtos" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                        <SidebarItem icon={<Settings size={20} />} label="Configurações" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </nav>
                    <div className="mt-auto p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
                        v1.1.0 • Sabor Açaíteria
                    </div>
                </aside>

                {/* Mobile Tabs */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around p-2 z-10">
                    <MobileTab icon={<LayoutDashboard size={20} />} label="Painel" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <MobileTab icon={<History size={20} />} label="Vendas" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                    <MobileTab icon={<Coffee size={20} />} label="Menu" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                    <MobileTab icon={<Settings size={20} />} label="Config" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
                    
                    {/* --- DASHBOARD TAB --- */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-white">Resumo Financeiro</h3>
                                <div className="flex bg-gray-800 rounded-lg p-1">
                                    {(['day', 'week', 'month'] as const).map(f => (
                                        <button 
                                            key={f}
                                            onClick={() => setDateFilter(f)}
                                            className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${dateFilter === f ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            {f === 'day' ? 'Hoje' : f === 'week' ? 'Semana' : 'Mês'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard icon={<DollarSign size={24} className="text-green-400" />} label="Faturamento Total" value={formatCurrency(totalRevenue)} />
                                <StatCard icon={<TrendingUp size={24} className="text-blue-400" />} label="Pedidos Realizados" value={totalOrders.toString()} />
                                <StatCard icon={<Bike size={24} className="text-orange-400" />} label="Taxas de Entrega" value={formatCurrency(totalDeliveryFees)} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><CreditCard size={18} /> Formas de Pagamento</h4>
                                    <div className="space-y-4">
                                        {Object.entries(paymentMethods).length === 0 ? (
                                            <p className="text-gray-500">Sem dados para o período.</p>
                                        ) : Object.entries(paymentMethods).map(([method, amount]) => (
                                            <div key={method} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                                                <span className="text-gray-300">{method}</span>
                                                <span className="font-bold text-white">{formatCurrency(amount as number)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Calendar size={18} /> Últimos Pedidos</h4>
                                    <div className="space-y-3">
                                        {filteredOrders.slice(0, 5).map(order => (
                                            <div key={order.id} className="flex justify-between items-center text-sm border-b border-gray-700 pb-2 last:border-0">
                                                <div>
                                                    <p className="font-bold text-white">{order.id} - {order.customer.name}</p>
                                                    <p className="text-gray-500">{new Date(order.date).toLocaleTimeString()} • {order.customer.deliveryOption === 'delivery' ? 'Entrega' : 'Retirada'}</p>
                                                </div>
                                                <span className="font-bold text-green-400">{formatCurrency(order.total)}</span>
                                            </div>
                                        ))}
                                        {filteredOrders.length === 0 && <p className="text-gray-500">Nenhum pedido recente.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- PRODUCTS TAB --- */}
                    {activeTab === 'products' && (
                        <div className="space-y-8 max-w-4xl">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <h3 className="text-2xl font-bold text-white">Gerenciar Cardápio</h3>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <Button 
                                        onClick={handleManualSave}
                                        variant="secondary"
                                        className="flex-1 md:flex-none text-sm py-2 bg-blue-700 hover:bg-blue-600"
                                    >
                                        <Save size={16} /> Salvar Alterações
                                    </Button>
                                    <Button 
                                        onClick={() => setIsAddingProduct(true)} 
                                        variant="success"
                                        className="flex-1 md:flex-none text-sm py-2"
                                    >
                                        <Plus size={16} /> Novo Produto
                                    </Button>
                                </div>
                            </div>

                            {/* Add Product Form */}
                            {isAddingProduct && (
                                <div className="bg-gray-800 border border-green-600 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
                                    <h4 className="font-bold text-white mb-4">Adicionar Novo Item</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">Tipo</label>
                                            <select 
                                                value={newProdType}
                                                onChange={(e) => setNewProdType(e.target.value as any)}
                                                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
                                            >
                                                <option value="combo_selectable_size">Combo / Copo Pronto (Segue Tabela de Preços)</option>
                                                <option value="base_acai">Açaí Puro (Preço Fixo)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 block mb-1">Nome do Item</label>
                                            <input 
                                                type="text" 
                                                value={newProdName}
                                                onChange={(e) => setNewProdName(e.target.value)}
                                                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
                                                placeholder="Ex: Açaí Kids"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-xs text-gray-400 block mb-1">Descrição / Sugestão</label>
                                        <input 
                                            type="text" 
                                            value={newProdDesc}
                                            onChange={(e) => setNewProdDesc(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
                                            placeholder="Ingredientes..."
                                        />
                                    </div>
                                    {newProdType === 'base_acai' && (
                                        <div className="mb-4">
                                            <label className="text-xs text-gray-400 block mb-1">Preço Base (R$)</label>
                                            <input 
                                                type="number" 
                                                value={newProdPrice}
                                                onChange={(e) => setNewProdPrice(e.target.value)}
                                                className="w-32 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-2">
                                        <Button variant="secondary" onClick={() => setIsAddingProduct(false)} className="py-2 text-sm">Cancelar</Button>
                                        <Button onClick={handleAddNewProduct} className="py-2 text-sm">Salvar Produto</Button>
                                    </div>
                                </div>
                            )}

                            {/* 1. Global Cup Sizes Configuration */}
                            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                                <div className="mb-4 border-b border-gray-700 pb-2">
                                    <h4 className="font-bold text-white flex items-center gap-2">
                                        <Settings size={18} className="text-pink-500" />
                                        Configuração de Preços dos Tamanhos
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Estes preços são aplicados automaticamente a todos os Combos.
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {cupSizes.map((size, index) => (
                                        <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                                            <p className="text-gray-400 text-sm font-bold mb-2 text-center">{size.name}</p>
                                            <div className="flex items-center justify-center gap-1">
                                                <span className="text-gray-500 text-sm">R$</span>
                                                <input 
                                                    type="number" 
                                                    step="0.50"
                                                    value={size.price}
                                                    onChange={(e) => handleUpdateCupSize(index, e.target.value)}
                                                    className="w-20 bg-transparent border-b border-gray-600 text-white font-bold text-xl text-center outline-none focus:border-pink-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Base Products */}
                            {baseProducts.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-300 border-l-4 border-purple-500 pl-3">Açaís Tradicionais (Monte o seu)</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        {baseProducts.map(product => (
                                            <div key={product.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                                                <div className="flex-1 w-full">
                                                    <div className="flex justify-between mb-2">
                                                        <input 
                                                            type="text" 
                                                            value={product.name}
                                                            onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                                                            className="bg-transparent text-lg font-bold text-white border-b border-transparent focus:border-pink-500 outline-none w-full"
                                                        />
                                                        <div className="flex gap-2">
                                                             <label className="flex items-center cursor-pointer relative mr-2">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="sr-only peer"
                                                                    checked={!product.disabled}
                                                                    onChange={() => updateProduct(product.id, { disabled: !product.disabled })}
                                                                />
                                                                <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                                                            </label>
                                                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-300"><Trash2 size={18} /></button>
                                                        </div>
                                                    </div>
                                                    <input 
                                                        type="text"
                                                        value={product.description || ''}
                                                        onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                                                        className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-gray-400 text-sm"
                                                        placeholder="Descrição"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg whitespace-nowrap">
                                                    <span className="text-xs text-gray-500">Preço Base: R$</span>
                                                    <input 
                                                        type="number" 
                                                        step="0.50"
                                                        value={product.price}
                                                        onChange={(e) => updateProduct(product.id, { price: parseFloat(e.target.value) })}
                                                        className="w-16 bg-transparent border-none text-white font-bold outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. Combo Products */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-300 border-l-4 border-pink-500 pl-3">Combos & Sugestões (Seguem preços dos tamanhos)</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    {comboProducts.map(product => (
                                        <div key={product.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 relative group">
                                             <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <input 
                                                        type="text" 
                                                        value={product.name}
                                                        onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                                                        className="bg-transparent text-base font-bold text-white border-b border-transparent focus:border-pink-500 outline-none w-full"
                                                    />
                                                </div>
                                                <div className="flex gap-3 ml-4">
                                                    <label className="flex items-center cursor-pointer relative">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={!product.disabled}
                                                            onChange={() => updateProduct(product.id, { disabled: !product.disabled })}
                                                        />
                                                        <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                                                    </label>
                                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-300"><Trash2 size={18} /></button>
                                                </div>
                                             </div>
                                             <div>
                                                <label className="text-[10px] text-gray-500 uppercase font-bold">Descrição / Ingredientes</label>
                                                <input 
                                                    type="text"
                                                    value={product.description || ''}
                                                    onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                                                    className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-gray-300 text-sm focus:border-pink-500 outline-none"
                                                />
                                             </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- SETTINGS TAB --- */}
                    {activeTab === 'settings' && (
                        <div className="max-w-2xl space-y-6">
                            <h3 className="text-2xl font-bold text-white">Configurações da Loja</h3>
                            
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
                                <h4 className="font-bold text-white border-b border-gray-700 pb-2">Status & Delivery</h4>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Status da Loja</label>
                                        <select 
                                            value={settings.storeStatus}
                                            onChange={(e) => updateSettings({ storeStatus: e.target.value as any })}
                                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white"
                                        >
                                            <option value="auto">Automático (Horário)</option>
                                            <option value="open">Forçar Aberto</option>
                                            <option value="closed">Forçar Fechado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Modo de Entrega</label>
                                        <select 
                                            value={settings.deliveryMode}
                                            onChange={(e) => updateSettings({ deliveryMode: e.target.value as any })}
                                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white"
                                        >
                                            <option value="both">Entrega e Retirada</option>
                                            <option value="delivery">Apenas Entrega</option>
                                            <option value="takeout">Apenas Retirada</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-900 rounded border border-gray-700 text-sm">
                                    <p className="text-gray-300">Status Atual: <span className={isStoreOpen ? "text-green-400 font-bold" : "text-red-400 font-bold"}>{isStoreOpen ? 'ABERTO' : 'FECHADO'}</span></p>
                                    <p className="text-gray-300">Delivery: <span className={isDeliveryAvailable ? "text-green-400 font-bold" : "text-yellow-400 font-bold"}>{isDeliveryAvailable ? 'DISPONÍVEL' : 'INDISPONÍVEL'}</span></p>
                                </div>
                            </div>

                            {/* Daily Hours Settings */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
                                <h4 className="font-bold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
                                    <Clock size={18} className="text-pink-500" />
                                    Horários de Funcionamento
                                </h4>
                                
                                <div className="space-y-3">
                                    {DAYS.map((dayName, index) => {
                                        const isOpen = settings.openDays.includes(index);
                                        const hours = settings.dailyHours[index] || { open: '00:00', close: '00:00' };
                                        
                                        return (
                                            <div key={index} className="flex flex-col md:flex-row md:items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                                <div className="w-32 flex items-center gap-2">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isOpen}
                                                        onChange={() => handleDayToggle(index)}
                                                        className="w-4 h-4 accent-pink-500"
                                                    />
                                                    <span className={`font-bold ${isOpen ? 'text-white' : 'text-gray-500'}`}>{dayName}</span>
                                                </div>
                                                
                                                <div className={`flex-1 flex gap-4 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                                    <div className="flex-1">
                                                        <label className="text-[10px] text-gray-400 block mb-1">Abertura</label>
                                                        <input 
                                                            type="time" 
                                                            value={hours.open}
                                                            onChange={(e) => handleTimeChange(index, 'open', e.target.value)}
                                                            className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm w-full"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-[10px] text-gray-400 block mb-1">Fechamento</label>
                                                        <input 
                                                            type="time" 
                                                            value={hours.close}
                                                            onChange={(e) => handleTimeChange(index, 'close', e.target.value)}
                                                            className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="pt-4 border-t border-gray-700 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Início Delivery (Semana)</label>
                                        <input 
                                            type="time" 
                                            value={settings.weekdayDeliveryStartTime}
                                            onChange={(e) => updateSettings({ weekdayDeliveryStartTime: e.target.value })}
                                            className="bg-gray-900 text-white border border-gray-600 rounded px-3 py-2 text-sm w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Início Delivery (Fim de Semana)</label>
                                        <input 
                                            type="time" 
                                            value={settings.weekendDeliveryStartTime}
                                            onChange={(e) => updateSettings({ weekendDeliveryStartTime: e.target.value })}
                                            className="bg-gray-900 text-white border border-gray-600 rounded px-3 py-2 text-sm w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Neighborhood Settings */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
                                <h4 className="font-bold text-white border-b border-gray-700 pb-2">Taxas de Entrega por Bairro</h4>
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {neighborhoods.map((hood, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-gray-900/50 p-2 rounded-lg">
                                            <input 
                                                type="text"
                                                value={hood.name}
                                                onChange={(e) => handleUpdateNeighborhood(idx, 'name', e.target.value)}
                                                className="flex-1 bg-transparent border-none outline-none text-gray-300 text-sm focus:text-white placeholder-gray-600"
                                                placeholder="Nome do Bairro"
                                            />
                                            <div className="flex items-center gap-1 bg-gray-800 rounded px-2 py-1">
                                                <span className="text-xs text-gray-500">R$</span>
                                                <input 
                                                    type="number"
                                                    step="0.50"
                                                    value={hood.fee}
                                                    onChange={(e) => handleUpdateNeighborhood(idx, 'fee', e.target.value)}
                                                    className="w-12 bg-transparent border-none outline-none text-white text-sm text-right"
                                                />
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteNeighborhood(idx)}
                                                className="text-red-500 hover:bg-red-900/30 p-1.5 rounded"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="pt-2 border-t border-gray-700 flex gap-2">
                                    <input 
                                        type="text"
                                        value={newHoodName}
                                        onChange={(e) => setNewHoodName(e.target.value)}
                                        placeholder="Novo Bairro"
                                        className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                                    />
                                    <input 
                                        type="number"
                                        value={newHoodFee}
                                        onChange={(e) => setNewHoodFee(e.target.value)}
                                        placeholder="Taxa"
                                        className="w-20 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white"
                                    />
                                    <Button onClick={handleAddNeighborhood} className="px-3 py-2 text-sm">
                                        <Plus size={16} />
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
                                <h4 className="font-bold text-white border-b border-gray-700 pb-2">Informações de Contato</h4>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">WhatsApp (apenas números)</label>
                                    <input 
                                        type="text" 
                                        value={settings.whatsappNumber}
                                        onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Endereço (Cidade/Bairro)</label>
                                    <input 
                                        type="text" 
                                        value={settings.address}
                                        onChange={(e) => updateSettings({ address: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white"
                                    />
                                </div>
                            </div>

                            <Button onClick={handleManualSave} fullWidth variant="gradient" className="mt-4">
                                <Save size={18} /> Salvar Configurações
                            </Button>
                        </div>
                    )}

                    {/* --- ORDERS HISTORY TAB --- */}
                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                             <h3 className="text-2xl font-bold text-white">Histórico Completo</h3>
                             <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                                 <div className="overflow-x-auto">
                                     <table className="w-full text-left text-sm text-gray-400">
                                         <thead className="bg-gray-900 text-gray-200 uppercase font-bold">
                                             <tr>
                                                 <th className="p-4">Data</th>
                                                 <th className="p-4">Cliente</th>
                                                 <th className="p-4">Tipo</th>
                                                 <th className="p-4">Pagamento</th>
                                                 <th className="p-4 text-right">Total</th>
                                             </tr>
                                         </thead>
                                         <tbody className="divide-y divide-gray-700">
                                             {orders.map(order => (
                                                 <tr key={order.id} className="hover:bg-gray-750">
                                                     <td className="p-4">
                                                         <div className="font-bold text-white">{new Date(order.date).toLocaleDateString()}</div>
                                                         <div className="text-xs">{new Date(order.date).toLocaleTimeString()}</div>
                                                     </td>
                                                     <td className="p-4 text-white">{order.customer.name}</td>
                                                     <td className="p-4">
                                                         <span className={`px-2 py-1 rounded text-xs font-bold ${order.customer.deliveryOption === 'delivery' ? 'bg-blue-900 text-blue-200' : 'bg-orange-900 text-orange-200'}`}>
                                                             {order.customer.deliveryOption === 'delivery' ? 'Delivery' : 'Retirada'}
                                                         </span>
                                                     </td>
                                                     <td className="p-4">{order.customer.paymentMethod}</td>
                                                     <td className="p-4 text-right font-bold text-white">{formatCurrency(order.total)}</td>
                                                 </tr>
                                             ))}
                                             {orders.length === 0 && (
                                                 <tr><td colSpan={5} className="p-8 text-center">Nenhum registro encontrado.</td></tr>
                                             )}
                                         </tbody>
                                     </table>
                                 </div>
                             </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

const MobileTab = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1 p-2 ${active ? 'text-pink-500' : 'text-gray-500'}`}
    >
        {icon}
        <span className="text-[10px]">{label}</span>
    </button>
);

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
        <div className="bg-gray-900 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export default AdminPanel;
