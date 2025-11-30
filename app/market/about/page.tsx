'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Sparkles, 
  Users, 
  Download, 
  Edit3, 
  DollarSign, 
  Eye, 
  Star, 
  CheckCircle2, 
  UserPlus, 
  Shield,
  TrendingUp,
  Heart,
  Zap,
  Award,
  Target,
  ArrowRight
} from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import JoinCreatorBanner from '@/components/JoinCreatorBanner';
import MarketBackground from '@/components/market/MarketBackground';
import ServiceChargeBanner from '@/components/ServiceChargeBanner';

export default function AboutMarketPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MarketBackground />
      
      {/* Content with relative positioning */}
      <div className="relative z-10">{/* Hero Section */}
      <SectionWrapper>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto py-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#C8102E]/10 text-[#C8102E] px-4 py-2 rounded-full mb-6">
            <Sparkles size={20} />
            <span className="font-medium">বাংলাদেশের প্রথম নির্বাচনী মার্কেটপ্লেস</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ভোটমামু মার্কেট সম্পর্কে
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            বাংলাদেশ নির্বাচন ২০২৬ কে কেন্দ্র করে তৈরি একটি বিশেষায়িত ডিজিটাল মার্কেটপ্লেস। 
            যেখানে ক্রিয়েটররা তাদের নির্বাচনী পোস্টার, ব্যানার এবং প্রচারণা ডিজাইন বিক্রি করতে পারেন 
            এবং ক্রেতারা তাদের পছন্দের ডিজাইন সংগ্রহ করতে পারেন।
          </p>
        </motion.div>
      </SectionWrapper>

	  {/* Service Charge Section */}
      <div className="container mx-auto px-4">
        <ServiceChargeBanner />
      </div>

      {/* Platform Overview */}
      <SectionWrapper>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            আমরা কি করি?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="backdrop-blur-sm bg-blue-50/30 p-8 rounded-2xl border border-blue-200">
              <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">ক্রিয়েটরদের জন্য</h3>
              <p className="text-gray-700 leading-relaxed">
                আপনার ডিজাইন দক্ষতা দিয়ে আয় করুন। নির্বাচনী পোস্টার, ব্যানার এবং প্রচারণা সামগ্রী তৈরি করে 
                হাজারো ক্রেতার কাছে পৌঁছান। প্রতিটি ডিজাইন বিক্রয় এবং ভিউ থেকে আয় করুন।
              </p>
            </div>

            <div className="backdrop-blur-sm bg-green-50/30 p-8 rounded-2xl border border-green-200">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Download className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">ক্রেতাদের জন্য</h3>
              <p className="text-gray-700 leading-relaxed">
                প্রফেশনাল ডিজাইন সংগ্রহ করুন সহজেই। ফ্রি ডাউনলোড করুন অথবা কাস্টম অর্ডার করুন। 
                বাংলাদেশের সেরা ক্রিয়েটরদের কাজ এক জায়গায় পাবেন।
              </p>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>

      {/* How It Works for Customers */}
      <SectionWrapper>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ক্রেতারা কিভাবে ডিজাইন পাবেন?
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="backdrop-blur-sm bg-white/70 p-6 rounded-2xl shadow-md border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0">১</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Download size={24} className="text-blue-600" />
                    ফ্রি ডাউনলোড
                  </h3>
                  <p className="text-gray-700">
                    যেকোনো ডিজাইন <strong>সম্পূর্ণ ফ্রি</strong> ডাউনলোড করুন। কোনো পরিবর্তন ছাড়াই সরাসরি ব্যবহার করুন। 
                    হাজারো প্রিমিয়াম ডিজাইন আপনার হাতের মুঠোয়।
                  </p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/70 p-6 rounded-2xl shadow-md border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0">২</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Edit3 size={24} className="text-green-600" />
                    কাস্টম অর্ডার
                  </h3>
                  <p className="text-gray-700 mb-3">
                    ডিজাইনে পরিবর্তন প্রয়োজন? কাস্টম অর্ডার করুন। নাম, ছবি, রঙ বা অন্য যেকোনো পরিবর্তনের জন্য 
                    সরাসরি ক্রিয়েটরের সাথে যোগাযোগ করুন।
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      <strong>দাম নির্ধারণ:</strong> কাস্টম অর্ডারের মূল্য ক্রিয়েটর এবং ক্রেতার মধ্যে আলোচনা সাপেক্ষে নির্ধারিত হবে।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/70 p-6 rounded-2xl shadow-md border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0">৩</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Star size={24} className="text-purple-600" />
                    রিভিউ করুন
                  </h3>
                  <p className="text-gray-700">
                    ডিজাইন ব্যবহারের পর রিভিউ লিখুন। আপনার মতামত অন্যদের সিদ্ধান্ত নিতে সাহায্য করবে এবং 
                    ক্রিয়েটরদের মান উন্নতিতে অবদান রাখবে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>

      {/* Why Choose Us - Customers */}
      <SectionWrapper>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ক্রেতারা কেন আমাদের বেছে নেবেন?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <Target className="text-[#C8102E] mb-4" size={36} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">নির্বাচন কেন্দ্রিক</h3>
              <p className="text-gray-700">
                বাংলাদেশ নির্বাচন ২০২৬ এর জন্য বিশেষভাবে তৈরি সকল ডিজাইন এক প্ল্যাটফর্মে।
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <Award className="text-blue-600 mb-4" size={36} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">প্রফেশনাল কোয়ালিটি</h3>
              <p className="text-gray-700">
                যাচাইকৃত ক্রিয়েটরদের তৈরি উচ্চমানের প্রফেশনাল ডিজাইন পাবেন।
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <Download className="text-green-600 mb-4" size={36} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">ফ্রি ডাউনলোড</h3>
              <p className="text-gray-700">
                যেকোনো ডিজাইন সম্পূর্ণ ফ্রি ডাউনলোড করুন, কোনো লুকানো খরচ নেই।
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <Edit3 className="text-purple-600 mb-4" size={36} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">কাস্টমাইজেশন</h3>
              <p className="text-gray-700">
                আপনার চাহিদা অনুযায়ী ডিজাইন পরিবর্তন করার সুবিধা।
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <Shield className="text-indigo-600 mb-4" size={36} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">নিরাপদ লেনদেন</h3>
              <p className="text-gray-700">
                সুরক্ষিত পেমেন্ট সিস্টেম এবং ক্রেতা সুরক্ষা নিশ্চিত।
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/60 p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <Heart className="text-rose-600 mb-4" size={36} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">দেশীয় প্ল্যাটফর্ম</h3>
              <p className="text-gray-700">
                বাংলাদেশের জন্য বাংলাদেশীদের তৈরি একটি বিশ্বস্ত মার্কেটপ্লেস।
              </p>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>

      {/* Creator Benefits */}
      <SectionWrapper>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ক্রিয়েটর হিসেবে কেন যুক্ত হবেন?
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="backdrop-blur-sm bg-white/70 p-6 rounded-2xl shadow-md border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white p-3 rounded-xl shrink-0">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">দুই ভাবে আয় করুন</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-600 mt-1 shrink-0" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900">কাস্টম অর্ডার থেকে</p>
                        <p className="text-gray-700">ক্রেতাদের কাস্টম অর্ডার সম্পন্ন করে সরাসরি আয়</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-600 mt-1 shrink-0" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900">স্পন্সর বিজ্ঞাপন থেকে</p>
                        <p className="text-gray-700">আপনার ডিজাইন এবং প্রোফাইলে দেখানো বিজ্ঞাপন থেকে আয়</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/70 p-6 rounded-2xl shadow-md border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-linear-to-br from-blue-500 to-indigo-600 text-white p-3 rounded-xl shrink-0">
                  <Eye size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">ভিউ ভিত্তিক আয়</h3>
                  <p className="text-gray-700">
                    আপনার ডিজাইন যত বেশি দেখা হবে, তত বেশি বিজ্ঞাপন প্রদর্শিত হবে এবং তত বেশি আয় হবে। 
                    জনপ্রিয় ডিজাইন তৈরি করুন এবং প্যাসিভ ইনকাম জেনারেট করুন।
                  </p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/70 p-6 rounded-2xl shadow-md border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-linear-to-br from-purple-500 to-pink-600 text-white p-3 rounded-xl shrink-0">
                  <Zap size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">বিশাল ক্রেতা বেস</h3>
                  <p className="text-gray-700">
                    বাংলাদেশ নির্বাচন ২০২৬ কে ঘিরে হাজারো প্রার্থী, রাজনৈতিক দল এবং কর্মীদের কাছে পৌঁছান। 
                    একটি বিশেষায়িত মার্কেটপ্লেসে আপনার কাজের সঠিক মূল্যায়ন পান।
                  </p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/70 p-6 rounded-2xl shadow-md border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-linear-to-br from-amber-500 to-orange-600 text-white p-3 rounded-xl shrink-0">
                  <Award size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">পরিচিতি ও সুনাম</h3>
                  <p className="text-gray-700">
                    নিজের ব্র্যান্ড তৈরি করুন, রিভিউ সংগ্রহ করুন এবং একজন প্রফেশনাল ক্রিয়েটর হিসেবে 
                    নিজেকে প্রতিষ্ঠিত করুন। আপনার পোর্টফোলিও তৈরি করুন এক জায়গায়।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>

      {/* How to Become a Creator */}
      <SectionWrapper>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-[#C8102E]/10 px-6 py-2 rounded-full border border-[#C8102E]/20 mb-4"
            >
              <p className="text-sm font-semibold text-[#C8102E]">সহজ প্রক্রিয়া</p>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              কিভাবে <span className="text-[#C8102E]">ক্রিয়েটর</span> হবেন?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              মাত্র চারটি ধাপে যুক্ত হন এবং আয় শুরু করুন
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Modern Vertical Timeline */}
            <div className="relative">
              {/* Vertical gradient line */}
              <div className="absolute left-10 top-8 bottom-8 w-0.5 bg-linear-to-b from-[#C8102E]/60 via-[#C8102E] to-[#C8102E]/60 rounded-full"></div>
              
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative flex items-start gap-6 pb-16"
              >
                {/* Number Badge */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-[#C8102E] rounded-full blur-lg opacity-20"></div>
                  <div className="relative bg-linear-to-br from-[#C8102E] to-[#8B0A1F] text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl shadow-xl border-4 border-white">
                    ১
                  </div>
                </div>
                
                {/* Content Card */}
                <div className="flex-1 backdrop-blur-sm bg-white/70 rounded-2xl p-6 border border-[#C8102E]/20 shadow-lg hover:shadow-xl transition-all duration-300 mt-2">
                  <div className="flex items-start gap-4">
                    <div className="bg-linear-to-br from-[#C8102E] to-[#8B0A1F] text-white p-3 rounded-xl shrink-0 shadow-md">
                      <UserPlus size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        লগইন/সাইনআপ করুন
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        প্রথমে <Link href="/market/login" className="text-[#C8102E] font-semibold hover:underline inline-flex items-center gap-1">
                          লগইন পেজে
                          <ArrowRight size={16} />
                        </Link> যান। ফোন নম্বর দিয়ে সাইনআপ করুন এবং প্রয়োজনীয় তথ্য প্রদান করুন।
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative flex items-start gap-6 pb-16"
              >
                {/* Number Badge */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-[#C8102E] rounded-full blur-lg opacity-20"></div>
                  <div className="relative bg-linear-to-br from-[#C8102E] to-[#8B0A1F] text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl shadow-xl border-4 border-white">
                    ২
                  </div>
                </div>
                
                {/* Content Card */}
                <div className="flex-1 backdrop-blur-sm bg-white/70 rounded-2xl p-6 border border-[#C8102E]/20 shadow-lg hover:shadow-xl transition-all duration-300 mt-2">
                  <div className="flex items-start gap-4">
                    <div className="bg-linear-to-br from-[#C8102E] to-[#8B0A1F] text-white p-3 rounded-xl shrink-0 shadow-md">
                      <Edit3 size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        প্রোফাইল আপডেট করুন
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        প্রোফাইল সেটিংস থেকে &quot;ক্রিয়েটর হতে চাই&quot; অপশন সিলেক্ট করুন। পূর্ণ নাম, ঠিকানা, জাতীয় পরিচয়পত্র এবং পোর্টফোলিও যুক্ত করুন।
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative flex items-start gap-6 pb-16"
              >
                {/* Number Badge */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-[#C8102E] rounded-full blur-lg opacity-20"></div>
                  <div className="relative bg-linear-to-br from-[#C8102E] to-[#8B0A1F] text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl shadow-xl border-4 border-white">
                    ৩
                  </div>
                </div>
                
                {/* Content Card */}
                <div className="flex-1 backdrop-blur-sm bg-white/70 rounded-2xl p-6 border border-[#C8102E]/20 shadow-lg hover:shadow-xl transition-all duration-300 mt-2">
                  <div className="flex items-start gap-4">
                    <div className="bg-linear-to-br from-[#C8102E] to-[#8B0A1F] text-white p-3 rounded-xl shrink-0 shadow-md">
                      <Shield size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        অ্যাডমিন যাচাইকরণ
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        আমাদের টিম ২৪-৪৮ ঘন্টার মধ্যে আপনার প্রোফাইল যাচাই করবে। আপনার তথ্যের সত্যতা নিশ্চিত করা হবে।
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative flex items-start gap-6"
              >
                {/* Number Badge */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-[#C8102E] rounded-full blur-lg opacity-20"></div>
                  <div className="relative bg-linear-to-br from-[#C8102E] to-[#8B0A1F] text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-3xl shadow-xl border-4 border-white">
                    ৪
                  </div>
                </div>
                
                {/* Content Card */}
                <div className="flex-1 backdrop-blur-sm bg-white/70 rounded-2xl p-6 border border-[#C8102E]/20 shadow-lg hover:shadow-xl transition-all duration-300 mt-2">
                  <div className="flex items-start gap-4">
                    <div className="bg-linear-to-br from-[#C8102E] to-[#8B0A1F] text-white p-3 rounded-xl shrink-0 shadow-md">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        ডিজাইন আপলোড শুরু করুন
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        অ্যাপ্রুভাল পেলে আপনি ডিজাইন আপলোড এবং বিক্রয় শুরু করতে পারবেন। প্রতিটি ডিজাইন ভালোভাবে ট্যাগ করুন।
                      </p>
                      <div className="bg-[#C8102E]/10 border border-[#C8102E]/30 rounded-xl p-4">
                        <p className="text-[#8B0A1F] font-semibold flex items-center gap-2">
                          <Sparkles size={20} className="text-[#C8102E]" />
                          অভিনন্দন! এখন আপনি আয় করা শুরু করতে পারবেন।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>
      
      {/* Join Creator Banner */}
      <div className="container mx-auto px-4">
        <JoinCreatorBanner />
      </div>
      </div>
    </div>
  );
}
