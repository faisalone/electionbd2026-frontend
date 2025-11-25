'use client';

import Link from 'next/link';
import { ArrowRight, Palette, Upload, Coins, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JoinCreatorBanner() {
  return (
    <div className="relative w-full my-16 group">
      {/* Glow Effect behind the card */}
      <div className="absolute -inset-1 bg-linear-to-r from-[#C8102E] via-[#ff4d6d] to-[#C8102E] rounded-[2.5rem] blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative w-full bg-linear-to-br from-[#C8102E] to-[#8a0b20] rounded-4xl overflow-hidden shadow-2xl isolate">
        
        {/* Animated Background Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff4d6d] rounded-full mix-blend-overlay filter blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#ff8fa3] rounded-full mix-blend-overlay filter blur-3xl"
        />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>

        <div className="relative z-10 px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Content */}
          <div className="space-y-4 text-center md:text-left max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium mb-1"
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>ক্রিয়েটরদের জন্য</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight"
            >
              আপনার ডিজাইন দিয়ে <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white to-white/70">
                আয় করুন সহজেই
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-base md:text-lg leading-relaxed max-w-xl"
            >
              নির্বাচনের ব্যানার, পোস্টার ও সোশ্যাল মিডিয়া ডিজাইন আপলোড করুন এবং প্রতিটি ডাউনলোডে আয় করুন।
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center md:justify-start gap-4 pt-2"
            >
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Palette className="w-4 h-4" />
                </div>
                <span className="font-medium">ডিজাইন করুন</span>
              </div>
              <div className="w-px h-6 bg-white/20 hidden sm:block"></div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="font-medium">আপলোড করুন</span>
              </div>
              <div className="w-px h-6 bg-white/20 hidden sm:block"></div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Coins className="w-4 h-4" />
                </div>
                <span className="font-medium">আয় করুন</span>
              </div>
            </motion.div>
          </div>
          
          {/* Right Action */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative shrink-0"
          >
            <Link
              href="/market/login"
              className="relative group/btn inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-semibold text-base hover:bg-white/20 transition-all transform hover:-translate-y-0.5"
            >
              <span>শুরু করুন</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Decorative Floating Icons (Background) */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-10 md:right-40 text-white/5 pointer-events-none"
        >
          <Palette className="w-32 h-32" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 left-10 md:left-1/2 text-white/5 pointer-events-none"
        >
          <Coins className="w-24 h-24" />
        </motion.div>
      </div>
    </div>
  );
}
