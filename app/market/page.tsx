import Link from 'next/link';
import { ArrowLeft, Wrench } from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';

export default function MarketPage() {
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

      {/* Under Development Message */}
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <Wrench className="w-24 h-24 text-[#C8102E] mx-auto mb-4 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            পেজটি উন্নয়নাধীন
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            শীঘ্রই চালু হবে
          </p>
          <p className="text-lg text-gray-500 leading-relaxed">
            আমরা একটি অসাধারণ ব্যানার/পোস্টার জেনারেটর তৈরি করছি যা আপনার নির্বাচনী প্রচারণাকে আরও শক্তিশালী করবে। অনুগ্রহ করে আমাদের সাথে থাকুন।
          </p>
          
          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#A00D24] transition-all shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>হোমে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
