'use client';

import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  // Hide footer on admin pages
  if (isAdminPage) {
    return null;
  }

  return (
    <footer className="mt-20 pb-0">
      <div className="relative bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-t-[40px] py-12 px-8 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8102E]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Logo */}
            <div className="flex items-center transform hover:scale-105 transition-transform duration-300">
              <Logo height={48} alt="ভোটমামু" />
            </div>

            {/* Separator */}
            <div className="w-32 h-0.5 bg-linear-to-r from-transparent via-gray-600 to-transparent"></div>

            {/* Source Information */}
            <div className="text-center">
              <p className="text-gray-400 text-xs">
                তথ্যসূত্রঃ বাংলাদেশ নির্বাচন কমিশনের ওয়েবসাইট
              </p>
            </div>

            {/* Contact Information */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@votemamu.com" className="hover:text-[#C8102E] transition-colors">
                  contact@votemamu.com
                </a>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+8801763223035" className="hover:text-[#C8102E] transition-colors">
                  ০১৭৬৩২২৩০৩৫
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-400 text-sm space-y-1">
              <p className="font-medium">© ২০২৫ ভোটমামু। সর্বস্বত্ব সংরক্ষিত।</p>
              <p className="text-xs text-gray-500">সংস্করণ ১.০.১ • ভালোবাসা দিয়ে বাংলাদেশে তৈরি</p>
            </div>
          </div>
        </div>
    </footer>
  );
}
