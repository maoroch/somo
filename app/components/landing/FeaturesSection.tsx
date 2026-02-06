'use client';
import { Play, Sparkles, Zap, BarChart3, Users, Lightbulb, Cpu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function FeaturesSection({ isDarkMode }: { isDarkMode: boolean; toggleTheme?: () => void }) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const features = [
    {
      icon: Sparkles,
      title: 'AI Voiceover',
      description: 'Natural-sounding voices in 50+ languages. Choose from multiple voice personalities.',
      gradient: 'rgba(168, 85, 247, 0.2)',
    },
    {
      icon: BarChart3,
      title: 'Auto Subtitles',
      description: 'Automatic subtitle generation with perfect timing. 40+ language support included.',
      gradient: 'rgba(59, 130, 246, 0.2)',
    },
    {
      icon: Zap,
      title: 'Social Ready',
      description: 'Auto-formatted for TikTok, Instagram, YouTube, and LinkedIn. One click export.',
      gradient: 'rgba(251, 146, 60, 0.2)',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together in real-time. Share projects and templates with your team.',
      gradient: 'rgba(52, 211, 153, 0.2)',
    },
    {
      icon: Cpu,
      title: 'Stock Library',
      description: '1M+ stock videos, music, and images. Fully licensed for commercial use.',
      gradient: 'rgba(129, 140, 248, 0.2)',
    },
    {
      icon: Lightbulb,
      title: 'Brand Kit',
      description: 'Save your brand colors and fonts. Consistent branding across all videos.',
      gradient: 'rgba(244, 63, 94, 0.2)',
    },
  ];

  // Intersection Observer для scroll-triggered анимаций
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        }
      });
    }, observerOptions);

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className={`relative py-24 md:py-40 overflow-hidden`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-b ${currentColors.bg}`}></div>
        
        {/* Animated orbs */}
        <div 
          className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 top-0 left-10"
          style={{
            background: 'radial-gradient(circle, #4D4AFF 0%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 bottom-0 right-10"
          style={{
            background: 'radial-gradient(circle, #0300BA 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '1s'
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-block animate-fade-in">
            <span 
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: isDarkMode 
                  ? 'rgba(77, 74, 255, 0.1)' 
                  : 'rgba(77, 74, 255, 0.05)',
                color: '#4D4AFF',
                border: '1px solid rgba(77, 74, 255, 0.2)'
              }}
            >
              Powerful Capabilities
            </span>
          </div>

          <h2 
            className={`text-5xl md:text-6xl font-black leading-tight ${currentColors.text} animate-fade-in-up`}
            style={{
              animationDelay: '0.1s'
            }}
          >
            Everything for <span style={{color: '#4D4AFF'}}>Content Creators</span>
          </h2>

          <p 
            className={`${currentColors.textSecondary} text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up`}
            style={{
              animationDelay: '0.2s'
            }}
          >
            Professional-grade tools powered by advanced AI to transform your ideas into stunning videos. 
            Everything you need in one platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => {
            const IconComponent = feature.icon;
            const isHovered = hoveredCard === i;
            const isVisible = visibleCards.has(i);

            return (
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                key={i}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer"
                style={{
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  opacity: isVisible ? 1 : 0,
                  animationName: isVisible ? 'slideUp' : 'none',
                  animationDuration: '2.6s',
                  animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                  animationFillMode: 'forwards',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {/* Gradient Background */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${feature.gradient}, transparent)`,
                  }}
                ></div>

                {/* Border Glow - Enhanced */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                  style={{
                    border: `2px solid ${feature.gradient}`,
                    boxShadow: `0 0 40px ${feature.gradient}, inset 0 0 40px ${feature.gradient}`,
                  }}
                ></div>

                {/* Content */}
                <div
                  className="relative p-8 md:p-10 backdrop-blur-xl border rounded-2xl h-full transition-all duration-500"
                  style={{
                    background: isHovered
                      ? isDarkMode
                        ? 'rgba(15, 23, 42, 0.8)'
                        : 'rgba(248, 250, 252, 0.9)'
                      : currentColors.cardBg,
                    border: `2px solid ${
                      isHovered ? feature.gradient : currentColors.cardBorder
                    }`,
                    boxShadow: isHovered
                      ? `0 20px 50px ${isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}, inset 0 0 30px ${feature.gradient}`
                      : 'none',
                  }}
                >
                  {/* Icon Container */}
                  <div
                    className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center transition-all duration-500"
                    style={{
                      background: isDarkMode
                        ? `linear-gradient(135deg, ${feature.gradient}, rgba(77, 74, 255, 0.1))`
                        : `linear-gradient(135deg, ${feature.gradient}, rgba(77, 74, 255, 0.05))`,
                      transform: isHovered ? 'scale(1.2) rotate(10deg)' : 'scale(1)',
                    }}
                  >
                    <IconComponent
                      className="w-8 h-8 transition-all duration-500"
                      style={{
                        color: '#4D4AFF',
                        filter: isHovered ? 'brightness(1.3)' : 'brightness(1)',
                      }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold mb-3 ${currentColors.text} transition-colors duration-300`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className={`${currentColors.textTertiary} text-sm leading-relaxed mb-4`}>
                    {feature.description}
                  </p>

                  {/* CTA Link */}
                  <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#4D4AFF' }}>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                    <span>Learn more</span>
                  </div>

                  {/* Floating Particles on Hover */}
                  {isHovered && (
                    <>
                      {[0, 1, 2].map((j) => (
                        <div
                          key={j}
                          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                          style={{
                            background: '#4D4AFF',
                            left: `${20 + j * 30}%`,
                            top: '10%',
                            animationName: 'float-particle',
                            animationDuration: '2s',
                            animationTimingFunction: 'ease-out',
                            animationFillMode: 'forwards',
                            animationDelay: `${j * 0.2}s`,
                            opacity: 0.7,
                            boxShadow: '0 0 10px #4D4AFF',
                          }}
                        ></div>
                      ))}
                    </>
                  )}

                  {/* Scroll Animation Glow */}
                  {isVisible && !isHovered && (
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${feature.gradient}, transparent)`,
                        animationName: 'pulse-glow',
                        animationDuration: '2s',
                        animationTimingFunction: 'ease-in-out',
                        animationIterationCount: 'infinite',
                        opacity: 0.3,
                      }}
                    ></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div 
          className="mt-20 text-center animate-fade-in-up"
          style={{
            animationDelay: '0.4s'
          }}
        >
          <p className={`${currentColors.textSecondary} mb-6`}>
            Ready to transform your video creation?
          </p>
          <button
            className="group relative px-8 py-3.5 rounded-full font-semibold text-white overflow-hidden inline-flex items-center gap-2 transition-transform duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #4D4AFF 0%, #0300BA 100%)',
              boxShadow: '0 0 30px rgba(77, 74, 255, 0.4)',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, #0300BA 0%, #4D4AFF 100%)',
              }}
            ></div>
            <span className="relative">Start Free Trial</span>
            <span className="relative group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-particle {
          0% {
            opacity: 1;
            transform: translateY(0px) translateX(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) translateX(20px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}