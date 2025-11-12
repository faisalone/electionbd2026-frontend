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

            {/* Copyright */}
            <div className="text-center text-gray-400 text-sm space-y-1">
              <p className="font-medium">© ২০২৫ ভোটমামু। সর্বস্বত্ব সংরক্ষিত।</p>
              <p className="text-xs text-gray-500">Version 1.0.1 • Made with ❤️ in Bangladesh</p>
            </div>
          </div>
        </div>
    </footer>
  );
}
