'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';

const navLinks = [
  { href: '/', label: 'হোম' },
  { href: '/#poll', label: 'জরিপ' },
  { href: '/#divisions', label: 'আসন ও প্রার্থী' },
  { href: '/#parties', label: 'দলসমূহ' },
  { href: '/news', label: 'খবর' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isNewsPage = pathname?.startsWith('/news');
  const isAdminPage = pathname?.startsWith('/admin');
  const isMarketPage = pathname?.startsWith('/market');
  const { getTotalItems } = useCart();

  // Hide default navbar on news pages and admin pages
  if (isNewsPage || isAdminPage) {
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
                <Logo
                  height="clamp(28px, 8vw, 40px)"
                  className="hover:scale-105 transition-transform"
                  alt="ভোটমামু"
                />
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

              {/* Market/Cart Button - Right */}
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                <Link href="/market">
                  <button className="flex items-center gap-2 bg-[#C8102E] text-white px-5 py-2 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm">
                    <Sparkles size={16} />
                    <span>মার্কেট</span>
                  </button>
                </Link>
                
                <Link href="/market/cart">
                  <button className="relative p-2.5 hover:bg-gray-50 rounded-full transition-all">
                    <ShoppingBag size={18} className="text-gray-700" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#C8102E] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center gap-2">
                <Link href="/market/cart" className="max-[360px]:hidden">
                  <button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
                    <ShoppingBag size={16} className="text-gray-700" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#C8102E] text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                </Link>
                
                <Link href="/market">
                  <button className="flex items-center gap-1.5 bg-[#C8102E] text-white px-3 py-1.5 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs max-[360px]:p-2">
                    <Sparkles size={14} />
                    <span className="max-[360px]:hidden">মার্কেট</span>
                  </button>
                </Link>
                
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-700 hover:text-[#C8102E] transition-colors p-2"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
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
