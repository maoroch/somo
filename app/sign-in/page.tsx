'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Moon, Sun, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Утилиты для работы с темой
const THEME_STORAGE_KEY = 'somo-theme-preference';

type Theme = 'dark' | 'light';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';
  
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (error) {
    console.warn('Failed to read theme:', error);
  }
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const saveTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme:', error);
  }
};

export default function SignInPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Инициализация темы при монтировании
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setIsDarkMode(initialTheme === 'dark');
    setIsLoaded(true);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    saveTheme(newIsDark ? 'dark' : 'light');
  };

  // Цветовые схемы
  const colors = {
    dark: {
      bg: 'from-slate-950 via-slate-900 to-slate-950',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      textTertiary: 'text-slate-400',
    },
    light: {
      bg: 'from-white via-slate-50 to-white',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textTertiary: 'text-slate-600',
    },
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Welcome back!');
    }, 1500);
  };

  // Избегаем мерцания при первой загрузке
  if (!isLoaded) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${currentColors.bg}`}></div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentColors.bg} ${currentColors.text} overflow-hidden transition-colors duration-500 flex flex-col`}>
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl top-0 left-0 animate-blob transition-all duration-500" 
          style={{background: isDarkMode ? 'rgba(77, 74, 255, 0.2)' : 'rgba(77, 74, 255, 0.1)'}}
        ></div>
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl bottom-0 right-0 animate-blob animation-delay-2000 transition-all duration-500" 
          style={{background: isDarkMode ? 'rgba(3, 0, 186, 0.2)' : 'rgba(3, 0, 186, 0.1)'}}
        ></div>
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl top-1/2 left-1/2 animate-blob animation-delay-4000 transition-all duration-500" 
          style={{background: isDarkMode ? 'rgba(77, 74, 255, 0.15)' : 'rgba(77, 74, 255, 0.05)', transform: 'translate(-50%, -50%)'}}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-50 py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src={isDarkMode ? "/logo-dark.svg" : "/logo-light.svg"}
              alt="Somo Logo"
              width={80}
              height={20}
              className="object-contain"
            />
          </Link>

          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-slate-900/50 hover:bg-slate-800' : 'bg-slate-200 hover:bg-slate-300'} hover:scale-110`}
            aria-label="Toggle theme"
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div 
            className="rounded-2xl border backdrop-blur-xl p-8 md:p-10 transition-all duration-500 animate-fade-in"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.5))' 
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5))',
              borderColor: isDarkMode ? 'rgba(77, 74, 255, 0.2)' : 'rgba(77, 74, 255, 0.15)',
              boxShadow: isDarkMode 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 40px rgba(77, 74, 255, 0.1)' 
                : '0 25px 50px -12px rgba(0, 0, 0, 0.05), 0 0 40px rgba(77, 74, 255, 0.05)',
            }}
          >
            {/* Icon and Title */}
            <div className="text-center mb-10 animate-fade-in animation-delay-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5" style={{background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'}}>
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className={`text-3xl font-black mb-2 ${currentColors.text}`}>Welcome Back</h1>
              <p className={`text-sm ${currentColors.textTertiary}`}>Sign in to your account and continue creating amazing videos</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-4 animate-fade-in animation-delay-200">
              {/* Email Input */}
              <div className="space-y-2.5">
                <label htmlFor="email" className={`text-xs font-semibold uppercase tracking-wider ${currentColors.textSecondary}`}>
                  Email
                </label>
                <div className="relative group">
                  <div 
                    className="absolute inset-0 rounded-lg transition-all duration-300 opacity-0 group-focus-within:opacity-100 pointer-events-none"
                    style={{background: 'linear-gradient(135deg, rgba(77, 74, 255, 0.2), rgba(3, 0, 186, 0.2))'}}
                  ></div>
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400 pointer-events-none transition-colors duration-300 group-focus-within:text-blue-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={`relative w-full pl-12 pr-4 py-3 rounded-lg backdrop-blur-sm border-2 transition-all duration-300 outline-none ${
                      isDarkMode 
                        ? 'bg-slate-900/30 border-slate-700/50 text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-900/50' 
                        : 'bg-white/30 border-slate-300/50 text-slate-900 placeholder-slate-500 focus:border-blue-400 focus:bg-white/50'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className={`text-xs font-semibold uppercase tracking-wider ${currentColors.textSecondary}`}>
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div 
                    className="absolute inset-0 rounded-lg transition-all duration-300 opacity-0 group-focus-within:opacity-100 pointer-events-none"
                    style={{background: 'linear-gradient(135deg, rgba(77, 74, 255, 0.2), rgba(3, 0, 186, 0.2))'}}
                  ></div>
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 pointer-events-none transition-colors duration-300 group-focus-within:text-blue-500" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`relative w-full pl-12 pr-12 py-3 rounded-lg backdrop-blur-sm border-2 transition-all duration-300 outline-none ${
                      isDarkMode 
                        ? 'bg-slate-900/30 border-slate-700/50 text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-900/50' 
                        : 'bg-white/30 border-slate-300/50 text-slate-900 placeholder-slate-500 focus:border-blue-400 focus:bg-white/50'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-4 ${currentColors.textTertiary} hover:${isDarkMode ? 'text-white' : 'text-slate-900'} transition-colors`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-2xl disabled:opacity-70 mt-8 text-base relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                  boxShadow: '0 10px 30px rgba(77, 74, 255, 0.3)',
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'linear-gradient(135deg, #0300BA, #4D4AFF)'}}></div>
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="relative">Sign In</span>
                    <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px" style={{background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}}></div>
              <span className={`text-xs ${currentColors.textTertiary}`}>Or</span>
              <div className="flex-1 h-px" style={{background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}}></div>
            </div>

            {/* Social Sign In */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`py-2.5 rounded-lg border-2 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95`}
                style={{
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <span className="text-lg">Google</span>
              </button>
              <button
                type="button"
                className={`py-2.5 rounded-lg border-2 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95`}
                style={{
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <span className="text-lg">GitHub</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className={`text-center mt-8 text-sm ${currentColors.textTertiary}`}>
              Don't have an account?{' '}
              <Link href="/sign-up" className="font-bold text-blue-500 hover:text-blue-600 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>

          {/* Bottom Info */}
          <div className="mt-8 text-center animate-fade-in animation-delay-400">
            <p className={`text-xs ${currentColors.textTertiary}`}>
              Protected by enterprise-grade security • <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}