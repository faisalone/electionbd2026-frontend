'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { useMarketAuth } from '@/lib/market-auth-context';
import { authApi } from '@/lib/marketplace-api';

function MarketLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/market/dashboard';
  const { login, isAuthenticated, isLoading: authLoading } = useMarketAuth();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, authLoading, router, redirect]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.sendOTP(phoneNumber);
      toast.success(response.message || 'OTP পাঠানো হয়েছে');
      
      if (response.data?.otp) {
        toast.info(`DEV: আপনার OTP: ${response.data.otp}`, { duration: 10000 });
      }
      
      setIsNewUser(!!response.data?.is_new_user);
      setStep('otp');
    } catch (error: any) {
      toast.error(error.message || 'OTP পাঠাতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try login without name first
      const response = await authApi.verifyOTP(phoneNumber, otpCode, name || undefined);
      
      login(response.token, response.user);
      toast.success('সফলভাবে লগইন হয়েছে!');
      router.push(redirect);
    } catch (error: any) {
      // If name is required, show error
      if (error.message.includes('Name is required')) {
        toast.error('নতুন ইউজার - নাম প্রয়োজন');
      } else {
        toast.error(error.message || 'OTP যাচাই করতে ব্যর্থ হয়েছে');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo height={60} alt="ভোটমামু" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">মার্কেটপ্লেস লগইন</h1>
          <p className="text-gray-600">ডিজাইন শেয়ার করুন এবং বিক্রয় করুন</p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ফোন নম্বর
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="ফোন নম্বর লিখুন"
                    required
                    pattern="[0-9]{11}"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  আপনার হোয়াটসঅ্যাপে ওয়ান টাইম পাসওয়ার্ড (ওটিপি) পাবেন
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#C8102E] text-white py-3 rounded-xl font-semibold hover:bg-[#A00D24] transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>OTP পাঠান</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {isNewUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    আপনার নাম <span className="text-gray-400 text-xs">(নতুন ইউজারের জন্য)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="পূর্ণ নাম লিখুন"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP কোড
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="6 ডিজিট কোড"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {phoneNumber} নম্বরে OTP পাঠানো হয়েছে
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#C8102E] text-white py-3 rounded-xl font-semibold hover:bg-[#A00D24] transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>লগইন করুন</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtpCode('');
                }}
                className="w-full text-sm text-gray-600 hover:text-[#C8102E] transition-colors"
              >
                ফোন নম্বর পরিবর্তন করুন
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function MarketLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
      </div>
    }>
      <MarketLoginContent />
    </Suspense>
  );
}
