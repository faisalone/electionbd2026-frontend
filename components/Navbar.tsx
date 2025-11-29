'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, LogIn, Home, BarChart3, Users, Briefcase, Newspaper, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMarketAuth } from '@/lib/market-auth-context';

const navLinks = [
  { href: '/', label: 'হোম', icon: Home },
  { href: '/#poll', label: 'জরিপ', icon: BarChart3 },
  { href: '/#divisions', label: 'আসন ও প্রার্থী', icon: Users },
  { href: '/#parties', label: 'দলসমূহ', icon: Briefcase },
  { href: '/news', label: 'খবর', icon: Newspaper },
//   { href: '/generate', label: 'পোস্টার তৈরি', icon: ImagePlus },
];

const marketNavLinks = [
  { href: '/market', label: 'মার্কেট', icon: ImagePlus },
  { href: '/market/creators', label: 'সকল ক্রিয়েটর', icon: Users },
  { href: '/market/about', label: 'আমাদের সম্পর্কে', icon: Briefcase },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const { user, logout } = useMarketAuth();

  // Track active section on home page
  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['poll', 'divisions', 'parties'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            return;
          }
        }
      }
      setActiveSection('');
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);
  
  const isNewsPage = pathname?.startsWith('/news');
  const isAdminPage = pathname?.startsWith('/admin');
  const isMarketDashboard = pathname?.startsWith('/market/dashboard');
  const isMarketPage = pathname?.startsWith('/market');

  // Hide default navbar on news pages, admin pages, and market dashboard
  if (isNewsPage || isAdminPage || isMarketDashboard) {
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
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-8">
                {(isMarketPage ? marketNavLinks : navLinks).map((link) => {
                  const Icon = link.icon;
                  // Check if active based on pathname and section
                  let isActive = false;
                  if (isMarketPage) {
                    isActive = pathname === link.href || (link.href !== '/market' && pathname?.startsWith(link.href));
                  } else {
                    if (link.href === '/') {
                      isActive = pathname === '/' && !activeSection;
                    } else if (link.href.startsWith('/#')) {
                      const section = link.href.substring(2);
                      isActive = pathname === '/' && activeSection === section;
                    } else {
                      isActive = pathname?.startsWith(link.href);
                    }
                  }
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm cursor-pointer
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

              {/* Right Section - Market/Login/Avatar */}
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                {!isMarketPage && (
                  <Link href="/market">
                    <button className="flex items-center gap-2 bg-[#C8102E] text-white px-5 py-2 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm">
                      <Sparkles size={16} />
                      <span>মার্কেট</span>
                    </button>
                  </Link>
                )}
                
                {isMarketPage && !user && (
                  <Link href="/market/login">
                    <button className="flex items-center justify-center p-2 text-[#C8102E] hover:bg-[#C8102E]/10 rounded-full transition-all cursor-pointer">
                      <LogIn size={20} />
                    </button>
                  </Link>
                )}

                {isMarketPage && user && (
                  <div className="relative">
                    <div
                      onMouseEnter={() => setIsProfileOpen(true)}
                      onMouseLeave={() => setIsProfileOpen(false)}
                      className="relative"
                    >
                      <button className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-white/50 transition-all group">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-md group-hover:ring-[#C8102E]/20 transition-all">
                          {user.avatar ? (
                            <img 
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${user.avatar}`}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </button>

                      {isProfileOpen && (
                        <div className="absolute right-0 top-full pt-2">
                          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User Info Header */}
                            <div className="px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100 shrink-0">
                                  {user.avatar ? (
                                    <img 
                                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${user.avatar}`}
                                      alt={user.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xl">
                                      {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{user.phone_number}</p>
                                </div>
                              </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-2">
                              <Link href="/market/dashboard">
                                <button
                                  onClick={() => setIsProfileOpen(false)}
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                  ড্যাশবোর্ড
                                </button>
                              </Link>
                              
                              <div className="my-2 border-t border-gray-100"></div>
                              
                              <button
                                onClick={() => {
                                  logout();
                                  setIsProfileOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                              >
                                লগআউট
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden flex items-center gap-2">
                {!isMarketPage && (
                  <Link href="/market">
                    <button className="flex items-center gap-1.5 bg-[#C8102E] text-white px-3 py-1.5 rounded-full font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs max-[360px]:p-2">
                      <Sparkles size={14} />
                      <span className="max-[360px]:hidden">মার্কেট</span>
                    </button>
                  </Link>
                )}

                {isMarketPage && !user && (
                  <Link href="/market/login">
                    <button className="flex items-center justify-center p-2 text-[#C8102E] hover:bg-[#C8102E]/10 rounded-full transition-all cursor-pointer">
                      <LogIn size={18} />
                    </button>
                  </Link>
                )}

                {isMarketPage && user && (
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="bg-white/80 backdrop-blur-sm border border-gray-200 p-1 rounded-full transition-all"
                  >
                    {user.avatar ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${user.avatar}`}
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                )}
                
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
                {/* Mobile Profile Section - Only show when on market page and logged in */}
                {isMarketPage && user && (
                  <div className="p-4 border-b border-gray-100/50 bg-linear-to-r from-gray-50/50 to-white/50">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md shrink-0">
                        {user.avatar ? (
                          <img 
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${user.avatar}`}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.phone_number}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {(isMarketPage ? marketNavLinks : navLinks).map((link, index) => {
                      const Icon = link.icon;
                      // Check if active based on pathname and section
                      let isActive = false;
                      if (isMarketPage) {
                        isActive = pathname === link.href || (link.href !== '/market' && pathname?.startsWith(link.href));
                      } else {
                        if (link.href === '/') {
                          isActive = pathname === '/' && !activeSection;
                        } else if (link.href.startsWith('/#')) {
                          const section = link.href.substring(2);
                          isActive = pathname === '/' && activeSection === section;
                        } else {
                          isActive = pathname?.startsWith(link.href);
                        }
                      }
                      
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`
                              flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm cursor-pointer
                              ${isActive 
                                ? 'bg-[#C8102E]/10 text-[#C8102E]' 
                                : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                              }
                            `}
                          >
                            <Icon size={18} />
                            <span>{link.label}</span>
                          </Link>
                        </motion.div>
                      );
                    })}

                    {/* Mobile Profile Dropdown - Only show when on market page and logged in */}
                    {isMarketPage && user && (
                      <>
                        <div className="border-t border-gray-100 my-2"></div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: navLinks.length * 0.03 }}
                        >
                          <Link href="/market/dashboard">
                            <button
                              onClick={() => {
                                setIsOpen(false);
                                setIsProfileOpen(false);
                              }}
                              className="w-full text-left block text-gray-700 hover:bg-gray-100 active:bg-gray-200 font-medium transition-all py-3 px-4 rounded-xl text-sm"
                            >
                              ড্যাশবোর্ড
                            </button>
                          </Link>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (navLinks.length + 1) * 0.03 }}
                        >
                          <button
                            onClick={() => {
                              logout();
                              setIsOpen(false);
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left block text-red-600 hover:bg-red-50 active:bg-red-100 font-medium transition-all py-3 px-4 rounded-xl text-sm"
                          >
                            লগআউট
                          </button>
                        </motion.div>
                      </>
                    )}
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
