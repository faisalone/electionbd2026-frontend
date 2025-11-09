import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import BannerDesigner from '@/components/BannerDesigner';

export default function GeneratePage() {
  return (
    <SectionWrapper>
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C8102E] mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>হোমে ফিরে যান</span>
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-10 h-10 text-[#C8102E]" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            ব্যানার/পোস্টার জেনারেটর
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          আপনার নির্বাচনী প্রচারণার জন্য পেশাদার মানের ব্যানার, পোস্টার এবং সোশ্যাল মিডিয়া পোস্ট ডিজাইন করুন
        </p>
      </div>

      {/* Designer Component */}
      <BannerDesigner />

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center">
          <div className="w-16 h-16 bg-[#C8102E] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#C8102E]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            সহজ ডিজাইন
          </h3>
          <p className="text-gray-600">
            কোনো ডিজাইন দক্ষতা ছাড়াই পেশাদার মানের ব্যানার তৈরি করুন
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center">
          <div className="w-16 h-16 bg-[#C8102E] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#C8102E]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            লাইভ প্রিভিউ
          </h3>
          <p className="text-gray-600">
            পরিবর্তন করার সাথে সাথে লাইভ প্রিভিউ দেখুন
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center">
          <div className="w-16 h-16 bg-[#C8102E] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#C8102E]" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            তাৎক্ষণিক ডাউনলোড
          </h3>
          <p className="text-gray-600">
            ডিজাইন সম্পূর্ণ হলে PNG/JPG ফরম্যাটে ডাউনলোড করুন
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
