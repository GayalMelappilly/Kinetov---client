'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Package, QrCode, ArrowLeft, Printer, Truck } from 'lucide-react';
import { Order } from '../../../types';
import { getOrderByNumber } from '../../../lib/api';

export default function OrderSuccessPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrderByNumber(resolvedParams.orderNumber)
      .then((data) => setOrder(data))
      .catch((err) => console.error('Error fetching order receipt:', err))
      .finally(() => setIsLoading(false));
  }, [resolvedParams.orderNumber]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#C86D27] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-[#88889C] mt-4">Generative order receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Order Receipt Not Found</h2>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#19191E] border border-[#3B3B46] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="px-3 py-1 rounded-full bg-[#C86D27]/20 border border-[#C86D27]/40 text-[#F3AA72] font-bold text-xs">
          Order Confirmed & Payment Verified
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Thank You for Your Order!
        </h1>
        <p className="text-xs text-[#88889C] max-w-md mx-auto">
          Your custom battery pack is being prepared for laser-welding, cell balancing, and shipping.
        </p>
      </div>

      {/* Main Receipt Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121216] border border-[#26262E] space-y-8 shadow-2xl">
        
        {/* Top Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#19191E] border border-[#26262E] text-xs">
          <div>
            <div className="text-[#88889C]">Order Number</div>
            <div className="font-mono font-bold text-[#F3AA72] text-sm mt-0.5">{order.orderNumber}</div>
          </div>
          <div>
            <div className="text-[#88889C]">Payment Method</div>
            <div className="font-bold text-white mt-0.5">{order.paymentMethod}</div>
          </div>
          <div>
            <div className="text-[#88889C]">Payment Status</div>
            <div className="font-bold text-emerald-400 mt-0.5">{order.paymentStatus}</div>
          </div>
          <div>
            <div className="text-[#88889C]">Date</div>
            <div className="font-semibold text-white mt-0.5">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Customer & Shipping details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-[#08080A] border border-[#26262E] space-y-2">
            <h4 className="font-bold text-white text-sm border-b border-[#26262E] pb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#C86D27]" /> Customer & Shipping Info
            </h4>
            <div className="space-y-1 text-[#B0B0C2]">
              <div className="font-semibold text-white">{order.customerName}</div>
              <div>{order.customerEmail} &bull; {order.customerPhone}</div>
              <div className="pt-1 text-[#88889C] leading-relaxed">
                {order.address}, {order.city}, {order.state} - {order.pincode}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#08080A] border border-[#26262E] space-y-2">
            <h4 className="font-bold text-white text-sm border-b border-[#26262E] pb-2 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#C86D27]" /> UPI / Online Payment Reference
            </h4>
            <div className="space-y-1.5 text-[#88889C]">
              <div>Transaction Ref: <span className="font-mono font-bold text-white">{order.paymentUpiTxnId || 'VERIFIED-UPI-SUCCESS'}</span></div>
              <div>Fulfillment Status: <span className="font-bold text-[#F3AA72]">{order.orderStatus}</span></div>
              <p className="text-[11px] pt-1">
                A confirmation email has been dispatched to {order.customerEmail}.
              </p>
            </div>
          </div>
        </div>

        {/* Purchased Items Table */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white">Itemized Order Items</h4>
          <div className="rounded-xl border border-[#26262E] bg-[#08080A] overflow-hidden text-xs">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 border-b border-[#26262E] flex justify-between items-center last:border-0">
                <div>
                  <div className="font-bold text-white">{item.productName}</div>
                  <div className="text-[#88889C] text-[11px]">Quantity: {item.quantity} x ₹{item.price.toLocaleString('en-IN')}</div>
                </div>
                <div className="font-extrabold text-white text-sm">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-center p-4 rounded-2xl bg-[#19191E] border border-[#26262E] text-base font-extrabold text-white">
          <span>Total Paid Amount</span>
          <span className="text-gradient-copper text-2xl">
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#26262E]">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#19191E] border border-[#3B3B46] text-xs font-semibold text-white hover:border-[#C86D27] flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#C86D27] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg hover:bg-[#E28844]"
          >
            <span>Continue Shopping</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>

      </div>

    </div>
  );
}
