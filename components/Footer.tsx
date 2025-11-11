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
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="mb-4">
              <Logo height={48} alt="ভোটমামু" />
            </div>
            <p className="text-gray-400">
              বাংলাদেশের সবচেয়ে বিশ্বস্ত নির্বাচন তথ্য পোর্টাল
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  হোম
                </a>
              </li>
              <li>
                <a href="#poll" className="hover:text-white transition-colors">
                  পোল
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-white transition-colors">
                  খবর
                </a>
              </li>
            </ul>
          </div>

          {/* Election Info */}
          <div>
            <h4 className="font-bold mb-4">নির্বাচন তথ্য</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  আসনসমূহ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  প্রার্থী তালিকা
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  দলসমূহ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">যোগাযোগ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>ইমেইল: info@electionbd.com</li>
              <li>ফোন: +৮৮০ ১২৩৪৫৬৭৮৯</li>
              <li>ঠিকানা: ঢাকা, বাংলাদেশ</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© ২০২৫ ভোটমামু। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-xs mt-2 text-gray-500">Version 1.0.1</p>
        </div>
      </div>
    </footer>
  );
}
