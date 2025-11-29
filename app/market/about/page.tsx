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
  Target
} from 'lucide-react';
import SectionWrapper from '@/components/SectionWrapper';
import JoinCreatorBanner from '@/components/JoinCreatorBanner';
import MarketBackground from '@/components/market/MarketBackground';

export default function AboutMarketPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white relative overflow-hidden">
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
            <span className="font-medium">বাংলাদেশের প্রথম নির্বাচনী ডিজাইন মার্কেটপ্লেস</span>
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

      {/* Platform Overview */}
      <SectionWrapper className="bg-white">
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
            <div className="bg-linear-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl border border-blue-200">
              <div className="bg-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">ক্রিয়েটরদের জন্য</h3>
              <p className="text-gray-700 leading-relaxed">
                আপনার ডিজাইন দক্ষতা দিয়ে আয় করুন। নির্বাচনী পোস্টার, ব্যানার এবং প্রচারণা সামগ্রী তৈরি করে 
                হাজারো ক্রেতার কাছে পৌঁছান। প্রতিটি ডিজাইন বিক্রয় এবং ভিউ থেকে আয় করুন।
              </p>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100/50 p-8 rounded-2xl border border-green-200">
              <div className="bg-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Download className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">ক্রেতাদের জন্য</h3>
              <p className="text-gray-700 leading-relaxed">
                প্রফেশনাল ডিজাইন সংগ্রহ করুন সহজেই। ফ্রি ডাউনলোড করুন অথবা কাস্টম অর্ডার করুন। 
                বাংলাদেশের সেরা ডিজাইনারদের কাজ এক জায়গায় পাবেন।
              </p>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>

      {/* Service Charge Section */}
      <SectionWrapper>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-[#C8102E]/5 border border-[#C8102E]/20 rounded-2xl p-8">
            <DollarSign className="mx-auto text-[#C8102E] mb-4" size={48} />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">স্বচ্ছ মূল্য নীতি</h2>
            <p className="text-xl text-gray-700 mb-6">
              সকল লেনদেনে <span className="text-[#C8102E] font-bold">মাত্র ১০% সার্ভিস চার্জ</span>
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="bg-white p-4 rounded-xl">
                <CheckCircle2 className="text-green-600 mb-2" size={24} />
                <p className="text-gray-700"><strong>ক্রিয়েটর:</strong> প্রতিটি বিক্রয় থেকে ১০% চার্জ</p>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <CheckCircle2 className="text-green-600 mb-2" size={24} />
                <p className="text-gray-700"><strong>ক্রেতা:</strong> প্রতিটি ক্রয়ে ১০% সার্ভিস চার্জ</p>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>

      {/* How It Works for Customers */}
      <SectionWrapper className="bg-linear-to-br from-blue-50 to-indigo-50">
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
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
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

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
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

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
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
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <Target className="text-[#C8102E] mb-4" size={36} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">নির্বাচন কেন্দ্রিক</h3>
              <p className="text-gray-700">
                বাংলাদেশ নির্বাচন ২০২৬ এর জন্য বিশেষভাবে তৈরি সকল ডিজাইন এক প্ল্যাটফর্মে।
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <Award className="text-blue-600 mb-4" size={36} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">প্রফেশনাল কোয়ালিটি</h3>
              <p className="text-gray-700">
                যাচাইকৃত ক্রিয়েটরদের তৈরি উচ্চমানের প্রফেশনাল ডিজাইন পাবেন।
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <Download className="text-green-600 mb-4" size={36} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">ফ্রি ডাউনলোড</h3>
              <p className="text-gray-700">
                যেকোনো ডিজাইন সম্পূর্ণ ফ্রি ডাউনলোড করুন, কোনো লুকানো খরচ নেই।
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <Edit3 className="text-purple-600 mb-4" size={36} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">কাস্টমাইজেশন</h3>
              <p className="text-gray-700">
                আপনার চাহিদা অনুযায়ী ডিজাইন পরিবর্তন করার সুবিধা।
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <Shield className="text-indigo-600 mb-4" size={36} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">নিরাপদ লেনদেন</h3>
              <p className="text-gray-700">
                সুরক্ষিত পেমেন্ট সিস্টেম এবং ক্রেতা সুরক্ষা নিশ্চিত।
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
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
      <SectionWrapper className="bg-linear-to-br from-purple-50 to-pink-50">
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
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
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

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
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

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
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

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-linear-to-br from-amber-500 to-orange-600 text-white p-3 rounded-xl shrink-0">
                  <Award size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">পরিচিতি ও সুনাম</h3>
                  <p className="text-gray-700">
                    নিজের ব্র্যান্ড তৈরি করুন, রিভিউ সংগ্রহ করুন এবং একজন প্রফেশনাল ডিজাইনার হিসেবে 
                    নিজেকে প্রতিষ্ঠিত করুন। আপনার পোর্টফোলিও তৈরি করুন এক জায়গায়।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>

      {/* How to Become a Creator */}
      <SectionWrapper className="bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            কিভাবে ক্রিয়েটর হবেন?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            সহজ কয়েকটি ধাপে ক্রিয়েটর হিসেবে যুক্ত হন এবং আয় শুরু করুন
          </p>
          
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="relative">
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-linear-to-b from-[#C8102E] to-transparent hidden md:block"></div>
              
              <div className="bg-linear-to-r from-blue-50 to-white p-6 rounded-2xl border-l-4 border-blue-600 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0">১</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <UserPlus size={24} className="text-blue-600" />
                      লগইন/সাইনআপ করুন
                    </h3>
                    <p className="text-gray-700">
                      প্রথমে <Link href="/market/login" className="text-[#C8102E] font-semibold hover:underline">লগইন পেজে</Link> যান। 
                      নতুন ইউজার হলে আপনার ফোন নম্বর দিয়ে সাইনআপ করুন। আপনার নাম এবং প্রয়োজনীয় তথ্য প্রদান করুন।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-linear-to-b from-[#C8102E] to-transparent hidden md:block"></div>
              
              <div className="bg-linear-to-r from-purple-50 to-white p-6 rounded-2xl border-l-4 border-purple-600 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0">২</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Edit3 size={24} className="text-purple-600" />
                      প্রোফাইল আপডেট করুন
                    </h3>
                    <p className="text-gray-700">
                      প্রোফাইল সেটিংস থেকে "ক্রিয়েটর হতে চাই" অপশন সিলেক্ট করুন। আপনার পূর্ণ নাম, ঠিকানা, 
                      জাতীয় পরিচয়পত্র নম্বর এবং অন্যান্য প্রয়োজনীয় তথ্য প্রদান করুন। পোর্টফোলিও লিংক থাকলে যুক্ত করুন।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-linear-to-b from-[#C8102E] to-transparent hidden md:block"></div>
              
              <div className="bg-linear-to-r from-amber-50 to-white p-6 rounded-2xl border-l-4 border-amber-600 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0">৩</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Shield size={24} className="text-amber-600" />
                      অ্যাডমিন যাচাইকরণ
                    </h3>
                    <p className="text-gray-700">
                      আপনার তথ্য জমা দেওয়ার পর আমাদের অ্যাডমিন টিম আপনার প্রোফাইল যাচাই করবে। 
                      সাধারণত ২৪-৪৮ ঘন্টার মধ্যে যাচাইকরণ সম্পন্ন হয়। আপনার প্রদত্ত তথ্যের সত্যতা নিশ্চিত করা হবে।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-green-50 to-white p-6 rounded-2xl border-l-4 border-green-600 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0">৪</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={24} className="text-green-600" />
                    ডিজাইন আপলোড শুরু করুন
                  </h3>
                  <p className="text-gray-700 mb-3">
                    অ্যাপ্রুভাল পেয়ে গেলে আপনি ক্রিয়েটর হিসেবে ডিজাইন আপলোড করতে পারবেন। আপনার সেরা কাজগুলো 
                    আপলোড করুন এবং বিক্রয় শুরু করুন। প্রতিটি ডিজাইন ভালোভাবে ট্যাগ করুন যাতে ক্রেতারা সহজেই খুঁজে পান।
                  </p>
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                    <p className="text-sm text-green-800 font-medium">
                      <CheckCircle2 className="inline mr-2" size={16} />
                      অভিনন্দন! এখন আপনি আয় করা শুরু করতে পারবেন।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionWrapper>

      {/* Election 2026 Focus */}
      <SectionWrapper className="bg-linear-to-br from-red-50 to-rose-50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ delay: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-[#C8102E]/20 shadow-lg">
            <div className="bg-[#C8102E] text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target size={36} />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              বাংলাদেশ নির্বাচন ২০২৬ কেন্দ্রিক প্ল্যাটফর্ম
            </h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              ভোটমামু মার্কেট বাংলাদেশের প্রথম এবং একমাত্র নির্বাচন কেন্দ্রিক ডিজিটাল মার্কেটপ্লেস। 
              আসন্ন ২০২৬ সালের জাতীয় নির্বাচনকে কেন্দ্র করে তৈরি এই প্ল্যাটফর্মে পাবেন:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <CheckCircle2 className="text-[#C8102E] mb-2" size={24} />
                <p className="text-gray-800">নির্বাচনী পোস্টার ও ব্যানার ডিজাইন</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <CheckCircle2 className="text-[#C8102E] mb-2" size={24} />
                <p className="text-gray-800">প্রচারণা সামগ্রী ও সোশ্যাল মিডিয়া পোস্ট</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <CheckCircle2 className="text-[#C8102E] mb-2" size={24} />
                <p className="text-gray-800">সকল দল ও প্রার্থীর জন্য বিশেষায়িত ডিজাইন</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <CheckCircle2 className="text-[#C8102E] mb-2" size={24} />
                <p className="text-gray-800">বাংলা ভাষায় সম্পূর্ণ সাপোর্ট ও সেবা</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-linear-to-r from-[#C8102E]/10 to-rose-100 rounded-xl">
              <p className="text-gray-800 font-medium">
                আমরা বিশ্বাস করি, বাংলাদেশের নির্বাচনী প্রচারণায় আধুনিক ডিজাইন এবং ডিজিটাল প্রযুক্তির ব্যবহার 
                আরও সহজ, সাশ্রয়ী এবং কার্যকর হওয়া উচিত। ভোটমামু মার্কেট সেই লক্ষ্যেই কাজ করছে।
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Banner */}
        <JoinCreatorBanner />
      </SectionWrapper>
      </div>
    </div>
  );
}
