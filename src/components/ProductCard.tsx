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
  const [imageFailed, setImageFailed] = React.useState(false);
  const reference = product.id.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase();

  return (
    <div className="group bg-[#FDFCFB] border border-black/10 p-6 sm:p-8 transition-all cursor-pointer flex flex-col h-full hover:border-black/70 hover:shadow-[0_30px_70px_-45px_rgba(0,0,0,0.75)] relative overflow-hidden bg-grainy/5">
      <div className="aspect-[4/3] overflow-hidden mb-7 sm:mb-9 bg-[#EDEBE7] border border-black/5 relative transition-all duration-700">
        {!imageFailed && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-5 bg-[linear-gradient(135deg,#f3f1ed_0%,#e4e1dc_100%)]">
            <div className="flex gap-1.5">
              <span className="h-1.5 w-8 bg-[#2D545E]" />
              <span className="h-1.5 w-8 bg-[#E17055]" />
              <span className="h-1.5 w-8 bg-black" />
            </div>
            <div>
              <div className="text-[9px] font-mono font-black uppercase tracking-[0.28em] text-black/30 mb-3">Image Pending</div>
              <div className="font-display text-3xl font-black uppercase leading-[0.9] text-black/20">{product.name}</div>
            </div>
          </div>
        )}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#E17055] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
        <div className="absolute bottom-5 left-5 bg-black/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.16em] px-3.5 py-2">
          ${product.price.toFixed(2)} / {product.unit.toUpperCase()}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-5 mb-4">
          <h4 className="text-[1.65rem] sm:text-[1.9rem] font-display font-black tracking-tight uppercase group-hover:text-[#2D545E] transition-colors leading-[0.92] max-w-[12ch]">
            {product.name}
          </h4>
          <span className="text-[9px] font-mono font-bold opacity-25 shrink-0">#{reference}</span>
        </div>
        <p className="text-[13px] sm:text-sm font-medium text-black/58 mb-8 sm:mb-10 leading-relaxed font-sans">
          {product.description}
        </p>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onOrder(product);
          }}
          className="btn-studio-square mt-auto w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.22em] transition-all flex items-center justify-center gap-3 hover:bg-[#2D545E] hover:shadow-[0_15px_30px_-8px_rgba(45,84,94,0.4)]"
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
