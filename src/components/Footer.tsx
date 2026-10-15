'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, QrCode, CreditCard, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#08080A] border-t border-[#26262E] text-[#88889C] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-[#19191E] border border-[#C86D27]/40 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#C86D27]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                KINET<span className="text-gradient-copper">OV</span>
              </span>
            </div>
            <p className="text-sm text-[#88889C] leading-relaxed">
              Premium custom lithium battery packs engineered for performance solar storage, custom EVs, drones, and heavy industrial applications.
            </p>
            <div className="flex items-center space-x-2 text-xs text-[#F3AA72]">
              <ShieldCheck className="w-4 h-4 text-[#C86D27]" />
              <span>Certified Cell Testing & Active Balancing</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#C86D27] pl-2">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products" className="hover:text-[#C86D27] transition-colors">
                  All Custom Batteries
                </Link>
              </li>
              <li>
                <Link href="/quote?type=BUY_CUSTOM" className="hover:text-[#C86D27] transition-colors">
                  Request Custom Voltage/Pack
                </Link>
              </li>
              <li>
                <Link href="/quote?type=SELL_BATTERY" className="hover:text-[#C86D27] transition-colors">
                  Sell Your Custom Batteries
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#C86D27] transition-colors">
                  Admin Panel Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#C86D27] pl-2">
              Battery Chemistries
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="text-[#B0B0C2]">LiFePO4 (Prismatic & Cylindrical)</li>
              <li className="text-[#B0B0C2]">Lithium NMC (High Discharge 21700)</li>
              <li className="text-[#B0B0C2]">Drone LiPo High-C Rate Packs</li>
              <li className="text-[#B0B0C2]">Smart BMS Telemetry Systems</li>
            </ul>
          </div>

          {/* Col 4: Payments & Security */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#C86D27] pl-2">
              Payment & Checkout
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-2 p-2.5 rounded bg-[#19191E] border border-[#26262E]">
                <QrCode className="w-5 h-5 text-[#C86D27]" />
                <div>
                  <div className="text-white font-medium">Instant UPI Payments</div>
                  <div className="text-[#88889C] text-[11px]">GPay, PhonePe, Paytm, BHIM</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2.5 rounded bg-[#19191E] border border-[#26262E]">
                <CreditCard className="w-5 h-5 text-[#C86D27]" />
                <div>
                  <div className="text-white font-medium">Cards & NetBanking</div>
                  <div className="text-[#88889C] text-[11px]">100% Encrypted Online Checkout</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2.5 rounded bg-[#19191E] border border-[#26262E]">
                <Truck className="w-5 h-5 text-[#C86D27]" />
                <div>
                  <div className="text-white font-medium">Guest Checkout Available</div>
                  <div className="text-[#88889C] text-[11px]">No mandatory sign-in required to buy</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[#19191E] text-center text-xs text-[#656577]">
          &copy; {new Date().getFullYear()} Kinetov Custom Battery Store. All rights reserved. Minimal Modern Architecture.
        </div>

      </div>
    </footer>
  );
};
