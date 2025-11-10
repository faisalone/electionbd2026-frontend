'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'হোম' },
  { href: '/division/dhaka', label: 'আসনসমূহ' },
  { href: '#parties', label: 'দলসমূহ' },
  { href: '#candidates', label: 'প্রার্থী' },
  { href: '/poll', label: 'পোল' },
  { href: '/news', label: 'খবর' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isNewsPage = pathname?.startsWith('/news');

  // Hide default navbar on news pages
  if (isNewsPage) {
    return null;
  }

  return (
    <nav className="sticky top-4 z-50 px-4 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/40 backdrop-saturate-150">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo - Left */}
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <Logo height={40} className="hover:scale-105 transition-transform" alt="ভোটমামু" />
              </Link>

              {/* Desktop Navigation - Center */}
              <div className="hidden lg:flex items-center gap-2 flex-1 justify-center mx-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-5 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm text-gray-700 hover:bg-gray-100 hover:scale-105"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Generate Button - Right */}
              <div className="hidden lg:flex items-center shrink-0">
                <Link href="/generate">
                  <button className="flex items-center gap-2 bg-[#C8102E] text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm">
                    <Sparkles size={16} />
                    জেনারেট
                  </button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center gap-2">
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

        {/* Google-style Dropdown - Mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 8, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
              className="lg:hidden absolute left-0 right-0 px-4"
            >
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] border border-white/40 backdrop-saturate-150 overflow-hidden">
                <div className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-gray-700 hover:bg-gray-100 active:bg-gray-200 font-medium transition-all py-3 px-4 rounded-xl text-sm"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
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
