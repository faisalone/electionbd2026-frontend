'use client';

import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceChargeBanner() {
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

        <div className="relative z-10 px-6 py-8 md:px-12 md:py-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Content */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight"
            >
              সবার জন্য একই রেট
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-lg md:text-xl leading-relaxed max-w-xl"
            >
              ক্রিয়েটর হোন বা ক্রেতা — সবার জন্য একই সহজ ও স্বচ্ছ চার্জিং মডেল।
            </motion.p>
          </div>
        </div>

        {/* Large percentage in background - only this one visible */}
        <div className="absolute inset-0 flex items-center justify-center pt-10 md:justify-end md:pr-16 pointer-events-none overflow-hidden transition-all duration-700">
          <div 
            className="text-[10rem] md:text-[16rem] font-black leading-none text-white/40 mix-blend-overlay group-hover:text-white/90 group-hover:scale-110 transition-all duration-700"
          >
            ১০%
          </div>
        </div>
      </div>
    </div>
  );
}
