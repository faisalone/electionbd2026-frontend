'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { useAdmin } from '@/lib/admin/context';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Award, 
  FileText, 
  BarChart3,
  Newspaper,
  LogOut,
  Menu,
  X,
  UserCircle,
  Hash
} from 'lucide-react';
import { useState } from 'react';
import { logout as logoutApi } from '@/lib/admin/api';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/locations', label: 'Locations', icon: MapPin },
  { href: '/admin/parties', label: 'Parties', icon: Award },
  { href: '/admin/candidates', label: 'Candidates', icon: Users },
  { href: '/admin/symbols', label: 'Symbols', icon: Hash },
  { href: '/admin/polls', label: 'Polls', icon: BarChart3 },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/timeline', label: 'Timeline', icon: FileText },
];

export default function AdminNavbar() {
  const { admin, token, logout } = useAdmin();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (token) {
      await logoutApi(token);
    }
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <nav className="sticky top-4 z-50 px-4 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/40 backdrop-saturate-150">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo - Left */}
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <Logo height={40} className="hover:scale-105 transition-transform" alt="ভোটমামু Admin" />
              </Link>

              {/* Navigation - Center (Desktop only) */}
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-8">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== '/admin' && pathname?.startsWith(link.href));
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm
                        ${isActive 
                          ? 'bg-[#C8102E]/10 text-[#C8102E]' 
                          : 'text-gray-700 hover:bg-white/50 hover:scale-105'
                        }
                      `}
                    >
                      <Icon size={16} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Profile - Right */}
              <div className="hidden lg:block relative shrink-0">
                <button
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                  className="flex items-center gap-2 transition-all"
                >
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#C8102E] to-[#A00D24] flex items-center justify-center text-white font-semibold shadow-md hover:scale-110 transition-transform">
                    {admin?.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Desktop Dropdown */}
                {showDropdown && (
                  <div 
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                    className="absolute right-0 top-full mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100/50">
                      <div className="font-semibold text-gray-800">{admin?.name}</div>
                      <div className="text-sm text-gray-500">{admin?.phone_number}</div>
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-2xl text-red-600 hover:bg-red-50/70 transition-all"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-white/50 transition-all"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 overflow-hidden">
            {/* Profile Section */}
            <div className="p-4 border-b border-gray-100/50 bg-linear-to-r from-gray-50/50 to-white/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#C8102E] to-[#A00D24] flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {admin?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{admin?.name}</div>
                  <div className="text-sm text-gray-500">{admin?.phone_number}</div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/admin' && pathname?.startsWith(link.href));
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all mb-1
                      ${isActive 
                        ? 'bg-[#C8102E]/10 text-[#C8102E]' 
                        : 'text-gray-700 hover:bg-gray-50/70'
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="p-2 border-t border-gray-100/50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50/70 transition-all font-medium"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
