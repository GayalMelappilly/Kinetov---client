'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Zap, Shield, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative rounded-2xl bg-[#121216] border border-[#26262E] hover:border-[#C86D27]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(200,109,39,0.15)]">
      
      {/* Top Banner Badges */}
      <div className="p-4 space-y-3">
        <div className="relative aspect-[4/3] rounded-xl bg-[#19191E] overflow-hidden border border-[#26262E]">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&q=80&w=600'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Overlay Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-md bg-[#08080A]/85 backdrop-blur-xs border border-[#C86D27]/40 text-[#F3AA72] font-bold text-[11px] tracking-wide">
              {product.voltage}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#08080A]/85 backdrop-blur-xs border border-[#3B3B46] text-[#B0B0C2] font-semibold text-[11px]">
              {product.capacity}
            </span>
          </div>

          {product.isFeatured && (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-[#C86D27] text-white font-bold text-[10px] uppercase tracking-wider">
              Popular
            </span>
          )}
        </div>

        {/* Info */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-[#88889C] uppercase tracking-wider">
            <span className="text-[#C86D27]">{product.chemistry}</span>
            <span>&bull;</span>
            <span>{product.category}</span>
          </div>

          <Link href={`/products/${product.slug}`} className="block group-hover:text-[#F3AA72] transition-colors">
            <h3 className="font-bold text-base text-white line-clamp-2 leading-snug flex items-center justify-between">
              <span>{product.name}</span>
              <ArrowUpRight className="w-4 h-4 text-[#88889C] group-hover:text-[#C86D27] shrink-0 ml-1 transition-colors" />
            </h3>
          </Link>

          <p className="text-xs text-[#88889C] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Specs Footer & Action */}
      <div className="p-4 pt-0 space-y-3">
        
        {/* Key spec highlights */}
        {product.maxDischarge && (
          <div className="p-2 rounded-lg bg-[#19191E] border border-[#26262E] text-[11px] text-[#B0B0C2] flex items-center justify-between">
            <span className="text-[#88889C]">Discharge Rate:</span>
            <span className="font-semibold text-white">{product.maxDischarge}</span>
          </div>
        )}

        {/* Pricing and Cart button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#26262E]">
          <div>
            <div className="text-xs text-[#88889C]">Price</div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-extrabold text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-[#656577] line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2.5 rounded-xl bg-[#19191E] border border-[#C86D27]/40 text-white font-semibold text-xs hover:bg-[#C86D27] hover:border-[#C86D27] transition-all flex items-center space-x-2 group/btn shadow-md"
          >
            <ShoppingBag className="w-4 h-4 text-[#C86D27] group-hover/btn:text-white transition-colors" />
            <span>Add to Cart</span>
          </button>
        </div>

      </div>

    </div>
  );
};
