import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Edit2, Trash2, ChevronRight, 
  Package, ShoppingBag, Settings, X, Save, 
  CheckCircle, Clock, AlertTriangle, FileText,
  Image as ImageIcon, Globe, Copy
} from 'lucide-react';
import { DataService } from '../lib/dataService';
import { Product, ProductOption } from '../types';

const PRESET_IMAGES = [
  { name: 'Packaging Box', url: 'https://images.unsplash.com/photo-1542319630-55fb7f7c944a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Modern Label', url: 'https://images.unsplash.com/photo-1626015270271-e73792040f7b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Offset Press', url: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Business Cards', url: 'https://images.unsplash.com/photo-1589330694653-96b653457a41?auto=format&fit=crop&q=80&w=800' },
  { name: 'Digital Poster', url: 'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&q=80&w=800' },
  { name: 'Large Banner', url: 'https://images.unsplash.com/photo-1496162294208-99445100018b?auto=format&fit=crop&q=80&w=800' },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const data = await DataService.getOrders();
        setOrders(data);
      } else {
        const data = await DataService.getProducts();
        setProducts(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await DataService.updateOrderStatus(orderId, status);
    fetchData();
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    await DataService.saveProduct(editingProduct);
    setEditingProduct(null);
    fetchData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Destroy product record? This action is irreversible.')) return;
    await DataService.deleteProduct(id);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col md:flex-row">
      {/* Sidebar - Mobile Toggle */}
      <div className="md:hidden bg-black text-white p-4 flex justify-between items-center sticky top-0 z-[60]">
        <h3 className="text-xl font-display font-black uppercase tracking-tighter">PLAZA <span className="text-[#2D545E]">HQ</span></h3>
        <button onClick={() => setShowSidebar(!showSidebar)} className="p-2">
          {showSidebar ? <X /> : <Settings />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-0 z-50 md:relative md:flex md:w-80 bg-black text-white p-12 flex-col border-r border-white/5 transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-20 hidden md:block">
          <h3 className="text-3xl font-display font-black tracking-tighter uppercase mb-2">Plaza <span className="text-[#2D545E]">HQ.</span></h3>
          <div className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.4em]">Administrative Terminal</div>
        </div>

        <nav className="flex-1 space-y-12">
          <button 
            onClick={() => { setActiveTab('orders'); setShowSidebar(false); }}
            className={`w-full flex items-center gap-6 text-[10px] uppercase font-black tracking-[0.4em] transition-all ${activeTab === 'orders' ? 'text-[#E17055]' : 'text-white/40 hover:text-white'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            Order Queue
          </button>
          <button 
            onClick={() => { setActiveTab('products'); setShowSidebar(false); }}
            className={`w-full flex items-center gap-6 text-[10px] uppercase font-black tracking-[0.4em] transition-all ${activeTab === 'products' ? 'text-[#E17055]' : 'text-white/40 hover:text-white'}`}
          >
            <Package className="w-5 h-5" />
            Unit Inventory
          </button>
        </nav>

        <div className="pt-12 border-t border-white/10 opacity-20">
          <div className="text-[9px] font-mono leading-relaxed uppercase">
            System uptime: 99.9% <br/>
            Secure Hub 01_ASIA
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-20 relative overflow-y-auto">
        <div className="absolute inset-0 bg-grainy opacity-[0.02] pointer-events-none" />
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-16 md:mb-24">
          <div>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase leading-none mb-4">
              {activeTab === 'orders' ? 'Central Queue.' : 'Asset Control.'}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-black/40 uppercase tracking-widest">
              Integrated real-time management system.
            </p>
          </div>
          {activeTab === 'products' && (
            <button 
              onClick={() => setEditingProduct({ name: '', price: 0, options: [] } as any)}
              className="w-full sm:w-auto bg-black text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-[#2D545E] transition-all"
            >
              <Plus className="w-4 h-4" /> Initialize Unit
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-2 border-black/10 border-t-black animate-spin rounded-full" />
          </div>
        ) : (
          <div className="space-y-8">
            {activeTab === 'orders' ? (
              <div className="grid gap-px bg-black/5 border border-black/10">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-8 md:p-10 flex flex-col xl:flex-row gap-8 xl:gap-12 items-start xl:items-center hover:bg-[#FDFCFB] transition-colors relative group">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-[10px] font-mono font-bold text-[#2D545E] uppercase tracking-widest">ORDER_REF_{order.id.slice(0,8).toUpperCase()}</span>
                        <div className={`h-1.5 w-1.5 rounded-full ${order.status === 'pending' ? 'bg-[#E17055] animate-pulse' : 'bg-green-500'}`} />
                      </div>
                      <h4 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight mb-2 leading-none">{order.productName}</h4>
                      <p className="text-[11px] font-bold text-black/40 uppercase tracking-[0.2em] mb-4">Quantity: {order.quantity} // Total: ${order.totalPrice.toFixed(2)}</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="text-[9px] font-mono bg-black/5 px-2 py-1 uppercase opacity-60 truncate max-w-[150px]">{order.userName || order.userEmail}</div>
                        <div className="text-[9px] font-mono bg-black/5 px-2 py-1 uppercase opacity-60">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="w-full xl:w-auto flex flex-col gap-3 min-w-[200px]">
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="w-full bg-transparent border border-black/10 p-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-black cursor-pointer"
                      >
                        <option value="pending">PENDING</option>
                        <option value="processing">PROCESSING</option>
                        <option value="completed">COMPLETED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map(product => (
                  <div key={product.id} className="bg-white border border-black/10 p-8 hover:border-black transition-all group">
                    <div className="aspect-square bg-neutral-100 mb-8 overflow-hidden relative">
                      <img src={product.image} className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                      <div className="absolute top-4 right-4 text-[10px] font-black bg-black text-white px-3 py-1 uppercase tracking-widest">${product.price}</div>
                    </div>
                    <h4 className="text-2xl font-display font-black uppercase tracking-tight mb-2">{product.name}</h4>
                    <p className="text-[11px] font-medium text-black/40 mb-8 h-8 overflow-hidden line-clamp-2">{product.description}</p>
                    <div className="flex gap-4 border-t border-black/5 pt-8">
                      <button 
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 flex items-center justify-center gap-3 py-4 border border-black/10 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="w-12 h-12 flex items-center justify-center border border-black/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Product Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[80] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative bg-white w-full md:max-w-2xl h-full shadow-2xl flex flex-col"
            >
              <div className="p-8 md:p-12 border-b border-black/5 flex justify-between items-center">
                <h3 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight">
                  {editingProduct.id ? 'Refine Unit.' : 'New Output.'}
                </h3>
                <button onClick={() => setEditingProduct(null)} className="p-2 hover:rotate-90 transition-transform"><X className="w-6 h-6 md:w-8 md:h-8" /></button>
              </div>

              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-black/30">Unit Identity</label>
                  <input 
                    required
                    className="w-full text-3xl md:text-5xl font-display font-black uppercase tracking-tight border-b border-black/10 py-4 focus:border-black outline-none placeholder:text-black/5"
                    placeholder="Product Name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/30">Base Value (USD)</label>
                    <input 
                      type="number"
                      required
                      className="w-full text-xl md:text-2xl font-bold border-b border-black/10 py-4 focus:border-black outline-none"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/30">Unit Label</label>
                    <input 
                      required
                      className="w-full text-xl md:text-2xl font-bold border-b border-black/10 py-4 focus:border-black outline-none"
                      placeholder="e.g. per box"
                      value={editingProduct.unit}
                      onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-black/30">Max Quantity Constraint</label>
                  <input 
                    type="number"
                    className="w-full text-xl md:text-2xl font-bold border-b border-black/10 py-4 focus:border-black outline-none"
                    placeholder="e.g. 5000"
                    value={editingProduct.maxQuantity || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, maxQuantity: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-black/30">Category ID</label>
                  <input 
                    required
                    className="w-full font-bold border-b border-black/10 py-4 focus:border-black outline-none uppercase tracking-widest"
                    placeholder="packaging, offset, digital, etc."
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  />
                </div>

                <div className="space-y-6">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#E17055]">Visual Asset Gallery</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, image: img.url })}
                        className={`aspect-square overflow-hidden border-2 transition-all group relative ${
                          editingProduct.image === img.url ? 'border-black' : 'border-transparent'
                        }`}
                      >
                        <img src={img.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={img.name} />
                        {editingProduct.image === img.url && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 border-b border-black/10 py-4">
                    <ImageIcon className="w-4 h-4 text-black/20" />
                    <input 
                      className="flex-1 font-mono text-[10px] outline-none bg-transparent"
                      placeholder="Or provide custom asset URL..."
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#E17055]">Custom Substrate Fields</label>
                    <button 
                      type="button"
                      onClick={() => setEditingProduct({ 
                        ...editingProduct, 
                        options: [...(editingProduct.options || []), { id: Math.random().toString(36).slice(2, 7), label: '', type: 'text' }]
                      })}
                      className="text-[9px] font-black uppercase bg-black text-white px-4 py-2 hover:bg-[#2D545E]"
                    >
                      Add Field
                    </button>
                  </div>
                  
                  <div className="space-y-8">
                    {editingProduct.options?.map((opt, idx) => (
                      <div key={opt.id} className="p-8 bg-black/5 border border-black/5 relative group">
                        <button 
                          type="button"
                          onClick={() => setEditingProduct({
                            ...editingProduct,
                            options: editingProduct.options?.filter(o => o.id !== opt.id)
                          })}
                          className="absolute top-4 right-4 text-black/20 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-8">
                          <input 
                            className="bg-transparent border-b border-black/10 py-2 font-bold focus:border-black outline-none"
                            placeholder="Field Label"
                            value={opt.label}
                            onChange={(e) => {
                              const newOpts = [...(editingProduct.options || [])];
                              newOpts[idx].label = e.target.value;
                              setEditingProduct({ ...editingProduct, options: newOpts });
                            }}
                          />
                          <select 
                            className="bg-transparent border-b border-black/10 py-2 font-bold focus:border-black outline-none"
                            value={opt.type}
                            onChange={(e) => {
                              const newOpts = [...(editingProduct.options || [])];
                              newOpts[idx].type = e.target.value as any;
                              setEditingProduct({ ...editingProduct, options: newOpts });
                            }}
                          >
                            <option value="text">Text Input</option>
                            <option value="textarea">Long Text</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="file">File Upload</option>
                            <option value="select">Dropdown Menu</option>
                            <option value="number">Numeric</option>
                          </select>
                        </div>
                        {opt.type === 'select' && (
                          <div className="mt-6">
                            <input 
                              className="w-full bg-transparent border-b border-black/10 py-2 text-[11px] outline-none"
                              placeholder="Values (comma separated)"
                              value={opt.values?.join(', ')}
                              onChange={(e) => {
                                const newOpts = [...(editingProduct.options || [])];
                                newOpts[idx].values = e.target.value.split(',').map(v => v.trim());
                                setEditingProduct({ ...editingProduct, options: newOpts });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-black text-white py-8 text-[11px] font-black uppercase tracking-[0.6em] hover:bg-[#2D545E] transition-all flex items-center justify-center gap-4 shadow-2xl"
                >
                  <Save className="w-4 h-4" /> Log Record to Firestore
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
