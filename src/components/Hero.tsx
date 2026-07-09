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
  const primaryColor = theme?.primaryColor || '#2D545E';
  const accentColor = theme?.accentColor || '#E17055';
  const heroImage = settings?.heroImage || 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=88&w=1920&h=1200';

  return (
    <section
      className="relative min-h-[620px] h-[78svh] max-h-[820px] overflow-hidden bg-[#202425] text-white border-b border-black/10"
      aria-labelledby="hero-title"
    >
      {!imageFailed ? (
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-[#202425]" />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,12,13,0.92)_0%,rgba(9,12,13,0.72)_48%,rgba(9,12,13,0.2)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(9,12,13,0.86)_0%,transparent_45%)]" />
      <div className="absolute inset-0 bg-grainy opacity-[0.06] pointer-events-none" />

      <div className="relative z-10 max-w-7xl h-full mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-end pt-28 sm:pt-32 pb-24 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-10 h-1" style={{ backgroundColor: accentColor }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/75">
              Packaging / Print / Large format
            </span>
          </div>

          <h1
            id="hero-title"
            className="max-w-4xl text-[3rem] sm:text-[4.6rem] lg:text-[6rem] font-display font-black uppercase leading-[0.94] mb-7"
          >
            {settings?.heroTitle || 'Industrial Print Production.'}
          </h1>

          <p className="max-w-2xl text-[15px] sm:text-lg leading-[1.75] text-white/78 font-medium">
            {settings?.heroSubtitle || 'High-fidelity manufacturing for the modern brand. From offset lithography to large-scale signage, we deliver chromatic precision and material excellence.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center mt-9">
            <a
              href="#products"
              className="w-full sm:w-auto min-h-12 px-7 py-4 text-[10px] font-black uppercase tracking-[0.18em] flex items-center justify-center gap-3 transition-colors hover:bg-white hover:text-black"
              style={{ backgroundColor: accentColor }}
            >
              {settings?.primaryButtonText || 'Launch Production'}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#services"
              className="w-full sm:w-auto min-h-12 px-7 py-4 border border-white/45 text-[10px] font-black uppercase tracking-[0.18em] flex items-center justify-center transition-colors hover:bg-white hover:text-black"
            >
              {settings?.secondaryButtonText || 'Substrate Catalog'}
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute z-20 bottom-0 left-0 right-0 border-t border-white/18 bg-black/35 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-3 divide-x divide-white/15">
          {[
            ['01', 'Packaging'],
            ['02', 'Commercial print'],
            ['03', 'Large format'],
          ].map(([number, label]) => (
            <div key={number} className="py-4 sm:py-5 px-3 sm:px-6 first:pl-0">
              <span className="hidden sm:inline text-[9px] font-mono text-white/40 mr-3">{number}</span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.12em] sm:tracking-[0.2em]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <span className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: primaryColor }} />
    </section>
  );
}
