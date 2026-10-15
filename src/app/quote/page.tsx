'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sliders, Zap, CheckCircle2, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import { submitCustomQuote } from '../../lib/api';

function QuoteFormContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') === 'SELL_BATTERY' ? 'SELL_BATTERY' : 'BUY_CUSTOM';

  const [type, setType] = useState<'BUY_CUSTOM' | 'SELL_BATTERY'>(initialType);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    voltageReq: '',
    capacityReq: '',
    application: 'Solar Storage',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('type') === 'SELL_BATTERY') {
      setType('SELL_BATTERY');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await submitCustomQuote({
        ...formData,
        type,
      });

      setSuccessMsg(
        type === 'BUY_CUSTOM'
          ? 'Your custom battery specification quote request has been received! Our engineer will contact you within 24 hours.'
          : 'Your battery sell request has been submitted! Our procurement team will review your inventory and contact you.'
      );

      setFormData({
        name: '',
        email: '',
        phone: '',
        voltageReq: '',
        capacityReq: '',
        application: 'Solar Storage',
        notes: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#C86D27]/10 border border-[#C86D27]/30 text-[#C86D27] flex items-center justify-center mx-auto">
          <Sliders className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          {type === 'BUY_CUSTOM' ? 'Request Custom Battery Build' : 'Sell Your Custom Batteries'}
        </h1>
        <p className="text-xs text-[#88889C] max-w-md mx-auto">
          Engineered custom voltage, capacity, thermal management & active BMS configuration.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex rounded-2xl bg-[#121216] border border-[#26262E] p-1.5 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setType('BUY_CUSTOM')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            type === 'BUY_CUSTOM'
              ? 'bg-[#C86D27] text-white shadow-md'
              : 'text-[#88889C] hover:text-white'
          }`}
        >
          Buy Custom Spec Battery
        </button>
        <button
          type="button"
          onClick={() => setType('SELL_BATTERY')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            type === 'SELL_BATTERY'
              ? 'bg-[#C86D27] text-white shadow-md'
              : 'text-[#88889C] hover:text-white'
          }`}
        >
          Sell Batteries / Cells
        </button>
      </div>

      {/* Success / Error Messages */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#121216] border border-[#26262E] space-y-6 shadow-2xl">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B0B0C2]">Your Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B0B0C2]">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@domain.com"
              className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-[#B0B0C2]">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
            />
          </div>

          {type === 'BUY_CUSTOM' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B0B0C2]">Required Voltage (V)</label>
                <input
                  type="text"
                  value={formData.voltageReq}
                  onChange={(e) => setFormData({ ...formData, voltageReq: e.target.value })}
                  placeholder="e.g. 48V, 72V, 96V"
                  className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#B0B0C2]">Target Capacity (Ah)</label>
                <input
                  type="text"
                  value={formData.capacityReq}
                  onChange={(e) => setFormData({ ...formData, capacityReq: e.target.value })}
                  placeholder="e.g. 50Ah, 100Ah, 200Ah"
                  className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[#B0B0C2]">Target Application</label>
                <select
                  value={formData.application}
                  onChange={(e) => setFormData({ ...formData, application: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs focus:border-[#C86D27] focus:outline-none transition-all"
                >
                  <option value="Solar Storage">Off-Grid Solar & Home Power Storage</option>
                  <option value="EV Conversion">Electric Motorbike / EV Conversion</option>
                  <option value="Drone & Robotics">Agricultural Drone & Payload Robotics</option>
                  <option value="Marine & Boat">Electric Boat / Marine Deep Cycle</option>
                  <option value="Industrial">Industrial UPS & Heavy Backup</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-[#B0B0C2]">
              {type === 'BUY_CUSTOM'
                ? 'Detailed Requirements (Dimensions, Max Discharge Current, Casing, Connectors)'
                : 'Battery Details to Sell (Quantity, Voltage, Brand, Cell Condition, Asking Price)'}
            </label>
            <textarea
              required
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={
                type === 'BUY_CUSTOM'
                  ? 'Specify max continuous current required, Bluetooth BMS preference, dimensions constraints, etc.'
                  : 'Specify exact model, age/cycles, chemistry, quantity, location, asking price.'
              }
              className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#C86D27] to-[#A85418] hover:from-[#E28844] hover:to-[#C86D27] text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
        >
          {isSubmitting ? (
            <span>Submitting Request...</span>
          ) : (
            <>
              <span>Submit Request to Kinetov Engineers</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-[#88889C]">Loading custom battery form...</div>}>
      <QuoteFormContent />
    </Suspense>
  );
}
