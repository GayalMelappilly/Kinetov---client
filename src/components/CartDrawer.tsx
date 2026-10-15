'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, totalItems } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-[#08080A] border-l border-[#26262E] h-full flex flex-col z-10 shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-[#26262E] flex items-center justify-between bg-[#121216]">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#C86D27]" />
            <h3 className="font-bold text-lg text-white">Your Battery Cart ({totalItems})</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#88889C] hover:text-white hover:bg-[#19191E] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#19191E] border border-[#26262E] flex items-center justify-center mx-auto text-[#656577]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-white font-medium text-base">Your cart is currently empty</h4>
              <p className="text-xs text-[#88889C] max-w-xs mx-auto">
                Explore our catalog of custom high-capacity LiFePO4 & NMC battery packs.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-5 py-2.5 rounded-lg bg-[#19191E] border border-[#3B3B46] text-white hover:border-[#C86D27] text-xs font-semibold tracking-wide transition-all"
              >
                Browse Batteries
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="p-4 rounded-xl bg-[#121216] border border-[#26262E] flex gap-4 items-center group hover:border-[#3B3B46] transition-all"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg bg-[#19191E] overflow-hidden border border-[#26262E] shrink-0">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&q=80&w=300'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">{product.name}</h4>
                  <div className="text-[11px] text-[#C86D27] font-medium mt-0.5">
                    {product.voltage} &bull; {product.capacity} &bull; {product.chemistry}
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#26262E] rounded-md bg-[#08080A]">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1 text-[#88889C] hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1 text-[#88889C] hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1.5 text-[#656577] hover:text-red-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#26262E] bg-[#121216] space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#88889C]">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#88889C]">
                <span>Shipping</span>
                <span className="text-emerald-400 font-semibold">Free Express Shipping</span>
              </div>
              <div className="pt-2 border-t border-[#26262E] flex justify-between text-base font-bold text-white">
                <span>Total Amount</span>
                <span className="text-gradient-copper">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C86D27] to-[#A85418] hover:from-[#E28844] hover:to-[#C86D27] text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(200,109,39,0.3)] transition-all transform hover:-translate-y-0.5"
            >
              <span>Guest Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
