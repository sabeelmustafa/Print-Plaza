/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceGrid from './components/ServiceGrid';
import ProductCard from './components/ProductCard';
import OrderModal from './components/OrderModal';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import { SERVICES as CONSTANT_SERVICES } from './constants';
import { ServiceCategory, Product } from './types';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './lib/firebase';

import { DataService } from './lib/dataService';

function AppContent() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [services, setServices] = useState<ServiceCategory[]>(CONSTANT_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [view, setView] = useState<'main' | 'dashboard'>('main');

  useEffect(() => {
    fetchProducts();
  }, [view]); // Refresh when coming back from dashboard

  const fetchProducts = async () => {
    try {
      const dbProducts = await DataService.getProducts();
      
      if (dbProducts.length > 0) {
        // Group products by category
        const categories = CONSTANT_SERVICES.map(cat => ({
          ...cat,
          products: dbProducts.filter(p => p.categoryId === cat.id)
        }));
        setServices(categories);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-16 h-px bg-black animate-pulse" />
      </div>
    );
  }

  if (view === 'dashboard') {
    return isAdmin ? (
      <AdminPanel />
    ) : (
      <UserPanel onBack={() => setView('main')} />
    );
  }

  const handleOrderSubmit = (data: any) => {
    setSelectedProduct(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-black selection:bg-[#2D545E] selection:text-white relative">
      {/* Fixed Background Elements */}
      <div className="fixed inset-0 bg-grainy opacity-[0.03] pointer-events-none z-50 overflow-hidden" />
      
      <Navbar 
        onLogin={() => setShowAuthModal(true)} 
        onViewDashboard={() => setView('dashboard')} 
      />
      
      <main>
        <Hero />
        
        <section id="products" className="py-24 sm:py-40 bg-[#FDFCFB] relative overflow-hidden border-b border-black/5">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-28 gap-12">
              <div className="max-w-2xl">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2D545E] mb-6 sm:mb-8 flex items-center gap-4">
                   <div className="w-8 h-px bg-[#2D545E]/30" /> Core Output
                </div>
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tight leading-[0.8] mb-8 sm:mb-12 uppercase">
                  Production <br/>
                  <span className="text-black/10 italic font-serif lowercase">Unit.</span>
                </h2>
                <p className="text-base sm:text-lg font-medium leading-relaxed text-black/50 max-w-lg font-sans">
                  Browse our high-fidelity production lineup. Technical excellence across <span className="text-black/80 font-bold">bespoke formats.</span>
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-4 overflow-hidden">
                <div className="text-[10px] font-mono font-bold bg-[#EBEAE8] px-5 py-3 border border-black/10 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#E17055] animate-pulse" />
                  LIVE_FEED: ACTIVE_JOBS(24) // {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-[9px] font-mono opacity-30 uppercase tracking-widest">
                  Secure Connection Established
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5 border border-black/5">
              {services.flatMap(s => s.products).slice(0, 6).map(product => (
                <div key={product.id} className="bg-[#FDFCFB]">
                  <ProductCard 
                    product={product} 
                    onOrder={setSelectedProduct} 
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-28 flex justify-center">
              <button className="group flex flex-col items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/30 group-hover:text-black transition-colors">Load Archive</span>
                <div className="w-px h-16 bg-gradient-to-b from-black/20 to-transparent group-hover:from-[#2D545E] transition-colors" />
              </button>
            </div>
          </div>
        </section>

        <ServiceGrid 
          categories={services} 
          onSelect={setSelectedCategory} 
        />

        <AnimatePresence>
          {selectedCategory && (
            <motion.section 
              id="category-details"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 z-50 bg-[#FDFDFD] overflow-y-auto pt-20"
            >
              <div className="absolute top-0 right-0 w-1/3 h-2 bg-[#E17055]" />

              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-24 gap-12">
                   <div className="max-w-2xl">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2D545E]/40 hover:text-[#E17055] mb-10 flex items-center gap-3 transition-all group py-2.5 px-5 bg-black/5 rounded-full w-fit hover:bg-black hover:text-white"
                    >
                      <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1" /> Close Technical Specs
                    </button>
                    <h2 className="text-4xl sm:text-7xl font-display font-black tracking-tighter leading-none mb-6 uppercase">
                      {selectedCategory.title}
                    </h2>
                    <p className="text-base sm:text-lg font-medium leading-relaxed text-black/60 max-w-lg">{selectedCategory.description}</p>
                  </div>
                  <div className="text-[10px] font-mono font-bold bg-[#E17055] text-white px-4 py-2 border-2 border-black brutal-shadow self-start md:self-end">
                    BATCH_REF: {selectedCategory.id.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {selectedCategory.products.map(product => (
                    <div key={product.id} className="h-full">
                      <ProductCard 
                        product={product} 
                        onOrder={setSelectedProduct} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer id="about" className="bg-black text-white pt-24 sm:pt-32 pb-16 relative overflow-hidden bg-grainy/5">
        {/* Duo-tone border top */}
        <div className="absolute top-0 left-0 w-full h-2 flex">
          <div className="flex-1 bg-[#2D545E]" />
          <div className="flex-1 bg-[#E17055]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 md:gap-20">
            <div className="sm:col-span-2">
              <div className="mb-10 sm:mb-12">
                <h6 className="font-display font-black text-4xl sm:text-5xl mb-4 tracking-tighter uppercase leading-none">Print <span className="text-[#2D545E]">Plaza.</span></h6>
                <div className="text-[10px] uppercase tracking-[0.4em] font-black text-[#2D545E]">Creative Production Studio</div>
              </div>
              <p className="text-sm leading-loose opacity-60 max-w-sm font-medium tracking-wide">
                Refined creative production with a focus on tactile excellence and tonal precision.
              </p>
            </div>
            
            <div>
              <h5 className="text-[10px] uppercase tracking-[0.3em] font-black mb-8 sm:mb-10 text-[#E17055]">The Archive</h5>
              <ul className="space-y-4 sm:space-y-6 text-sm font-bold tracking-tight opacity-60">
                <li><a href="#" className="hover:text-[#E17055] transition-colors uppercase">Color History</a></li>
                <li><a href="#" className="hover:text-[#E17055] transition-colors uppercase">Paper Lab</a></li>
                <li><a href="#" className="hover:text-[#E17055] transition-colors uppercase">Digital Unit</a></li>
                <li><a href="#" className="hover:text-[#E17055] transition-colors uppercase">Dispatch</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-[10px] uppercase tracking-[0.3em] font-black mb-8 sm:mb-10 text-[#2D545E]">Plaza Studio</h5>
              <ul className="space-y-4 sm:space-y-6 text-sm font-medium leading-relaxed opacity-60 font-mono">
                <li>hi@print.plaza</li>
                <li>+1 212 555 7788</li>
                <li>Studio Block A<br />Creative District, NY 10001</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-24 sm:mt-48 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] opacity-40 text-center md:text-left">
            <p>© 2024 Print Plaza Hub. Creative Output.</p>
            <div className="flex gap-12">
              <a href="#" className="hover:opacity-100 italic">Consistency Report</a>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#2D545E]" />
                <div className="w-2 h-2 bg-[#E17055]" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <AnimatePresence>
        {selectedProduct && (
          <OrderModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onSubmit={handleOrderSubmit}
            onLoginRequest={() => setShowAuthModal(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 sm:bottom-12 right-6 sm:right-12 left-6 sm:left-auto z-[70] bg-[#2D545E] text-white px-8 sm:px-10 py-6 sm:py-8 shadow-2xl flex flex-col gap-3 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center gap-4 text-white">
              <div className="bg-black p-2">
                <CheckCircle2 className="w-6 h-6 text-[#E17055]" />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.3em]">Project Launched.</span>
            </div>
            <p className="text-[11px] font-bold text-white/80 tracking-widest leading-relaxed max-w-[240px]">
              Production is active. Creative review starting now.
            </p>
            <div className="mt-2 flex gap-1">
              <div className="w-full h-1 bg-white/20 overflow-hidden">
                <motion.div 
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 5 }}
                   className="h-full bg-[#E17055]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

