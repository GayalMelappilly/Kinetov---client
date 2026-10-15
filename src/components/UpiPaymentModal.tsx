'use client';

import React, { useState } from 'react';
import { QrCode, CheckCircle2, ShieldCheck, Copy, ArrowRight, ExternalLink, Smartphone } from 'lucide-react';

interface UpiPaymentModalProps {
  amount: number;
  onConfirmPayment: (upiTxnId: string) => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  amount,
  onConfirmPayment,
  onCancel,
  isProcessing,
}) => {
  const [upiTxnId, setUpiTxnId] = useState('');
  const [copied, setCopied] = useState(false);
  const upiId = 'custombattery@upi';

  // Construct standard UPI intent URI
  const upiUri = `upi://pay?pa=${upiId}&pn=Kinetov%20Batteries&am=${amount}&cu=INR&tn=Custom%20Battery%20Order`;

  // Dynamic SVG QR code generator url via Google charts API or SVG placeholder
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiUri)}&color=08080A&bgcolor=FFFFFF`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiTxnId.trim()) return;
    onConfirmPayment(upiTxnId.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-[#121216] border border-[#26262E] rounded-3xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#C86D27]/10 border border-[#C86D27]/30 text-[#C86D27] flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-xl text-white">Scan & Pay via UPI</h3>
          <p className="text-xs text-[#88889C]">
            Official Online Payment Portal &bull; Kinetov Batteries
          </p>
        </div>

        {/* Amount Badge */}
        <div className="p-4 rounded-2xl bg-[#19191E] border border-[#26262E] text-center space-y-1">
          <span className="text-xs text-[#88889C] uppercase tracking-wider font-semibold">Total Payable Amount</span>
          <div className="text-3xl font-extrabold text-gradient-copper">
            ₹{amount.toLocaleString('en-IN')}
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-4 border-[#C86D27]/40 shadow-inner">
          <img
            src={qrUrl}
            alt="UPI QR Code"
            className="w-48 h-48 object-contain"
          />
          <div className="mt-2 text-[11px] font-bold text-gray-800 tracking-wide uppercase flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-[#C86D27]" /> Scan with any UPI App
          </div>
        </div>

        {/* UPI VPA & Copy */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#08080A] border border-[#26262E]">
          <div>
            <div className="text-[10px] text-[#88889C] uppercase tracking-wider">UPI VPA ID</div>
            <div className="text-xs font-mono font-bold text-white">{upiId}</div>
          </div>
          <button
            type="button"
            onClick={copyUpiId}
            className="px-3 py-1.5 rounded-lg bg-[#19191E] border border-[#3B3B46] text-xs font-semibold text-[#B0B0C2] hover:text-white hover:border-[#C86D27] transition-all flex items-center space-x-1"
          >
            <Copy className="w-3.5 h-3.5 text-[#C86D27]" />
            <span>{copied ? 'Copied!' : 'Copy VPA'}</span>
          </button>
        </div>

        {/* Form: UTR Transaction Ref */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B0B0C2] flex items-center justify-between">
              <span>Enter 12-Digit UPI Transaction Ref / UTR</span>
              <span className="text-[10px] text-[#88889C]">Required for instant verification</span>
            </label>
            <input
              type="text"
              required
              value={upiTxnId}
              onChange={(e) => setUpiTxnId(e.target.value)}
              placeholder="e.g. 429810293812 or GPay Ref No"
              className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white placeholder-[#656577] text-xs font-mono focus:outline-none focus:border-[#C86D27] transition-all"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl bg-[#19191E] border border-[#26262E] text-xs font-bold text-[#88889C] hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !upiTxnId.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C86D27] to-[#A85418] hover:from-[#E28844] hover:to-[#C86D27] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              {isProcessing ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <span>Confirm UPI Order</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#88889C]">
          <ShieldCheck className="w-4 h-4 text-[#C86D27]" />
          <span>256-Bit SSL Encrypted Direct UPI Protocol</span>
        </div>

      </div>

    </div>
  );
};
