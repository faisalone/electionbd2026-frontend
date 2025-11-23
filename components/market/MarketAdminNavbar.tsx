'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  PlusCircle,
  Users,
  BarChart3,
  LogOut,
  Download,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useMarketAuth } from '@/lib/market-auth-context';
import Logo from '@/components/Logo';
import Image from 'next/image';

export default function MarketAdminNavbar() {
  const { user, logout } = useMarketAuth();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  const navLinks = [
    {
      href: '/market/dashboard',
      label: 'ড্যাশবোর্ড',
      icon: LayoutDashboard,
      show: true
    },
    {
      href: '/market/dashboard/products',
      label: isSuperAdmin ? 'সকল ডিজাইন' : 'আমার ডিজাইন',
      icon: Package,
      show: true
    },
    {
      href: '/market/dashboard/orders',
      label: 'অর্ডার',
      icon: ShoppingBag,
      show: true
    },
    {
      href: '/market/dashboard/downloads',
      label: 'ডাউনলোড',
      icon: Download,
      show: true
    },
    {
      href: '/market/dashboard/creators',
      label: 'ক্রিয়েটর',
      icon: Users,
      show: isSuperAdmin
    },
    {
      href: '/market/dashboard/reports',
      label: 'রিপোর্ট',
      icon: BarChart3,
      show: isSuperAdmin
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/market/login';
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const path = url.startsWith('/') ? url : `/storage/${url}`;
    return `${API_BASE_URL.replace('/api/v1', '')}${path}`;
  };

  const avatarUrl = user?.creator_profile?.avatar || user?.avatar;

  return (
    <nav className="sticky top-4 z-50 px-4 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/40 backdrop-saturate-150">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo - Left */}
              <Link href="/market" className="flex items-center gap-2 shrink-0">
                <Logo height={40} className="hover:scale-105 transition-transform" alt="ভোটমামু Market" />
              </Link>

              {/* Navigation - Center (Desktop only) */}
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-8">
                {navLinks.filter(link => link.show).map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== '/market/dashboard' && pathname?.startsWith(link.href));
                  
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
                <div
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                  className="relative"
                >
                  <button className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-white/50 transition-all group">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-md group-hover:ring-[#C8102E]/20 transition-all">
                      {avatarUrl && getImageUrl(avatarUrl) ? (
                        <Image
                          src={getImageUrl(avatarUrl)}
                          alt={user?.name || 'Profile'}
                          fill
                          className="object-cover"
                          unoptimized={avatarUrl.startsWith('data:')}
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-[#C8102E] to-[#A00D24] flex items-center justify-center text-white font-semibold text-lg">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Desktop Dropdown - Google Style */}
                  {showDropdown && (
                    <div className="absolute right-0 top-full pt-2">
                      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100 shrink-0">
                              {avatarUrl && getImageUrl(avatarUrl) ? (
                                <Image
                                  src={getImageUrl(avatarUrl)}
                                  alt={user?.name || 'Profile'}
                                  fill
                                  className="object-cover"
                                  unoptimized={avatarUrl.startsWith('data:')}
                                />
                              ) : (
                                <div className="w-full h-full bg-linear-to-br from-[#C8102E] to-[#A00D24] flex items-center justify-center text-white font-semibold text-xl">
                                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user?.phone_number}</p>
                              {user?.creator_profile?.username && (
                                <p className="text-xs text-[#C8102E] font-medium">@{user.creator_profile.username}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="py-2">
                          <Link 
                            href="/market/dashboard/settings"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#C8102E] transition-colors"
                          >
                            <Settings size={18} />
                            <span className="font-medium">সেটিংস</span>
                          </Link>
                          
                          <div className="my-2 border-t border-gray-100"></div>
                          
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={18} />
                            <span className="font-medium">লগআউট</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-full hover:bg-white/50 transition-all"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="lg:hidden mt-2 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 overflow-hidden">
            {/* Profile Section */}
            <div className="p-4 border-b border-gray-100/50 bg-linear-to-r from-gray-50/50 to-white/50">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md shrink-0">
                  {avatarUrl && getImageUrl(avatarUrl) ? (
                    <Image
                      src={getImageUrl(avatarUrl)}
                      alt={user?.name || 'Profile'}
                      fill
                      className="object-cover"
                      unoptimized={avatarUrl.startsWith('data:')}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-[#C8102E] to-[#A00D24] flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{user?.name}</div>
                  <div className="text-sm text-gray-500">{user?.phone_number}</div>
                  {user?.creator_profile?.username && (
                    <div className="text-xs text-[#C8102E] font-medium">@{user.creator_profile.username}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-2">
              {navLinks.filter(link => link.show).map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/market/dashboard' && pathname?.startsWith(link.href));
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setShowMobileMenu(false)}
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

              {/* Settings Link */}
              <Link 
                href="/market/dashboard/settings"
                onClick={() => setShowMobileMenu(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all mb-1
                  ${pathname === '/market/dashboard/settings'
                    ? 'bg-[#C8102E]/10 text-[#C8102E]' 
                    : 'text-gray-700 hover:bg-gray-50/70'
                  }
                `}
              >
                <Settings size={20} />
                <span>সেটিংস</span>
              </Link>
            </div>

            {/* Logout Button */}
            <div className="p-2 border-t border-gray-100/50">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50/70 transition-all font-medium"
              >
                <LogOut size={20} />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
