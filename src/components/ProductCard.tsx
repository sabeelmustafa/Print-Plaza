/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
  key?: string | number;
}

export default function ProductCard({ product, onOrder }: ProductCardProps) {
  return (
    <div className="group bg-[#FDFCFB] border border-black/10 p-8 sm:p-10 transition-all cursor-pointer flex flex-col h-full hover:border-black hover:shadow-2xl relative overflow-hidden bg-grainy/5">
      <div className="aspect-square overflow-hidden mb-8 sm:mb-12 bg-neutral-100 border border-black/5 relative transition-all duration-700 group-hover:scale-[1.02]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-0 left-0 w-full h-1 bg-[#E17055] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
        <div className="absolute bottom-6 left-6 bg-black/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2">
          ${product.price.toFixed(2)} / {product.unit.toUpperCase()}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <h4 className="text-2xl sm:text-3xl font-display font-black tracking-tight uppercase group-hover:text-[#2D545E] transition-colors leading-[0.9]">
            {product.name}
          </h4>
          <span className="text-[10px] font-mono font-bold opacity-20">00{product.id}</span>
        </div>
        <p className="text-[13px] sm:text-sm font-medium text-black/50 mb-8 sm:mb-12 leading-relaxed font-sans">
          {product.description}
        </p>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onOrder(product);
          }}
          className="btn-studio-square mt-auto w-full py-4 sm:py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 hover:bg-[#2D545E] hover:shadow-[0_15px_30px_-8px_rgba(45,84,94,0.4)]"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#E17055]" />
          Request a Quote
        </button>
      </div>
      
      {/* Decorative dot */}
      <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-black opacity-10" />
    </div>
  );
}
