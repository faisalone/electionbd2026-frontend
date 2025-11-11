'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { getImageUrl } from '@/lib/admin/api';

interface CandidateCardProps {
  id: string;
  name: string;
  partyName: string;
  partySymbol: string | { image: string; symbol_name: string };
  partySymbolName: string;
  partyColor: string;
  seatName: string;
  age: number;
  education: string;
  experience: string;
  image: string;
}

export default function CandidateCard({
  id,
  name,
  partyName,
  partySymbol,
  partySymbolName,
  partyColor,
  seatName,
}: CandidateCardProps) {
  // Get first letter of name for avatar
  const firstLetter = name.charAt(0).toUpperCase();
  
  // Extract symbol image if it's an object
  const symbolImage = typeof partySymbol === 'object' && partySymbol?.image 
    ? getImageUrl(partySymbol.image) 
    : null;
  const symbolText = typeof partySymbol === 'string' ? partySymbol : null;
  
  // Generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', 
      '#10b981', '#06b6d4', '#6366f1', '#f97316'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarBgColor = getAvatarColor(name);

  return (
    <Link href={`/candidate/${id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300"
      >
        <div className="p-6">
          {/* Header: Avatar + Name + Seat */}
          <div className="flex items-start gap-4 mb-6 pb-5 border-b border-gray-100">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-md"
              style={{ backgroundColor: avatarBgColor }}
            >
              {firstLetter}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1.5 leading-tight">
                {name}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{seatName}</span>
              </p>
            </div>
          </div>

          {/* Symbol Section - Large & Prominent */}
          <div className="mb-5">
            <div 
              className="relative rounded-2xl p-8 text-center overflow-hidden"
              style={{ 
                backgroundColor: `${partyColor}08`,
                border: `2px solid ${partyColor}20`
              }}
            >
              {/* Decorative gradient background */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at 30% 50%, ${partyColor}, transparent 70%)`
                }}
              />
              
              <div className="relative">
                {symbolImage ? (
                  <div className="mb-4 flex justify-center">
                    <img 
                      src={symbolImage} 
                      alt={partySymbolName}
                      className="w-32 h-32 object-contain transform group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="text-8xl mb-4 leading-none inline-block transform group-hover:scale-110 transition-transform duration-300">
                    {symbolText || '🏛️'}
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">মার্কা</p>
                  <p className="text-xl font-bold leading-tight" style={{ color: partyColor }}>
                    {partySymbolName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Party Name */}
          <div 
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: `${partyColor}05` }}
          >
            <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">দল</p>
            <p className="text-base font-bold leading-tight" style={{ color: partyColor }}>
              {partyName}
            </p>
          </div>

          {/* View Details Link */}
          <div className="mt-6 pt-5 border-t border-gray-100">
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
    </Link>
  );
}
