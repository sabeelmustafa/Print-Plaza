/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SiteSettings } from '../types';
import { useState } from 'react';

interface HeroProps {
  settings?: SiteSettings['homepage'];
  theme?: SiteSettings['theme'];
}

export default function Hero({ settings, theme }: HeroProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const heroTitle = settings?.heroTitle || 'INDUSTRIAL PRINT PRODUCTION.';
  const titleWords = heroTitle.split(' ');
  const firstLine = titleWords.slice(0, 1).join(' ') || 'INDUSTRIAL';
  const secondLine = titleWords.slice(1, 2).join(' ') || 'PRINT';
  const thirdLine = titleWords.slice(2).join(' ') || 'PRODUCTION.';
  const primaryColor = theme?.primaryColor || '#2D545E';
  const accentColor = theme?.accentColor || '#E17055';

  return (
    <section className="relative pt-28 sm:pt-40 pb-20 sm:pb-28 overflow-hidden border-b border-black/10 bg-[#FDFCFB]" style={{ backgroundColor: theme?.backgroundColor || '#FDFCFB', color: theme?.textColor || '#000000' }}>
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-grainy opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:pr-10"
          >
            <div className="mb-9 sm:mb-12">
              <div className="flex gap-3 sm:gap-4 mb-7 sm:mb-9 overflow-hidden">
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-7 sm:w-9 h-[3px] bg-[#00FFFF]" title="Cyan" />
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-7 sm:w-9 h-[3px] bg-[#FF00FF]" title="Magenta" />
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="w-7 sm:w-9 h-[3px] bg-[#FFFF00]" title="Yellow" />
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="w-7 sm:w-9 h-[3px] bg-[#000000]" title="Key (Black)" />
              </div>
              <h1 className="text-[3rem] sm:text-[4.6rem] md:text-[5.7rem] lg:text-[5.4rem] xl:text-[6.9rem] font-display font-black tracking-tight leading-[0.86] mb-7 sm:mb-9 uppercase break-words">
                {firstLine} <br />
                <span style={{ color: primaryColor }}>{secondLine}</span> <br />
                <span className="text-stroke-black">{thirdLine}</span>
              </h1>
              <p className="max-w-[34rem] text-[15px] sm:text-base leading-[1.8] text-black/68 font-semibold font-sans">
                {settings?.heroSubtitle || 'High-fidelity manufacturing for the modern brand. From offset lithography to large-scale signage, we deliver chromatic precision and material excellence.'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-7 items-start sm:items-center">
              <button className="w-full sm:w-auto btn-studio bg-black text-white px-9 py-[1.125rem] text-[10px] font-black uppercase tracking-[0.18em] flex items-center justify-center gap-3 hover:bg-[#2D545E] hover:shadow-[0_20px_40px_-10px_rgba(45,84,94,0.4)] transition-all">
                {settings?.primaryButtonText || 'Launch Production'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button className="group relative text-[10px] font-black uppercase tracking-[0.18em] pb-1 transition-all">
                <span className="relative z-10 transition-colors" style={{ color: primaryColor }}>{settings?.secondaryButtonText || 'Substrate Catalog'}</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] origin-right scale-x-100 group-hover:scale-x-0 transition-transform duration-300" style={{ backgroundColor: accentColor }} />
                <span className="absolute bottom-0 left-0 w-full h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ backgroundColor: primaryColor }} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block lg:pl-8"
          >
            <div className="relative aspect-[4/5] bg-neutral-200 border-studio p-4 shadow-[18px_18px_0_rgba(45,84,94,0.12)] transform rotate-1 hover:rotate-0 transition-transform duration-700">
              <div className="w-full h-full bg-[#EBEAE8] overflow-hidden relative">
                {!imageFailed ? (
                  <img
                    src={settings?.heroImage || 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=1920&h=1080'}
                    alt="Creative studio print"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#2f3333,#111)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-transparent to-transparent flex items-end p-10">
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] font-mono font-bold text-[#E17055] tracking-[0.4em]">SYSTEM_ARCHIVE_26</span>
                    <h3 className="text-white font-display font-black text-[2.7rem] leading-[0.92] uppercase">Bespoke <br/>Material <br/>Studies.</h3>
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
