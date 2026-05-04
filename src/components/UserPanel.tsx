import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Clock, CheckCircle, Package, ArrowLeft, ExternalLink } from 'lucide-react';
import { DataService } from '../lib/dataService';
import { useAuth } from '../lib/AuthContext';

export default function UserPanel({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    setTimeout(() => {
      const data = DataService.getOrders(user?.uid);
      setOrders(data);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-6 sm:p-8 md:p-20 relative">
      <div className="absolute inset-0 bg-grainy opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div>
            <button 
              onClick={onBack}
              className="text-[9px] font-black uppercase tracking-[0.4em] text-black/30 hover:text-black mb-8 md:mb-10 flex items-center gap-3 transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1" /> Terminal Exit
            </button>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.8] mb-6 md:mb-8">
              Order <br/>
              <span className="text-black/10 italic font-serif lowercase">Log.</span>
            </h2>
            <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] font-bold text-[#2D545E] break-all">
              User Instance: {user?.email}
            </p>
          </div>
          
          <div className="flex gap-1.5 self-end">
            <div className="w-4 h-4 bg-black" />
            <div className="w-4 h-4 bg-[#2D545E]" />
            <div className="w-4 h-4 bg-[#E17055]" />
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-black/10 border-t-black animate-spin rounded-full" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-black/10 p-12 sm:p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 h-20 bg-black/5 mb-8 sm:mb-10">
              <ShoppingBag className="w-6 h-6 sm:w-8 h-8 text-black/20" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-black/30 leading-relaxed">No active production records found.</p>
          </div>
        ) : (
          <div className="grid gap-px bg-black/5 border border-black/10">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-8 sm:p-12 flex flex-col md:flex-row gap-8 sm:gap-12 items-start md:items-center group hover:bg-[#FDFCFB] transition-colors">
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                    <span className="text-[10px] font-mono font-bold text-black/30 uppercase tracking-[0.3em]">REF: {order.id.slice(0,8).toUpperCase()}</span>
                    <span className={`text-[9px] font-black uppercase px-3 py-1 tracking-widest ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-black text-white'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h4 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight mb-4 group-hover:text-[#2D545E] transition-colors leading-none">{order.productName}</h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Quantity</div>
                      <div className="text-sm font-bold uppercase">{order.quantity} Units</div>
                    </div>
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Investment</div>
                      <div className="text-sm font-bold uppercase">${order.totalPrice.toFixed(2)}</div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <div className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Launched</div>
                      <div className="text-sm font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col gap-2 pt-6 md:pt-0 border-t md:border-t-0 border-black/5">
                  <div className="text-[9px] font-mono font-bold text-black/20 uppercase tracking-widest mb-2">Production Status</div>
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${order.status === 'completed' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {order.status === 'completed' ? 'System Stable' : 'Unit Processing'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
