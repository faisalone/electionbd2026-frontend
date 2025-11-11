'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsNavbarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function NewsNavbar({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: NewsNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-4 z-50 px-4 mb-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Navbar Container */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/40 backdrop-saturate-150">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo - Left */}
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <Logo height={40} className="hover:scale-105 transition-transform" alt="ভোটমামু" />
              </Link>

              {/* Desktop Categories - Center */}
              <div className="hidden md:flex items-center gap-1.5 flex-1 justify-center mx-8">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`px-5 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm ${
                      selectedCategory === category
                        ? 'bg-[#C8102E] text-white shadow-lg scale-105'
                        : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Generate Button - Right (Desktop) */}
              <div className="hidden md:flex items-center shrink-0">
                <Link href="/generate">
                  <button className="flex items-center gap-2 bg-[#C8102E] text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm">
                    <Sparkles size={16} />
                    জেনারেট
                  </button>
                </Link>
              </div>

              {/* Mobile: Menu Button & Generate */}
              <div className="md:hidden flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-700 hover:text-[#C8102E] transition-colors p-2"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                
                <Link href="/generate">
                  <button className="p-2 bg-[#C8102E] text-white rounded-full hover:bg-red-700 transition-colors">
                    <Sparkles size={16} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Google-style Dropdown - Mobile (Expands below with same width) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 8, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
              className="md:hidden absolute left-0 right-0 px-4"
            >
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] border border-white/40 backdrop-saturate-150 overflow-hidden">
                <div className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {categories.map((category, index) => (
                      <motion.button
                        key={category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => {
                          onCategoryChange(category);
                          setIsOpen(false);
                        }}
                        className={`text-left font-medium transition-all py-3 px-4 rounded-xl text-sm ${
                          selectedCategory === category
                            ? 'bg-[#C8102E] text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
