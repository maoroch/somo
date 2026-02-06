'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Sparkles, Zap, BarChart3, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function Navbar({ isDarkMode, toggleTheme }: { isDarkMode: boolean; toggleTheme: () => void }) {
  const [showNavbar, setShowNavbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Цветовые схемы
  const colors = {
    dark: {
      text: 'text-white',
      textSecondary: 'text-slate-300',
      textTertiary: 'text-slate-400',
      glassEffect: 'bg-slate-950/40 backdrop-blur-xl border border-slate-800/50',
      hoverBg: 'hover:bg-slate-800/50',
      menuBg: 'bg-slate-950/95 backdrop-blur-lg',
      menuBorder: 'border-slate-800/30',
    },
    light: {
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textTertiary: 'text-slate-600',
      glassEffect: 'bg-white/40 backdrop-blur-xl border border-slate-200/50',
      hoverBg: 'hover:bg-slate-100/50',
      menuBg: 'bg-white/95 backdrop-blur-lg',
      menuBorder: 'border-slate-200/30',
    },
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (currentScrollY < 100) {
        setShowNavbar(true);
      } 
      else if (currentScrollY < lastScrollYRef.current) {
        setShowNavbar(true);
      } 
      else if (currentScrollY > lastScrollYRef.current) {
        setShowNavbar(false);
        setMobileMenuOpen(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 80) {
        setShowNavbar(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Закрытие меню при клике на ссылку
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Features', href: '#features', icon: Sparkles },
    { label: 'How It Works', href: '#how-it-works', icon: Zap },
    { label: 'Pricing', href: '#pricing', icon: BarChart3 },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src={isDarkMode ? '/logo-dark.svg' : '/logo-light.svg'}
              alt="Somo Logo"
              width={80}
              height={40}
              className="object-contain transition-opacity duration-300"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-full ${currentColors.glassEffect}`}>
            {navLinks.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`group px-4 py-2 rounded-lg text-sm ${currentColors.textSecondary} transition-all flex items-center gap-2 ${currentColors.hoverBg}`}
                >
                  <IconComponent className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{color: '#4D4AFF'}} />
                  <span className={`group-hover:${isDarkMode ? 'text-white' : 'text-slate-900'} transition-colors`}>
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className={`cursor-pointer p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-slate-900/50 hover:bg-slate-800' 
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label="Toggle theme"
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* CTA Button - Desktop Only */}
            <Link href="/sign-up">
              <button 
                className="cursor-pointer group relative px-8 py-2.5 rounded-full text-sm font-semibold text-white overflow-hidden hidden sm:inline-flex items-center gap-2.5"
                style={{
                  background: 'linear-gradient(135deg, #4D4AFF 0%, #0300BA 100%)',
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, #0300BA 0%, #4D4AFF 100%)',
                  }}
                ></div>

                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shimmer 3s infinite'
                  }}
                ></div>

                <div 
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg"
                  style={{
                    background: 'radial-gradient(circle, rgba(77, 74, 255, 0.4) 0%, transparent 70%)',
                  }}
                ></div>

                <div className="absolute inset-0 overflow-hidden rounded-full">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        left: `${25 + i * 20}%`,
                        top: '20%',
                        animation: `float-up 1.5s ease-out forwards`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    ></div>
                  ))}
                </div>

                <div 
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 20px rgba(77, 74, 255, 0.6), inset 0 0 20px rgba(77, 74, 255, 0.1)',
                    animation: 'pulse-glow 2s ease-in-out infinite'
                  }}
                ></div>

                <span className="relative z-10 flex items-center gap-2.5">
                  Get Started
                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                </span>
              </button>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all ${currentColors.hoverBg}`}
              style={{background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)'}}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-16 left-0 right-0 transition-all duration-300 ease-out ${
            mobileMenuOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          {/* Overlay */}
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
          )}

          {/* Menu Content */}
          <div className={`relative z-50 m-4 rounded-2xl border overflow-hidden ${currentColors.menuBg} ${currentColors.menuBorder}`}>
            <div className="max-w-sm mx-auto px-6 py-6 space-y-3">
              {/* Navigation Links */}
              {navLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentColors.hoverBg}`}
                    style={{
                      background: isDarkMode 
                        ? 'rgba(77, 74, 255, 0.05)' 
                        : 'rgba(77, 74, 255, 0.03)'
                    }}
                  >
                    <IconComponent 
                      className="w-5 h-5 transition-transform group-hover:scale-110" 
                      style={{color: '#4D4AFF'}} 
                    />
                    <span className={`font-medium ${currentColors.text}`}>
                      {item.label}
                    </span>
                    <ChevronRight 
                      className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100" 
                      style={{color: '#4D4AFF'}}
                    />
                  </a>
                );
              })}

              {/* Divider */}
              <div 
                className="my-2 h-px"
                style={{background: isDarkMode ? 'rgba(148, 163, 184, 0.1)' : 'rgba(30, 41, 59, 0.1)'}}
              ></div>

              {/* CTA Button */}
              <Link href="/sign-up" onClick={handleNavClick}>
                <button 
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden relative group"
                  style={{
                    background: 'linear-gradient(135deg, #4D4AFF 0%, #0300BA 100%)',
                  }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #0300BA 0%, #4D4AFF 100%)',
                    }}
                  ></div>

                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started Free
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>

              {/* Info Text */}
              <p className={`text-center text-xs ${currentColors.textTertiary} pt-2`}>
                ✓ No credit card required • ✓ 10 free videos
              </p>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-0 md:h-16"></div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(77, 74, 255, 0.6), inset 0 0 20px rgba(77, 74, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(77, 74, 255, 0.8), inset 0 0 20px rgba(77, 74, 255, 0.2);
          }
        }
      `}</style>
    </>
  );
}