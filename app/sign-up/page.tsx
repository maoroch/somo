'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Moon, Sun, Sparkles, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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

export default function SignUpPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('Salimovilas46@gmail.com');
  const [password, setPassword] = useState('Test123!@#');
  const [confirmPassword, setConfirmPassword] = useState('Test123!@#');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Инициализация темы при монтировании
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setIsDarkMode(initialTheme === 'dark');
    setIsLoaded(true);
  }, []);

  // Очистка ошибок при изменении полей
  useEffect(() => {
    if (error) setError(null);
  }, [fullName, email, password, confirmPassword]);

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

  // Password requirements
  const requirements = [
    { label: 'At least 8 characters', check: password.length >= 8 },
    { label: 'One uppercase letter', check: /[A-Z]/.test(password) },
    { label: 'One number', check: /\d/.test(password) },
    { label: 'One special character', check: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isPasswordValid = requirements.every(r => r.check);
  const canSubmit = isPasswordValid && passwordsMatch && agreeToTerms && fullName && email;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      
      // Валидация email на клиенте
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      console.log('Attempting to sign up with:', { email, passwordLength: password.length });

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            avatar_url: ''  // Или URL, если есть
          }
        }
      });

      if (signUpError) {
        console.error('Supabase signup error details:', signUpError);
        
        if (signUpError.message.includes('User already registered')) {
          throw new Error('This email is already registered. Please sign in instead.');
        } else if (signUpError.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else {
          throw new Error(signUpError.message || 'Registration failed. Please try again.');
        }
      }

      // Показываем успех и редиректим
      setSuccess(true);

      // Проверяем, отправлено ли письмо с подтверждением
      if (data?.user && !data?.session) {
        // Email confirmation required
        setTimeout(() => {
          router.push('/sign-in?message=Check your email to confirm your account');
        }, 3000);
      } else if (data?.session) {
        // Пользователь сразу авторизован (если подтверждение отключено)
        router.push('/dashboard');
      }

    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            className="rounded-2xl border backdrop-blur-xl p-8 md:p-10 transition-all duration-500 animate-fade-in max-h-[90vh] overflow-y-auto"
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
              <h1 className={`text-3xl font-black mb-2 ${currentColors.text}`}>Get Started</h1>
              <p className={`text-sm ${currentColors.textTertiary}`}>Create your account and start creating amazing videos</p>
            </div>

            {/* Debug Info - можно удалить после отладки */}
            <div className="mb-4 p-3 rounded-lg bg-blue-950/20 border border-blue-800/30 text-blue-300 text-xs">
              <p className="font-semibold mb-1">Debug Info:</p>
              <p>Password valid: {isPasswordValid ? '✓' : '✗'}</p>
              <p>Passwords match: {passwordsMatch ? '✓' : '✗'}</p>
              <p>Can submit: {canSubmit ? '✓' : '✗'}</p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className={`mb-6 p-4 rounded-lg border animate-fade-in ${
                isDarkMode 
                  ? 'bg-red-950/20 border-red-800/50 text-red-300' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Registration Failed</p>
                    <p className="text-sm opacity-90">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className={`mb-6 p-4 rounded-lg border animate-fade-in ${
                isDarkMode 
                  ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-300' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Account created successfully!</p>
                    <p className="text-sm opacity-90">
                      Please check your email to verify your account. You'll be redirected to sign in shortly.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-4 animate-fade-in animation-delay-200">
              {/* Full Name Input */}
              <div className="space-y-2.5">
                <label htmlFor="fullname" className={`text-xs font-semibold uppercase tracking-wider ${currentColors.textSecondary}`}>
                  Full Name
                </label>
                <div className="relative group">
                  <div 
                    className="absolute inset-0 rounded-lg transition-all duration-300 opacity-0 group-focus-within:opacity-100 pointer-events-none"
                    style={{background: 'linear-gradient(135deg, rgba(77, 74, 255, 0.2), rgba(3, 0, 186, 0.2))'}}
                  ></div>
                  <User className="absolute left-4 top-4 w-5 h-5 text-slate-400 pointer-events-none transition-colors duration-300 group-focus-within:text-blue-500" />
                  <input
                    id="fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className={`relative w-full pl-12 pr-4 py-3 rounded-lg backdrop-blur-sm border-2 transition-all duration-300 outline-none ${
                      isDarkMode 
                        ? 'bg-slate-900/30 border-slate-700/50 text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-900/50' 
                        : 'bg-white/30 border-slate-300/50 text-slate-900 placeholder-slate-500 focus:border-blue-400 focus:bg-white/50'
                    }`}
                    required
                  />
                </div>
              </div>

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
                <label htmlFor="password" className={`text-xs font-semibold uppercase tracking-wider ${currentColors.textSecondary}`}>
                  Password
                </label>
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

                {/* Password Requirements */}
                <div className="mt-3 space-y-2 p-4 rounded-lg" style={{background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'}}>
                  {requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${req.check ? 'bg-emerald-500' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}>
                        {req.check && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`transition-colors duration-300 ${req.check ? 'text-emerald-400' : currentColors.textTertiary}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2.5">
                <label htmlFor="confirm" className={`text-xs font-semibold uppercase tracking-wider ${currentColors.textSecondary}`}>
                  Confirm Password
                </label>
                <div className="relative group">
                  <div 
                    className="absolute inset-0 rounded-lg transition-all duration-300 opacity-0 group-focus-within:opacity-100 pointer-events-none"
                    style={{background: 'linear-gradient(135deg, rgba(77, 74, 255, 0.2), rgba(3, 0, 186, 0.2))'}}
                  ></div>
                  <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 pointer-events-none transition-colors duration-300 group-focus-within:text-blue-500" />
                  <input
                    id="confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`relative w-full pl-12 pr-12 py-3 rounded-lg backdrop-blur-sm border-2 transition-all duration-300 outline-none ${
                      isDarkMode 
                        ? 'bg-slate-900/30 border-slate-700/50 text-white placeholder-slate-500 focus:border-blue-500 focus:bg-slate-900/50' 
                        : 'bg-white/30 border-slate-300/50 text-slate-900 placeholder-slate-500 focus:border-blue-400 focus:bg-white/50'
                    } ${passwordsMatch && confirmPassword ? (isDarkMode ? 'border-emerald-500/50' : 'border-emerald-500/40') : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-4 top-4 ${currentColors.textTertiary} hover:${isDarkMode ? 'text-white' : 'text-slate-900'} transition-colors`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5 cursor-pointer"
                  style={{accentColor: '#4D4AFF'}}
                  required
                />
                <label htmlFor="terms" className={`text-xs cursor-pointer leading-relaxed ${currentColors.textTertiary} hover:${isDarkMode ? 'text-slate-300' : 'text-slate-700'} transition-colors`}>
                  I agree to the <Link href="/terms" className="font-semibold text-blue-500 hover:text-blue-600">Terms of Service</Link> and <Link href="/privacy" className="font-semibold text-blue-500 hover:text-blue-600">Privacy Policy</Link>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading || !canSubmit}
                className="w-full py-3 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed mt-8 text-base relative overflow-hidden"
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
                    <span className="relative">Create Account</span>
                    <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <p className={`text-center mt-8 text-sm ${currentColors.textTertiary}`}>
              Already have an account?{' '}
              <Link href="/sign-in" className="font-bold text-blue-500 hover:text-blue-600 transition-colors">
                Sign in
              </Link>
            </p>

            {/* Test Credentials - можно удалить после отладки */}
            <div className="mt-6 p-3 rounded-lg bg-slate-800/20 border border-slate-700/30">
              <p className="text-xs text-slate-400 mb-1">Test credentials (auto-filled):</p>
              <p className="text-xs text-slate-300">Email: {email}</p>
              <p className="text-xs text-slate-300">Password: Test123!@#</p>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-8 text-center animate-fade-in animation-delay-400">
            <p className={`text-xs ${currentColors.textTertiary}`}>
              Protected by enterprise-grade security • Free plan includes 10 videos/month
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