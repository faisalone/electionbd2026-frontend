'use client';

import { motion } from 'framer-motion';
import { Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/admin/api';
import { toBengaliNumber } from '@/lib/utils';

interface PartyCardProps {
  id: number;
  name: string;
  symbol: string | { id: number; symbol_name: string; image: string } | null | undefined;
  logo?: string | null;
  color: string;
  founded: string;
  candidatesCount?: number;
}

export default function PartyCard({
  id,
  name,
  symbol,
  logo,
  color,
  founded,
  candidatesCount = 0,
}: PartyCardProps) {
  // Get first letter for fallback avatar
  const firstLetter = name.charAt(0).toUpperCase();
  
  // Extract symbol data
  const symbolData = typeof symbol === 'object' && symbol ? symbol : null;

  return (
    <Link href={`/party/${id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="group border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 bg-linear-to-br from-gray-50/50 to-white/80 h-full"
      >
        <div className="p-4">
          {/* Party Logo - Compact */}
          <div className="mb-3">
              {logo ? (
                <div className="flex justify-center">
                  <img 
                    src={getImageUrl(logo)} 
                    alt={name}
                    className="w-16 h-16 object-contain transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div 
                  className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md transform group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: color }}
                >
                  {firstLetter}
                </div>
              )}
          </div>

          {/* মার্কা (Symbol) - Compact */}
          {symbolData && (
            <div className="mb-3 flex items-center justify-center gap-1.5">
              {symbolData.image && (
                <img 
                  src={getImageUrl(symbolData.image)} 
                  alt={symbolData.symbol_name}
                  className="w-4 h-4 object-contain"
                />
              )}
              <span className="text-xs font-medium text-gray-600">{symbolData.symbol_name}</span>
            </div>
          )}

          {/* Party Name */}
          <div className="mb-3">
            <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors mb-1 text-center leading-tight line-clamp-2">
              {name}
            </h3>
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{founded}</span>
            </p>
          </div>

          {/* Candidates Count */}
          {candidatesCount > 0 && (
            <div 
              className="rounded-lg p-2 text-center"
              style={{ backgroundColor: `${color}05` }}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Users className="w-4 h-4" style={{ color: color }} />
                <p className="text-sm font-bold" style={{ color: color }}>
                  {toBengaliNumber(candidatesCount)} জন
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
