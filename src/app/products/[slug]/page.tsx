'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Zap, ShieldCheck, Check, ArrowLeft, Cpu, Activity, Gauge, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../../../types';
import { getProductBySlug } from '../../../lib/api';
import { useCart } from '../../../context/CartContext';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProductBySlug(resolvedParams.slug)
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message || 'Product not found.'))
      .finally(() => setIsLoading(false));
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#C86D27] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-[#88889C] mt-4">Loading custom battery specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Battery Product Not Found</h2>
        <p className="text-xs text-[#88889C]">{error}</p>
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#19191E] border border-[#3B3B46] text-white text-xs font-semibold hover:border-[#C86D27]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Back Link */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#88889C] hover:text-[#C86D27] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products Catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Gallery (Multiple Images support) */}
        <div className="space-y-4">
          
          {/* Main Large Image */}
          <div className="relative aspect-[4/3] rounded-2xl bg-[#121216] border border-[#26262E] overflow-hidden shadow-2xl">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#08080A]/90 border border-[#C86D27] text-[#F3AA72] font-bold text-xs">
                {product.voltage}
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#08080A]/90 border border-[#3B3B46] text-white font-semibold text-xs">
                {product.capacity}
              </span>
            </div>
          </div>

          {/* Image Thumbnails if product has multiple images */}
          {product.images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl bg-[#121216] border overflow-hidden shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#C86D27] ring-2 ring-[#C86D27]/40 scale-105'
                      : 'border-[#26262E] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Specs Highlight Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-3 rounded-xl bg-[#121216] border border-[#26262E]">
              <div className="text-[10px] text-[#88889C] uppercase tracking-wider font-semibold">Chemistry</div>
              <div className="text-xs font-bold text-white mt-0.5">{product.chemistry}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#121216] border border-[#26262E]">
              <div className="text-[10px] text-[#88889C] uppercase tracking-wider font-semibold">Max Discharge</div>
              <div className="text-xs font-bold text-[#F3AA72] mt-0.5">{product.maxDischarge || 'Standard'}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#121216] border border-[#26262E]">
              <div className="text-[10px] text-[#88889C] uppercase tracking-wider font-semibold">Cycle Life</div>
              <div className="text-xs font-bold text-white mt-0.5">{product.cycleLife || '2000+'}</div>
            </div>
          </div>

        </div>

        {/* Right: Product Info & Actions */}
        <div className="space-y-6">
          
          <div>
            <div className="text-xs font-semibold text-[#C86D27] uppercase tracking-wider mb-2">
              {product.category} &bull; Verified Custom Pack
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-[#121216] border border-[#26262E] flex items-center justify-between">
            <div>
              <div className="text-xs text-[#88889C]">Online Direct Price</div>
              <div className="flex items-baseline space-x-3 mt-0.5">
                <span className="text-3xl font-extrabold text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-[#656577] line-through">
                    ₹{product.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              {product.stock > 0 ? (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>In Stock ({product.stock} units)</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs">
                  Backorder Only
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#B0B0C2] uppercase tracking-wider">Product Overview</h4>
            <p className="text-xs text-[#88889C] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Detailed Specs Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#B0B0C2] uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#C86D27]" /> Technical Specifications
            </h4>

            <div className="rounded-xl border border-[#26262E] bg-[#121216] overflow-hidden text-xs">
              <div className="grid grid-cols-2 p-3 border-b border-[#26262E] bg-[#19191E]/50">
                <span className="text-[#88889C]">Nominal Voltage</span>
                <span className="font-bold text-white">{product.voltage}</span>
              </div>
              <div className="grid grid-cols-2 p-3 border-b border-[#26262E]">
                <span className="text-[#88889C]">Rated Capacity</span>
                <span className="font-bold text-white">{product.capacity}</span>
              </div>
              <div className="grid grid-cols-2 p-3 border-b border-[#26262E] bg-[#19191E]/50">
                <span className="text-[#88889C]">Cell Chemistry</span>
                <span className="font-bold text-white">{product.chemistry}</span>
              </div>
              {product.dimensions && (
                <div className="grid grid-cols-2 p-3 border-b border-[#26262E]">
                  <span className="text-[#88889C]">Dimensions (L x W x H)</span>
                  <span className="font-bold text-white">{product.dimensions}</span>
                </div>
              )}
              {product.weight && (
                <div className="grid grid-cols-2 p-3 border-b border-[#26262E] bg-[#19191E]/50">
                  <span className="text-[#88889C]">Pack Weight</span>
                  <span className="font-bold text-white">{product.weight}</span>
                </div>
              )}
              {product.connectorType && (
                <div className="grid grid-cols-2 p-3">
                  <span className="text-[#88889C]">Output Connector</span>
                  <span className="font-bold text-[#F3AA72]">{product.connectorType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-[#26262E]">
            
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-[#88889C]">Quantity:</span>
              <div className="flex items-center border border-[#26262E] rounded-xl bg-[#121216]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-white hover:bg-[#19191E] rounded-l-xl font-bold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-white hover:bg-[#19191E] rounded-r-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => addToCart(product, quantity)}
                className="py-3.5 px-6 rounded-xl bg-[#19191E] border border-[#C86D27] text-white font-bold text-xs hover:bg-[#C86D27] transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C86D27] to-[#A85418] hover:from-[#E28844] hover:to-[#C86D27] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(200,109,39,0.3)] transition-all"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now with UPI</span>
              </button>
            </div>

          </div>

          {/* Shipping & Payment assurances */}
          <div className="p-4 rounded-xl bg-[#121216] border border-[#26262E] grid grid-cols-3 gap-2 text-center text-[11px] text-[#88889C]">
            <div className="space-y-1">
              <Truck className="w-4 h-4 text-[#C86D27] mx-auto" />
              <div>Safe Express Shipping</div>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#C86D27] mx-auto" />
              <div>1 Year Warranty</div>
            </div>
            <div className="space-y-1">
              <Zap className="w-4 h-4 text-[#C86D27] mx-auto" />
              <div>UPI Payments</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
