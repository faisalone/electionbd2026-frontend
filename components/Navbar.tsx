'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles } from 'lucide-react';

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

  // Hide navbar on news pages
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
                <div className="text-lg md:text-xl font-bold text-[#C8102E] hover:scale-105 transition-transform whitespace-nowrap">
                  বাংলা নির্বাচন পোর্টাল
                </div>
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
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden text-gray-700 hover:text-[#C8102E] transition-colors p-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
              <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-gray-700 hover:bg-gray-100 hover:text-[#C8102E] font-medium transition-all py-2 px-4 rounded-full text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/generate" onClick={() => setIsOpen(false)}>
                    <button className="flex items-center gap-2 bg-[#C8102E] text-white px-6 py-2 rounded-full font-medium w-full justify-center hover:bg-red-700 transition-colors mt-2 text-sm">
                      <Sparkles size={16} />
                      জেনারেট
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
