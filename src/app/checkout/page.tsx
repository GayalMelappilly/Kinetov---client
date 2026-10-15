'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, QrCode, CreditCard, ShieldCheck, CheckCircle2, Truck, UserX } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../lib/api';
import { UpiPaymentModal } from '../../components/UpiPaymentModal';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'ONLINE'>('UPI');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#121216] border border-[#26262E] flex items-center justify-center mx-auto text-[#88889C]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-xs text-[#88889C]">Add a custom battery to your cart before proceeding to checkout.</p>
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C86D27] text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Custom Batteries</span>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validation
    if (
      !formData.customerName.trim() ||
      !formData.customerEmail.trim() ||
      !formData.customerPhone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setError('Please fill in all shipping details before proceeding.');
      return;
    }

    if (paymentMethod === 'UPI') {
      setShowUpiModal(true);
    } else {
      // Direct Online Payment simulation
      executeOrderCreation('ONLINE-CARD-PAYMENT');
    }
  };

  const executeOrderCreation = async (upiTxnId?: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        paymentMethod: paymentMethod,
        paymentUpiTxnId: upiTxnId || `ONLINE-${Date.now()}`,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await createOrder(orderPayload);
      clearCart();
      setShowUpiModal(false);
      router.push(`/order-success/${order.orderNumber}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to complete order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-[#26262E] pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#C86D27] font-semibold mb-1">
            <UserX className="w-4 h-4" />
            <span>Instant Guest Checkout &bull; No Login Required</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Shipping & Payment</h1>
        </div>

        <Link
          href="/products"
          className="text-xs text-[#88889C] hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col (8 cols): Guest Shipping Details */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 rounded-2xl bg-[#121216] border border-[#26262E] space-y-6">
            <h3 className="font-bold text-lg text-white border-b border-[#26262E] pb-3 flex items-center justify-between">
              <span>1. Guest Customer & Delivery Address</span>
              <span className="text-xs text-[#88889C] font-normal">All fields required</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[#B0B0C2]">Full Name</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B0B0C2]">Email Address</label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="vikram@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B0B0C2]">Mobile / Phone Number</label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[#B0B0C2]">Street Shipping Address</label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House/Plot No., Apartment/Street, Landmark"
                  className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B0B0C2]">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Bengaluru"
                  className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B0B0C2]">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g. Karnataka"
                  className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[#B0B0C2]">Pincode / Postal Code</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="e.g. 560001"
                  className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="p-6 rounded-2xl bg-[#121216] border border-[#26262E] space-y-4">
            <h3 className="font-bold text-lg text-white border-b border-[#26262E] pb-3">
              2. Choose Online Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1: UPI */}
              <label
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                  paymentMethod === 'UPI'
                    ? 'bg-[#C86D27]/10 border-[#C86D27] ring-1 ring-[#C86D27]'
                    : 'bg-[#08080A] border-[#26262E] hover:border-[#3B3B46]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="mt-1 accent-[#C86D27]"
                />
                <div>
                  <div className="flex items-center space-x-2 text-white font-bold text-sm">
                    <QrCode className="w-4 h-4 text-[#C86D27]" />
                    <span>UPI Payment (Recommended)</span>
                  </div>
                  <p className="text-[11px] text-[#88889C] mt-1">
                    GPay, PhonePe, Paytm, BHIM QR code scanning & VPA payment.
                  </p>
                </div>
              </label>

              {/* Option 2: Online Card / NetBanking */}
              <label
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                  paymentMethod === 'ONLINE'
                    ? 'bg-[#C86D27]/10 border-[#C86D27] ring-1 ring-[#C86D27]'
                    : 'bg-[#08080A] border-[#26262E] hover:border-[#3B3B46]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'ONLINE'}
                  onChange={() => setPaymentMethod('ONLINE')}
                  className="mt-1 accent-[#C86D27]"
                />
                <div>
                  <div className="flex items-center space-x-2 text-white font-bold text-sm">
                    <CreditCard className="w-4 h-4 text-[#C86D27]" />
                    <span>Credit / Debit Card / NetBanking</span>
                  </div>
                  <p className="text-[11px] text-[#88889C] mt-1">
                    Secure 256-bit encrypted online checkout portal.
                  </p>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right Col (5 cols): Order Summary & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#121216] border border-[#26262E] space-y-6 sticky top-28">
            <h3 className="font-bold text-lg text-white border-b border-[#26262E] pb-3">
              Order Summary ({items.length} Items)
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg bg-[#19191E] object-cover shrink-0 border border-[#26262E]"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-white truncate">{product.name}</div>
                      <div className="text-[#88889C]">Qty: {quantity} &bull; {product.voltage}</div>
                    </div>
                  </div>
                  <div className="font-bold text-white shrink-0">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-[#26262E] pt-4 text-xs">
              <div className="flex justify-between text-[#88889C]">
                <span>Items Subtotal</span>
                <span className="text-white font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#88889C]">
                <span>Express Insured Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-[#88889C]">
                <span>Taxes & Cell Testing Fee</span>
                <span className="text-white font-semibold">Included</span>
              </div>
              <div className="border-t border-[#26262E] pt-3 flex justify-between text-lg font-extrabold text-white">
                <span>Total Amount</span>
                <span className="text-gradient-copper">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#C86D27] to-[#A85418] hover:from-[#E28844] hover:to-[#C86D27] text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(200,109,39,0.3)] transition-all"
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <span>Proceed to {paymentMethod === 'UPI' ? 'UPI Payment' : 'Pay Online'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[11px] text-center text-[#88889C] flex items-center justify-center gap-1.5 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#C86D27]" />
              <span>Safe & Encrypted Direct Payment Gateway</span>
            </div>

          </div>
        </div>

      </form>

      {/* UPI Modal Popup */}
      {showUpiModal && (
        <UpiPaymentModal
          amount={subtotal}
          onConfirmPayment={(upiTxnId) => executeOrderCreation(upiTxnId)}
          onCancel={() => setShowUpiModal(false)}
          isProcessing={isSubmitting}
        />
      )}

    </div>
  );
}
