'use client';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function CTASection({ isDarkMode }: { isDarkMode: boolean; toggleTheme?: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  const colors = {
    dark: {
      bg: 'from-slate-950 via-slate-900 to-slate-950',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      textTertiary: 'text-slate-400',
      cardBg: 'rgba(15, 23, 42, 0.4)',
      cardBorder: 'rgba(77, 74, 255, 0.2)',
    },
    light: {
      bg: 'from-white via-slate-50 to-white',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textTertiary: 'text-slate-600',
      cardBg: 'rgba(248, 250, 252, 0.6)',
      cardBorder: 'rgba(77, 74, 255, 0.15)',
    },
  };

  const currentColors = isDarkMode ? colors.dark : colors.light;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section 
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-b ${currentColors.bg}`}></div>

        {/* Animated orbs */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15 top-0 left-1/4"
          style={{
            background: 'radial-gradient(circle, #4D4AFF 0%, transparent 70%)',
            animation: 'float 12s ease-in-out infinite',
          }}
        ></div>
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15 bottom-0 right-1/4"
          style={{
            background: 'radial-gradient(circle, #0300BA 0%, transparent 70%)',
            animation: 'float 14s ease-in-out infinite',
            animationDelay: '2s',
          }}
        ></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Main CTA Card */}
        <div
          className="relative rounded-3xl overflow-hidden backdrop-blur-xl border transition-all duration-500"
          style={{
            background: isDarkMode
              ? `linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.4))`
              : `linear-gradient(135deg, rgba(248, 250, 252, 0.7), rgba(248, 250, 252, 0.5))`,
            border: `2px solid ${currentColors.cardBorder}`,
            boxShadow: isVisible
              ? `0 25px 80px ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`
              : '0 4px 20px rgba(0,0,0,0.05)',
          }}
          onMouseMove={handleMouseMove}
        >
          {/* Animated Gradient Background */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500"
            style={{
              background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(77, 74, 255, 0.15), transparent 80%)`,
            }}
          ></div>

          {/* Gradient Glow Elements */}
          <div className="absolute inset-0 opacity-0" style={{
            background: `linear-gradient(135deg, rgba(77, 74, 255, 0.1), rgba(3, 0, 186, 0.05))`,
            animation: isVisible ? 'pulse-bg 3s ease-in-out infinite' : 'none',
          }} />

          {/* Content */}
          <div className="relative z-10 p-12 md:p-20 text-center space-y-8">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2">
              <span
                className="px-4 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: isDarkMode
                    ? 'rgba(77, 74, 255, 0.1)'
                    : 'rgba(77, 74, 255, 0.05)',
                  color: '#4D4AFF',
                  border: '1px solid rgba(77, 74, 255, 0.2)',
                }}
              >
                Limited Time Offer
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h2
                className={`text-5xl md:text-6xl font-black leading-tight ${currentColors.text}`}
                style={{
                  animationName: isVisible ? 'fade-in-up' : 'none',
                  animationDuration: '1s',
                  animationTimingFunction: 'ease-out',
                  animationFillMode: 'both',
                  opacity: 0,
                }}
              >
                Transform Your <span style={{ color: '#4D4AFF' }}>Content Creation</span>
              </h2>

              <p
                className={`text-lg md:text-xl ${currentColors.textSecondary} max-w-3xl mx-auto leading-relaxed`}
                style={{
                  animationName: isVisible ? 'fade-in-up' : 'none',
                  animationDuration: '1s',
                  animationTimingFunction: 'ease-out',
                  animationDelay: '0.1s',
                  animationFillMode: 'both',
                  opacity: 0,
                }}
              >
                Join 50K+ creators already using Somo to produce professional videos in minutes. 
                No credit card required. Start creating with 10 free videos today.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              style={{
                animationName: isVisible ? 'fade-in-up' : 'none',
                animationDuration: '1s',
                animationTimingFunction: 'ease-out',
                animationDelay: '0.2s',
                animationFillMode: 'both',
                opacity: 0,
              }}
            >
              {/* Primary CTA */}
              <Link href="/sign-up" className="flex-1 sm:flex-none">
                <button
                  className="group relative w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-white overflow-hidden inline-flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #4D4AFF 0%, #0300BA 100%)',
                    boxShadow: '0 0 40px rgba(77, 74, 255, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(77, 74, 255, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(77, 74, 255, 0.4)';
                  }}
                >
                  {/* Shimmer Effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #0300BA 0%, #4D4AFF 100%)',
                    }}
                  ></div>

                  {/* Animated Glow */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: 'shimmer-animation 3s infinite',
                    }}
                  ></div>

                  <span className="relative flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>

              {/* Secondary CTA */}
              <button
                className="group relative w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: isDarkMode
                    ? 'rgba(77, 74, 255, 0.15)'
                    : 'rgba(77, 74, 255, 0.1)',
                  border: '2px solid rgba(77, 74, 255, 0.3)',
                  color: '#4D4AFF',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode
                    ? 'rgba(77, 74, 255, 0.25)'
                    : 'rgba(77, 74, 255, 0.15)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(77, 74, 255, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(77, 74, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode
                    ? 'rgba(77, 74, 255, 0.15)'
                    : 'rgba(77, 74, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(77, 74, 255, 0.3)';
                }}
              >
                <Zap className="w-5 h-5" />
                View Pricing Plans
              </button>
            </div>

            {/* Features List */}
            <div
              className="flex flex-col sm:flex-row gap-6 justify-center pt-8 border-t"
              style={{
                borderColor: 'rgba(77, 74, 255, 0.1)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl" style={{ color: '#4D4AFF' }}>✓</span>
                <span className={currentColors.textTertiary}>10 Free Videos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl" style={{ color: '#4D4AFF' }}>✓</span>
                <span className={currentColors.textTertiary}>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl" style={{ color: '#4D4AFF' }}>✓</span>
                <span className={currentColors.textTertiary}>Cancel Anytime</span>
              </div>
            </div>
          </div>

          {/* Border Glow Animation */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              border: '2px solid transparent',
              background: `linear-gradient(${currentColors.cardBg}, ${currentColors.cardBg}) padding-box,
                           linear-gradient(135deg, rgba(77, 74, 255, 0.2), rgba(3, 0, 186, 0.1)) border-box`,
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 1s ease-out',
            }}
          ></div>
        </div>

        {/* Bottom Text */}
        <div
          className="text-center mt-12"
          style={{
            animationName: isVisible ? 'fade-in-up' : 'none',
            animationDuration: '1s',
            animationTimingFunction: 'ease-out',
            animationDelay: '0.3s',
            animationFillMode: 'both',
            opacity: 0,
          }}
        >
          <p className={`${currentColors.textTertiary} text-sm`}>
            Trusted by creators at leading brands • Used by 50K+ creators worldwide
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-40px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-bg {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.15;
          }
        }

        @keyframes shimmer-animation {
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
      `}</style>
    </section>
  );
}