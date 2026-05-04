/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 sm:pt-48 pb-20 sm:pb-32 overflow-hidden border-b border-black/10 bg-[#FDFCFB]">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-grainy opacity-[0.03] pointer-events-none" />
      <div className="absolute top-20 right-[5%] w-72 h-72 bg-[#2D545E] rounded-full mix-blend-multiply opacity-[0.08] blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-[#E17055] rounded-full mix-blend-multiply opacity-[0.05] blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:pr-10"
          >
            <div className="mb-10 sm:mb-14">
              <div className="flex gap-3 sm:gap-4 mb-8 sm:mb-10 overflow-hidden">
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-8 sm:w-10 h-[3px] sm:h-[4px] bg-[#00FFFF]" title="Cyan" />
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-8 sm:w-10 h-[3px] sm:h-[4px] bg-[#FF00FF]" title="Magenta" />
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="w-8 sm:w-10 h-[3px] sm:h-[4px] bg-[#FFFF00]" title="Yellow" />
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="w-8 sm:w-10 h-[3px] sm:h-[4px] bg-[#000000]" title="Key (Black)" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-6xl xl:text-8xl font-display font-black tracking-tight leading-[0.85] mb-8 sm:mb-10 uppercase break-words">
                INDUSTRIAL <br />
                <span className="text-[#2D545E]">PRINT</span> <br />
                <span className="text-stroke-black">PRODUCTION.</span>
              </h1>
              <p className="max-w-md text-base sm:text-lg leading-relaxed text-black/70 font-medium font-sans">
                High-fidelity manufacturing for the modern brand. From offset lithography to large-scale signage, we deliver <span className="font-serif italic text-black/90">chromatic precision</span> and <span className="font-serif italic text-black/90">material excellence.</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
              <button className="w-full sm:w-auto btn-studio bg-black text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#2D545E] hover:shadow-[0_20px_40px_-10px_rgba(45,84,94,0.4)] transition-all">
                Launch Production <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button className="group relative text-[10px] font-black uppercase tracking-[0.2em] pb-1 transition-all">
                <span className="relative z-10 transition-colors group-hover:text-[#2D545E]">Substrate Catalog</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E17055] origin-right scale-x-100 group-hover:scale-x-0 transition-transform duration-300" />
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2D545E] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block lg:pl-10"
          >
            <div className="relative aspect-[4/5] bg-neutral-200 border-studio p-4 brutal-shadow-primary transform rotate-1 hover:rotate-0 transition-transform duration-700">
              <div className="w-full h-full bg-[#EBEAE8] overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=1920&h=1080" 
                  alt="Creative studio print" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-transparent to-transparent flex items-end p-10">
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] font-mono font-bold text-[#E17055] tracking-[0.4em]">SYSTEM_ARCHIVE_26</span>
                    <h3 className="text-white font-display font-black text-5xl leading-[0.9] uppercase">Bespoke <br/>Material <br/>Studies.</h3>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Corner Details */}
            <div className="absolute -top-10 -right-10 flex flex-col gap-3 p-4 bg-white border-studio brutal-shadow-sm">
               <div className="w-12 h-1 bg-[#2D545E]" />
               <div className="w-12 h-1 bg-[#E17055]" />
               <div className="w-12 h-1 bg-black" />
               <div className="mt-2 text-[8px] font-mono font-bold opacity-30">REF. STUDIO_A</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
