'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, KeyRound, ArrowRight, Zap } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { admin, login } = useAdminAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (admin) {
      router.push('/admin/dashboard');
    }
  }, [admin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(username, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      
      <div className="w-full max-w-md bg-[#121216] border border-[#26262E] rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#C86D27]/10 border border-[#C86D27]/30 text-[#C86D27] flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Admin Access Portal</h1>
          <p className="text-xs text-[#88889C]">
            Restricted zone. Authorised admin credentials required.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Credentials Info Note */}
        <div className="p-3 rounded-xl bg-[#19191E] border border-[#26262E] text-[11px] text-[#B0B0C2] space-y-1">
          <div className="font-bold text-[#F3AA72] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C86D27]" /> Default Admin Credentials:
          </div>
          <div className="font-mono text-[11px] text-[#88889C]">
            Username: <span className="text-white font-bold">admin</span> | Password: <span className="text-white font-bold">adminpassword123</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B0B0C2] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C86D27]" /> Admin Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B0B0C2] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#C86D27]" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-[#26262E] text-white text-xs placeholder-[#656577] focus:border-[#C86D27] focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C86D27] to-[#A85418] hover:from-[#E28844] hover:to-[#C86D27] text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(200,109,39,0.25)] transition-all"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Login to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>

    </div>
  );
}
