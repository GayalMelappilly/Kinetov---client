'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShoppingBag, ShieldCheck, Cpu, UserCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdminAuth } from '../context/AdminAuthContext';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { admin } = useAdminAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#08080A]/90 backdrop-blur-md border-b border-[#26262E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#19191E] border border-[#C86D27]/30 flex items-center justify-center group-hover:border-[#C86D27] transition-all shadow-[0_0_15px_rgba(200,109,39,0.15)]">
              <Zap className="w-5 h-5 text-[#C86D27] fill-[#C86D27]/20" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center">
                KINET<span className="text-gradient-copper">OV</span>
              </span>
              <span className="text-[10px] text-[#88889C] block tracking-wider uppercase font-semibold">
                Custom Battery Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link
              href="/products"
              className="text-[#B0B0C2] hover:text-[#C86D27] transition-colors flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-[#88889C]" />
              Products Catalog
            </Link>
            <Link
              href="/quote?type=BUY_CUSTOM"
              className="text-[#B0B0C2] hover:text-[#C86D27] transition-colors flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#88889C]" />
              Build Custom Pack
            </Link>
            <Link
              href="/quote?type=SELL_BATTERY"
              className="text-[#B0B0C2] hover:text-[#C86D27] transition-colors"
            >
              Sell Your Battery
            </Link>
            <Link
              href="/admin/dashboard"
              className={`px-3 py-1.5 rounded-md border text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                admin
                  ? 'border-[#C86D27] text-[#F3AA72] bg-[#C86D27]/10'
                  : 'border-[#3B3B46] text-[#88889C] hover:text-white hover:border-[#C86D27]'
              }`}
            >
              {admin ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-[#C86D27]" />
                  Admin ({admin.username})
                </>
              ) : (
                'Admin Login'
              )}
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            
            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg bg-[#19191E] border border-[#26262E] text-white hover:border-[#C86D27] transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#E4E4EB]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C86D27] text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
