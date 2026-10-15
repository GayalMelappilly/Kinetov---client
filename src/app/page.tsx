'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Cpu, ArrowRight, Sparkles, Layers, Sliders, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { getProducts } from '../lib/api';
import { ProductCard } from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = () => {
    setIsLoading(true);
    setError(null);
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => {
        console.error('Failed to load products:', err);
        setError('Unable to load products. Please check if the backend server is running.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="space-y-24 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-[#26262E]/50">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C86D27]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#E28844]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#19191E] border border-[#C86D27]/40 text-xs font-semibold text-[#F3AA72] shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#C86D27]" />
            <span>Next-Gen Custom Battery Engineering</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            High-Performance <br />
            <span className="text-gradient-copper">Custom Batteries</span> Built to Order
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-[#88889C] max-w-2xl mx-auto leading-relaxed">
            Buy ready-to-ship custom LiFePO4 & Lithium NMC packs or design custom voltage, capacity, and BMS configurations for Solar, EVs, Drones & Marine.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#C86D27] to-[#A85418] hover:from-[#E28844] hover:to-[#C86D27] text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(200,109,39,0.3)] transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Custom Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/quote?type=BUY_CUSTOM"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#121216] border border-[#3B3B46] hover:border-[#C86D27] text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all"
            >
              <Sliders className="w-4 h-4 text-[#C86D27]" />
              <span>Custom Spec Builder</span>
            </Link>
          </div>

          {/* Trust stats */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-[#19191E] mt-12 text-left">
            <div className="p-4 rounded-xl bg-[#121216]/60 border border-[#26262E]">
              <div className="text-xl font-black text-white">100% Grade-A</div>
              <div className="text-xs text-[#88889C]">Prismatic & 21700 Cells</div>
            </div>
            <div className="p-4 rounded-xl bg-[#121216]/60 border border-[#26262E]">
              <div className="text-xl font-black text-gradient-copper">Smart BMS</div>
              <div className="text-xs text-[#88889C]">Bluetooth Telemetry</div>
            </div>
            <div className="p-4 rounded-xl bg-[#121216]/60 border border-[#26262E]">
              <div className="text-xl font-black text-white">Instant UPI</div>
              <div className="text-xs text-[#88889C]">Scan & Pay Online</div>
            </div>
            <div className="p-4 rounded-xl bg-[#121216]/60 border border-[#26262E]">
              <div className="text-xl font-black text-white">No Sign-in</div>
              <div className="text-xs text-[#88889C]">Quick Guest Checkout</div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#26262E] pb-6">
          <div>
            <div className="text-xs font-bold text-[#C86D27] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Direct Store Listing
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured Custom Battery Packs
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#F3AA72] hover:text-[#C86D27] transition-colors flex items-center gap-1"
          >
            <span>View All Available Packs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-[#121216] border border-[#26262E] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-[#121216] border border-[#26262E] rounded-2xl space-y-3">
            <p className="text-sm text-[#88889C]">{error}</p>
            <button
              onClick={loadProducts}
              className="px-4 py-2 rounded-xl bg-[#C86D27] hover:bg-[#E28844] text-white text-xs font-bold transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center bg-[#121216] border border-[#26262E] rounded-2xl">
            <p className="text-sm text-[#88889C]">No featured products available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Sell / Custom Spec Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#121216] via-[#19191E] to-[#08080A] border border-[#C86D27]/40 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="px-3 py-1 rounded-md bg-[#C86D27]/20 border border-[#C86D27]/50 text-[#F3AA72] font-bold text-xs uppercase tracking-wider">
              Buy & Sell Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Have a custom battery build requirement or want to <span className="text-gradient-copper">sell custom battery stock</span>?
            </h2>
            <p className="text-sm text-[#88889C] leading-relaxed">
              We build custom voltage battery packs (12V up to 120V) for solar, robotics, EVs, and marine projects. We also buy custom batteries, cells, and BMS modules from engineers and custom builders.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/quote?type=BUY_CUSTOM"
                className="px-6 py-3 rounded-xl bg-[#C86D27] hover:bg-[#E28844] text-white font-bold text-xs shadow-lg transition-all flex items-center space-x-2"
              >
                <span>Request Custom Build Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quote?type=SELL_BATTERY"
                className="px-6 py-3 rounded-xl bg-[#19191E] border border-[#3B3B46] hover:border-white text-white font-bold text-xs transition-all"
              >
                <span>Sell Your Battery Stock</span>
              </Link>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none hidden lg:block">
            <div className="w-full h-full bg-[radial-gradient(#C86D27_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>
        </div>
      </section>

    </div>
  );
}
