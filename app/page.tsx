'use client';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { ChevronRight, Play, Sparkles, Zap, BarChart3, Users } from 'lucide-react';
import { getInitialTheme, saveTheme, type Theme } from '@/lib/theme-utils';
import Navbar from '@/app/components/landing/Navbar';
import FeaturesSection from '@/app/components/landing/FeaturesSection';
import TestimonialsSection from '@/app/components/landing/TestimonialsSection';
import HowItWorksSection from '@/app/components/landing/HowItWorksSection';
import CTASection from '@/app/components/landing/CTASection';
export default function SomoLanding() {
  const [scrollY, setScrollY] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Инициализация темы при монтировании
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setIsDarkMode(initialTheme === 'dark');
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    saveTheme(newTheme);
  };

  // Цветовые схемы
  const colors = {
    dark: {
      bg: 'from-slate-950 via-slate-900 to-slate-950',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      textTertiary: 'text-slate-400',
      cardBg: 'linear-gradient(135deg, rgba(77, 74, 255, 0.1), rgba(3, 0, 186, 0.05))',
      cardBorder: 'rgba(77, 74, 255, 0.2)',
      heroBg: 'from-slate-950/60 via-slate-950/40 to-slate-950/80',
      footerBg: 'bg-slate-950/80',
    },
    light: {
      bg: 'from-white via-slate-50 to-white',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textTertiary: 'text-slate-600',
      cardBg: 'linear-gradient(135deg, rgba(77, 74, 255, 0.05), rgba(3, 0, 186, 0.02))',
      cardBorder: 'rgba(77, 74, 255, 0.15)',
      heroBg: 'from-white/60 via-white/40 to-white/80',
      footerBg: 'bg-slate-50',
    },
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

  // Избегаем мерцания при первой загрузке
  if (!isLoaded) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${currentColors.bg}`}></div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentColors.bg} ${currentColors.text} overflow-hidden transition-colors duration-500`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl top-20 left-10 animate-blob transition-all duration-500" 
          style={{background: isDarkMode ? 'rgba(77, 74, 255, 0.2)' : 'rgba(77, 74, 255, 0.1)'}}
        ></div>
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl top-40 right-20 animate-blob animation-delay-2000 transition-all duration-500" 
          style={{background: isDarkMode ? 'rgba(3, 0, 186, 0.2)' : 'rgba(3, 0, 186, 0.1)'}}
        ></div>
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl bottom-20 left-1/2 animate-blob animation-delay-4000 transition-all duration-500" 
          style={{background: isDarkMode ? 'rgba(77, 74, 255, 0.15)' : 'rgba(77, 74, 255, 0.05)'}}
        ></div>
      </div>

      {/* Navbar - вне основного контента для правильного z-index */}
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section with Video Background */}
        <section className="relative h-[600px] md:h-[700px] lg:h-[800px] w-full overflow-hidden rounded-b-3xl">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <video
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            >
              <source src="https://videos.pexels.com/video-files/3573382/3573382-sd_640_360_25fps.mp4" type="video/mp4" />
            </video>
            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${currentColors.heroBg}`}></div>
          </div>

          {/* Content at Bottom */}
          <div className="relative z-20 h-full flex flex-col justify-end pb-12 md:pb-16 px-6">
            <div className="max-w-4xl mx-auto w-full space-y-6 animate-fade-in">
              <div className="space-y-4">
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black leading-tight ${currentColors.text}`}>
                  Create Videos from Text
                </h1>

                <p className={`text-lg ${isDarkMode ? 'text-slate-200' : 'text-slate-800'} max-w-2xl`}>
                  Transform your ideas into stunning videos. Automatic subtitles, AI voiceover, and instant formatting for social media.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-200">
                <Link href="/sign-up">
                  <button className="group px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-white" style={{background: 'linear-gradient(135deg, #4D4AFF, #0300BA)', boxShadow: '0 0 30px rgba(77, 74, 255, 0.3)'}}>
                    Start Creating Free
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </button>
                </Link>
                <button className={`px-8 py-4 border rounded-lg font-bold text-lg hover:bg-opacity-10 transition-all flex items-center justify-center gap-2 ${currentColors.text} backdrop-blur-sm`} style={{borderColor: '#4D4AFF', backgroundColor: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)'}}>
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>

              <div className={`pt-4 space-y-3 animate-fade-in animation-delay-400 ${currentColors.textSecondary}`}>
                <p className="text-sm">✓ No credit card required • ✓ 10 free videos</p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-slate-900' : 'border-white'}`}
                        style={{background: 'linear-gradient(135deg, #4D4AFF, #0300BA)'}}
                      />
                    ))}
                  </div>
                  <span className="text-sm">
                    <span className="font-semibold">50K+</span> creators already using
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        {/* How It Works */}
        <HowItWorksSection isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        {/* Testimonials Section */}
        <TestimonialsSection isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

        {/* CTA Section */}
        <CTASection isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t backdrop-blur-xl ${currentColors.footerBg} transition-colors duration-500`} style={{borderColor: 'rgba(77, 74, 255, 0.1)'}}>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          {/* Newsletter Section */}
          <div className="mb-16 p-8 md:p-12 rounded-2xl border transition-all duration-500" style={{background: currentColors.cardBg, borderColor: currentColors.cardBorder}}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <h3 className={`text-2xl font-bold ${currentColors.text} mb-2`}>Stay Updated</h3>
                <p className={currentColors.textTertiary}>Get the latest features and updates directly in your inbox.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className={`px-4 py-3 rounded-lg border text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all`}
                  style={{
                    borderColor: currentColors.cardBorder,
                    backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(226, 232, 240, 0.5)',
                    color: isDarkMode ? 'white' : 'black',
                  }}
                />
                <button 
                  className="group relative px-6 py-3 rounded-lg font-semibold text-white transition-all overflow-hidden whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                    boxShadow: '0 0 15px rgba(77, 74, 255, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{background: 'linear-gradient(135deg, #0300BA, #4D4AFF)'}}></div>
                  <span className="relative">Subscribe</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src={isDarkMode ? '/logo-dark.svg' : '/logo-light.svg'}
                  alt="Somo Logo"
                  width={80}
                  height={40}
                  className="object-contain transition-opacity duration-300"
                />
              </div>
              <p className={`${currentColors.textTertiary} text-sm mb-6`}>Create professional videos with AI in minutes.</p>
              
              <div className="flex gap-3">
                {['twitter', 'instagram', 'linkedin', 'youtube'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)',
                      border: `1px solid ${currentColors.cardBorder}`,
                      color: '#4D4AFF'
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {social === 'twitter' && <path d="M8 19c11 0 17-9 17-16v-1c1-1 1-2 0-3-1 0-2 1-3 1-1-1-3-1-4 0-1-1-2-1-3 0C3 3 3 8 3 8c-1 0-2 1-3 1 0 1 0 2 1 3C1 13 1 19 8 19z"/>}
                      {social === 'instagram' && <path d="M7 0h10a7 7 0 017 7v10a7 7 0 01-7 7H7a7 7 0 01-7-7V7a7 7 0 017-7z"/>}
                      {social === 'linkedin' && <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>}
                      {social === 'youtube' && <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Resources', links: ['Docs', 'API', 'Support', 'Community'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Contact', 'Cookies'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className={`font-bold mb-4 ${currentColors.text} text-sm uppercase tracking-wider`} style={{color: '#4D4AFF'}}>
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a 
                        href="#" 
                        className={`${currentColors.textTertiary} text-sm transition-all duration-300 hover:${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-1 group`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div 
            className="h-px mb-8"
            style={{background: 'linear-gradient(to right, transparent, rgba(77, 74, 255, 0.3), transparent)'}}
          ></div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className={`${currentColors.textTertiary} text-sm`}>
              © 2024 Somo. All rights reserved. Made with ❤️ for creators.
            </p>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500" style={{background: 'rgba(77, 74, 255, 0.1)', filter: 'blur(100px)'}}></div>
        </div>
      </footer>

      <style jsx>{`
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
          animation: fade-in 0.8s ease-out forwards;
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