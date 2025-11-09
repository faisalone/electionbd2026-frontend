'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface PartyCardProps {
  name: string;
  symbol: string;
  color: string;
  founded: string;
  candidatesCount?: number;
}

export default function PartyCard({
  name,
  symbol,
  color,
  founded,
  candidatesCount = 0,
}: PartyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.05 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100"
    >
      {/* Party Color Bar */}
      <div className="h-4" style={{ backgroundColor: color }} />

      <div className="p-6">
        {/* Symbol */}
        <div className="flex justify-center mb-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: `${color}20` }}
          >
            {symbol}
          </div>
        </div>

        {/* Party Name */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          {name}
        </h3>

        {/* Founded Year */}
        <p className="text-sm text-gray-600 text-center mb-4">
          প্রতিষ্ঠা: {founded}
        </p>

        {/* Candidates Count */}
        {candidatesCount > 0 && (
          <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl py-2 px-4">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {candidatesCount} জন প্রার্থী
            </span>
          </div>
        )}

        {/* View Details Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: color }}
        >
          বিস্তারিত দেখুন
        </motion.button>
      </div>
    </motion.div>
  );
}
