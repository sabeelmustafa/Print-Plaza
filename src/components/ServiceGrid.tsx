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
    <section id="services" className="py-24 sm:py-36 bg-[#FDFCFB] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grainy opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-14 sm:mb-20 border-b border-black/10 pb-10 gap-8">
          <div className="max-w-xl">
            <h2 className="text-[2.8rem] sm:text-[4.8rem] md:text-[6rem] font-display font-black tracking-tight mb-7 leading-[0.85] uppercase">
              PRINT <br/>
              <span className="text-[#2D545E]">PRODUCTION.</span>
            </h2>
            <p className="text-[15px] sm:text-base leading-[1.8] text-black/62 font-medium font-sans">
              Specialized printing services across packaging, labels, cards, brochures, posters, banners, and signage. <br/>
              <span className="font-serif italic text-[#E17055]">High-fidelity output engineered for scale.</span>
            </p>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] font-black text-[#2D545E] bg-[#EBEAE8] px-4 py-2 border-studio self-start">
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
              className="group bg-[#FDFCFB] p-7 sm:p-8 cursor-pointer hover:bg-black transition-colors duration-500 flex flex-col min-h-[300px] sm:min-h-[360px]"
            >
              <div className="mb-8 sm:mb-10">
                <span className="text-[9px] font-mono font-bold text-black/30 group-hover:text-white/40 block mb-4">
                  UNIT_0{index + 1}
                </span>
                <h3 className="text-[1.85rem] sm:text-[2.2rem] font-display font-black leading-[0.92] uppercase group-hover:text-white transition-colors">
                  {category.title.split(' ')[0]} <br/>
                  <span className="opacity-20 group-hover:opacity-40">{category.title.split(' ')[1] || 'UNIT'}</span>
                </h3>
              </div>
              
              <p className="text-xs font-medium leading-relaxed text-black/54 group-hover:text-white/48 mb-8 sm:mb-10">
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
