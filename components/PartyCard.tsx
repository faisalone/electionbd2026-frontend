'use client';

import { motion } from 'framer-motion';
import { Users, Calendar } from 'lucide-react';
import { getImageUrl } from '@/lib/admin/api';

interface PartyCardProps {
  name: string;
  symbol: string | { id: number; symbol_name: string; image: string } | null | undefined;
  logo?: string | null;
  color: string;
  founded: string;
  candidatesCount?: number;
}

export default function PartyCard({
  name,
  logo,
  color,
  founded,
  candidatesCount = 0,
}: PartyCardProps) {
  // Get first letter for fallback avatar
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        {/* Party Logo - Large & Prominent */}
        <div className="mb-6">
          <div 
            className="relative rounded-2xl p-8 text-center overflow-hidden"
            style={{ 
              backgroundColor: `${color}08`,
              border: `2px solid ${color}20`
            }}
          >
            {/* Decorative gradient background */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                background: `radial-gradient(circle at 30% 50%, ${color}, transparent 70%)`
              }}
            />
            
            <div className="relative">
              {logo ? (
                <div className="mb-4 flex justify-center">
                  <img 
                    src={getImageUrl(logo)} 
                    alt={name}
                    className="w-32 h-32 object-contain transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div 
                  className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center text-white text-6xl font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: color }}
                >
                  {firstLetter}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Party Name */}
        <div className="mb-5">
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-2 text-center leading-tight">
            {name}
          </h3>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>প্রতিষ্ঠা: {founded}</span>
          </p>
        </div>

        {/* Candidates Count */}
        {candidatesCount > 0 && (
          <div 
            className="rounded-xl p-4 text-center mb-5"
            style={{ backgroundColor: `${color}05` }}
          >
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">প্রার্থী সংখ্যা</p>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" style={{ color: color }} />
              <p className="text-lg font-bold leading-tight" style={{ color: color }}>
                {candidatesCount} জন
              </p>
            </div>
          </div>
        )}

        {/* View Details Link */}
        <div className="pt-5 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm font-semibold text-primary group-hover:text-primary-600 transition-colors">
            <span>বিস্তারিত দেখুন</span>
            <motion.span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"
              whileHover={{ x: 3 }}
            >
              →
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
