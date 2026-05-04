/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { ServiceCategory } from '../types';

interface ServiceGridProps {
  categories: ServiceCategory[];
  onSelect: (category: ServiceCategory) => void;
}

import { ChevronRight } from 'lucide-react';

export default function ServiceGrid({ categories, onSelect }: ServiceGridProps) {
  return (
    <section id="services" className="py-24 sm:py-40 bg-[#FDFCFB] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grainy opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 sm:mb-28 border-b border-black/10 pb-12 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tight mb-8 leading-[0.8] uppercase">
              PRINT <br/>
              <span className="text-[#2D545E]">PRODUCTION.</span>
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-black/60 font-medium font-sans">
              Specialized manufacturing across diverse substrates. <br/>
              <span className="font-serif italic text-[#E17055]">High-fidelity output engineered for scale.</span>
            </p>
          </div>
          <div className="text-[10px] uppercase tracking-[0.4em] font-black text-[#2D545E] bg-[#EBEAE8] px-4 py-2 border-studio self-start">
            EST. 2024 // CAPACITY_98%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-black/5 border border-black/5">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(category)}
              className="group bg-[#FDFCFB] p-8 sm:p-10 cursor-pointer hover:bg-black transition-colors duration-500 flex flex-col h-auto sm:h-[480px]"
            >
              <div className="mb-10 sm:mb-14">
                <span className="text-[9px] font-mono font-bold text-black/30 group-hover:text-white/40 block mb-4">
                  UNIT_0{index + 1}
                </span>
                <h3 className="text-3xl sm:text-4xl font-display font-black leading-[0.9] uppercase group-hover:text-white transition-colors">
                  {category.title.split(' ')[0]} <br/>
                  <span className="opacity-20 group-hover:opacity-40">{category.title.split(' ')[1] || 'UNIT'}</span>
                </h3>
              </div>
              
              <p className="text-[11px] sm:text-xs font-medium leading-relaxed text-black/50 group-hover:text-white/40 mb-10 sm:mb-12">
                {category.description}
              </p>
              
              <div className="mt-8 sm:mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <div className="w-1 h-3 bg-[#E17055]" />
                    <div className="w-1 h-3 bg-[#2D545E]" />
                  </div>
                  <ChevronRight className="w-5 h-5 translate-x-0 group-hover:translate-x-2 transition-transform text-[#E17055]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
