/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, ChevronRight, Lock } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../lib/AuthContext';
import { DataService } from '../lib/dataService';

interface OrderModalProps {
  product: Product;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
  onLoginRequest: () => void;
}

export default function OrderModal({ product, onClose, onSubmit, onLoginRequest }: OrderModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({
    quantity: 1,
    options: {}
  });

  if (!product) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      onLoginRequest();
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        productId: product.id,
        productName: product.name,
        quantity: formData.quantity,
        options: formData.options,
        totalPrice: product.price * formData.quantity,
      };

      await DataService.saveOrder(orderData);
      
      onSubmit({
        ...orderData
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center sm:p-4 md:p-8 lg:p-12 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-xl"
      />
      
      <motion.div 
        key="modal"
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
        className="relative bg-[#FDFCFB] w-full h-full sm:h-auto sm:max-h-[90vh] max-w-7xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row border border-white/10 z-10 sm:rounded-none group"
      >
        {/* Grain overlay */}
        <div className="absolute inset-0 bg-grainy opacity-[0.05] pointer-events-none z-50 mix-blend-overlay" />

        {/* Left Panel: Visual Summary & Technical Specs */}
        <div className="md:w-[40%] bg-black flex flex-col relative z-20 border-b md:border-b-0 md:border-r border-white/10 overflow-hidden shrink-0">
          {/* Mobile Header / Identity Tag */}
          <div className="p-6 md:p-12 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-sm md:bg-transparent">
             <div className="flex gap-2">
                <div className="w-2 h-2 bg-[#2D545E]" />
                <div className="w-2 h-2 bg-[#E17055]" />
                <div className="w-2 h-2 bg-white/20" />
             </div>
             <div className="text-[10px] font-mono font-bold text-white/40 tracking-[0.3em] uppercase">Ref_Order_v02</div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 space-y-10 scrollbar-none">
            <div className="group/image relative">
              <div className="aspect-[16/9] md:aspect-square bg-neutral-900 border border-white/10 overflow-hidden shadow-2xl relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-luminosity opacity-50 group-hover/image:opacity-100 group-hover/image:scale-105 transition-all duration-1000 grayscale group-hover/image:grayscale-0" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {/* Visual scanning line decorative */}
                <div className="absolute inset-x-0 h-[1px] bg-white/20 top-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute inset-y-0 w-[1px] bg-white/20 left-1/2 -translate-x-1/2 pointer-events-none" />
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-[#E17055] text-white text-[10px] font-black px-6 py-4 uppercase tracking-[0.2em] shadow-xl rotate-3">
                Live_Spec
              </div>
            </div>

            <header>
              <h3 className="text-3xl lg:text-4xl font-display font-black tracking-tight mb-4 text-white uppercase leading-[0.85]">
                {product.name}
              </h3>
              <div className="inline-flex items-center gap-3 py-1.5 px-3 bg-white/5 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E17055] animate-pulse" />
                <span className="text-[9px] text-white/50 uppercase tracking-[0.4em] font-black font-mono">ID: 0x{product.id}</span>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-4 pb-8">
               <div className="p-4 bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[7px] font-black text-white/30 uppercase tracking-widest">Base Rate</div>
                  <div className="text-lg font-display font-bold text-white">${product.price.toFixed(2)}</div>
               </div>
               <div className="p-4 bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[7px] font-black text-white/30 uppercase tracking-widest">Unit Type</div>
                  <div className="text-lg font-display font-bold text-white uppercase">{product.unit}</div>
               </div>
            </div>
          </div>

          {/* Bottom Total Bar (Sticky-like or anchored) */}
          <div className="p-8 md:p-10 lg:p-12 bg-white/5 border-t border-white/10 mt-auto">
            <div className="flex flex-col gap-3">
              <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30">Consolidated Projection</span>
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl lg:text-6xl font-display font-black text-white tracking-tighter">
                    ${(product.price * formData.quantity).toFixed(2)}
                  </span>
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold">USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel: Config Form */}
        <div className="md:w-[60%] bg-[#FDFCFB] flex flex-col relative z-20 overflow-hidden">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 md:top-10 md:right-10 p-3 bg-black text-white hover:bg-[#2D545E] transition-all hover:rotate-90 duration-500 z-50 rounded-none shadow-xl"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          <div className="flex-1 overflow-y-auto px-8 py-12 md:px-16 md:py-20 lg:p-24 scrollbar-thin scrollbar-thumb-black/10">
            <header className="mb-12 md:mb-16">
              <div className="inline-flex items-center gap-5 mb-5">
                <span className="w-12 h-[2px] bg-black" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40">Request a Quote // Hub.01</span>
              </div>
              <h4 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase leading-[0.85] mb-6">
                Quote <br/>Configuration.
              </h4>
              <p className="text-sm font-medium text-black/50 font-sans max-w-md leading-relaxed border-l-2 border-black/5 pl-6">
                Establish parameters for high-precision project estimation. Our algorithm calculates cost based on substrate variables and production frequency.
              </p>
            </header>
            
            <form onSubmit={handleSubmit} className="space-y-16 md:space-y-24">
              <div className="space-y-12 md:space-y-20">
                {product.options.map((option, idx) => (
                  <motion.div 
                    key={option.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className="group"
                  >
                    <div className="flex items-center gap-4 mb-6">
                       <span className="text-[#2D545E] font-mono text-sm font-black opacity-30 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                       <label className="text-[10px] uppercase tracking-[0.4em] font-black text-black/30 group-hover:text-black transition-colors">
                         {option.label}
                       </label>
                    </div>

                    {option.type === 'select' ? (
                      <div className="relative group/select">
                        <select 
                          required={option.required !== false}
                          className="w-full bg-white border-2 border-black/5 px-6 py-5 focus:border-[#2D545E] focus:bg-white outline-none text-base font-bold transition-all appearance-none uppercase tracking-widest cursor-pointer group-hover/select:border-black/10 shadow-sm"
                          onChange={(e) => setFormData({
                            ...formData,
                            options: { ...formData.options, [option.id]: e.target.value }
                          })}
                        >
                          <option value="">-- SELECT SPECIFICATION --</option>
                          {option.values?.map(val => (
                            <option key={val} value={val}>{val}</option>
                          ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                          <ChevronRight className="w-5 h-5 rotate-90" />
                        </div>
                      </div>
                    ) : option.type === 'textarea' ? (
                      <textarea
                        required={option.required !== false}
                        rows={4}
                        placeholder={option.placeholder || "Enter requirements..."}
                        className="w-full bg-white border-2 border-black/5 px-6 py-5 focus:border-[#2D545E] focus:bg-white outline-none text-base font-bold transition-all placeholder:text-black/10 uppercase tracking-widest shadow-sm resize-y"
                        onChange={(e) => setFormData({
                          ...formData,
                          options: { ...formData.options, [option.id]: e.target.value }
                        })}
                      />
                    ) : option.type === 'checkbox' ? (
                      <label className="flex items-center gap-5 bg-white border-2 border-black/5 px-6 py-5 cursor-pointer hover:border-black/10 transition-all">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#2D545E]"
                          onChange={(e) => setFormData({
                            ...formData,
                            options: { ...formData.options, [option.id]: e.target.checked }
                          })}
                        />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-black/50">
                          {option.placeholder || 'Enable option'}
                        </span>
                      </label>
                    ) : option.type === 'file' ? (
                      <input
                        type="file"
                        required={option.required !== false}
                        className="w-full bg-white border-2 border-black/5 px-6 py-5 focus:border-[#2D545E] focus:bg-white outline-none text-sm font-bold transition-all shadow-sm file:mr-5 file:border-0 file:bg-black file:text-white file:px-5 file:py-3 file:text-[10px] file:font-black file:uppercase file:tracking-widest"
                        onChange={(e) => setFormData({
                          ...formData,
                          options: { ...formData.options, [option.id]: e.target.files?.[0]?.name || '' }
                        })}
                      />
                    ) : (
                      <input 
                        type={option.type === 'number' ? 'number' : 'text'}
                        required={option.required !== false}
                        placeholder={option.placeholder || "Enter requirements..."}
                        className="w-full bg-white border-2 border-black/5 px-6 py-5 focus:border-[#2D545E] focus:bg-white outline-none text-lg font-bold transition-all placeholder:text-black/10 uppercase tracking-widest shadow-sm"
                        onChange={(e) => setFormData({
                          ...formData,
                          options: { ...formData.options, [option.id]: e.target.value }
                        })}
                      />
                    )}
                  </motion.div>
                ))}
                
                {/* Quantity Section */}
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.3 }}
                   className="pt-12 border-t border-black/5"
                >
                  <div className="flex items-center gap-4 mb-10">
                     <span className="text-[#E17055] font-mono text-sm font-black opacity-30">0{product.options.length + 1}</span>
                     <label className="text-[10px] uppercase tracking-[0.4em] font-black text-black/30">
                       Project Volume / Impulse Frequency
                     </label>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-end gap-8 bg-black/5 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex items-end gap-2">
                        <input 
                          type="number"
                          min="1"
                          max={product.maxQuantity}
                          required
                          value={formData.quantity}
                          className="bg-transparent border-none p-0 focus:ring-0 outline-none text-5xl md:text-6xl font-display font-black text-black placeholder:text-black/5 w-full max-w-[280px]"
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setFormData({ ...formData, quantity: product.maxQuantity ? Math.min(val, product.maxQuantity) : val });
                          }}
                        />
                        <span className="text-xl font-black text-black/20 mb-4 uppercase">{product.unit}s</span>
                      </div>
                      
                      {product.maxQuantity && (
                        <div className="flex items-center gap-3">
                           <div className="h-[1px] flex-1 bg-black/10" />
                           <div className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-[#E17055] bg-white px-3 py-1 shadow-sm">
                             Safe_Limit: {product.maxQuantity.toLocaleString()}
                           </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="sm:w-40 text-[10px] font-mono font-bold text-black/30 uppercase tracking-[0.15em] leading-relaxed">
                      Enter the total volume required for this production cycle.
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Submission Area */}
              <div className="space-y-10">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full bg-black text-white py-8 md:py-10 text-[12px] font-black uppercase tracking-[0.5em] overflow-hidden transition-all hover:bg-[#2D545E] hover:shadow-[0_40px_80px_-20px_rgba(45,84,94,0.4)] disabled:opacity-50 active:scale-[0.98]"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-[#E17055] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                  
                  <div className="relative z-10 flex items-center justify-center gap-6">
                    {!user ? (
                      <>
                        <span className="opacity-50">Auth Required //</span> Login to Proceed
                        <Lock className="w-4 h-4 text-[#E17055]" />
                      </>
                    ) : isSubmitting ? (
                      <>
                        <span className="animate-pulse">Transmission in Progress...</span>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                      </>
                    ) : (
                      <>
                        Request Project Quote
                        <Send className="w-4 h-4 text-[#E17055] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 p-8 border-2 border-black/5 bg-white/50 backdrop-blur-sm">
                  <div className="w-12 h-12 flex items-center justify-center bg-black text-white shrink-0 rotate-45 group-hover:rotate-0 transition-transform duration-700">
                    <div className="w-8 h-8 border border-white/20 flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-700">
                      <span className="text-[10px] font-mono font-black">H6</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed tracking-tight text-black/50 font-sans text-center sm:text-left">
                    Quote validation sequence typically completes within <span className="text-black font-bold">120-240m</span>. 
                    All technical variables will be scrutinized by our lead developers for architectural integrity.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
