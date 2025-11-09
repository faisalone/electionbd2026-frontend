'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Image as ImageIcon, Type, Palette } from 'lucide-react';
import { partiesData, designTemplates } from '@/lib/mockData';

export default function BannerDesigner() {
  const [selectedType, setSelectedType] = useState('banner');
  const [selectedParty, setSelectedParty] = useState(partiesData[0]);
  const [slogan, setSlogan] = useState('আপনার নির্বাচনী স্লোগান লিখুন');

  const handleDownload = () => {
    alert('ডাউনলোড শুরু হচ্ছে... (এটি একটি ডেমো ফিচার)');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Control Panel */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          {/* Type Selection */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <ImageIcon className="w-4 h-4" />
              ডিজাইন টাইপ নির্বাচন করুন
            </label>
            <div className="grid grid-cols-3 gap-3">
              {designTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedType(template.type)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    selectedType === template.type
                      ? 'bg-[#C8102E] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Party Selection */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Palette className="w-4 h-4" />
              রাজনৈতিক দল নির্বাচন করুন
            </label>
            <select
              value={selectedParty.id}
              onChange={(e) => {
                const party = partiesData.find((p) => p.id === e.target.value);
                if (party) setSelectedParty(party);
              }}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#C8102E] focus:outline-none"
            >
              {partiesData.map((party) => (
                <option key={party.id} value={party.id}>
                  {party.symbol} {party.name}
                </option>
              ))}
            </select>
          </div>

          {/* Slogan Input */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Type className="w-4 h-4" />
              নির্বাচনী স্লোগান
            </label>
            <textarea
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#C8102E] focus:outline-none resize-none"
              placeholder="আপনার স্লোগান লিখুন..."
            />
          </div>

          {/* Download Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 bg-[#C8102E] text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            ডাউনলোড করুন
          </motion.button>

          {/* Info */}
          <p className="text-sm text-gray-600 text-center mt-4">
            ডিজাইনটি PNG/JPG ফরম্যাটে ডাউনলোড হবে
          </p>
        </motion.div>
      </div>

      {/* Live Preview */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          লাইভ প্রিভিউ
        </h3>

        {/* Preview Canvas */}
        <div
          className="relative aspect-video rounded-xl overflow-hidden shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${selectedParty.color}dd 0%, ${selectedParty.color}44 100%)`,
          }}
        >
          {/* Template Design */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
            {/* Symbol */}
            <motion.div
              key={selectedParty.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-8xl mb-6 drop-shadow-2xl"
            >
              {selectedParty.symbol}
            </motion.div>

            {/* Party Name */}
            <motion.h2
              key={selectedParty.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-center mb-4 drop-shadow-lg"
            >
              {selectedParty.name}
            </motion.h2>

            {/* Slogan */}
            <motion.p
              key={slogan}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-center font-medium max-w-lg drop-shadow-lg"
            >
              {slogan}
            </motion.p>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Template Info */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            টাইপ: <strong>{designTemplates.find((t) => t.type === selectedType)?.name}</strong>
          </span>
          <span>
            সাইজ: <strong>{designTemplates.find((t) => t.type === selectedType)?.dimensions}</strong>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
