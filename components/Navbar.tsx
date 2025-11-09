'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'হোম' },
  { href: '/division/dhaka', label: 'আসনসমূহ' },
  { href: '#parties', label: 'দলসমূহ' },
  { href: '#candidates', label: 'প্রার্থী' },
  { href: '#poll', label: 'পোল' },
  { href: '#news', label: 'খবর' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-[#C8102E] hover:scale-105 transition-transform">
              বাংলা নির্বাচন পোর্টাল
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-[#C8102E] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/generate">
              <button className="flex items-center gap-2 bg-[#C8102E] text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <Sparkles size={18} />
                জেনারেট
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-[#C8102E] transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-[#C8102E] font-medium transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/generate" onClick={() => setIsOpen(false)}>
                <button className="flex items-center gap-2 bg-[#C8102E] text-white px-6 py-2 rounded-full font-medium w-full justify-center hover:bg-red-700 transition-colors">
                  <Sparkles size={18} />
                  জেনারেট
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
