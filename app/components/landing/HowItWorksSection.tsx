'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorksSection({ isDarkMode }: { isDarkMode: boolean; toggleTheme?: () => void }) {
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const steps = [
    {
      step: '01',
      title: 'Write Your Script',
      desc: 'Type or paste your text. Our AI understands context and emotion.',
      icon: '✍️',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      glowColor: 'rgba(59, 130, 246, 0.3)',
    },
    {
      step: '02',
      title: 'Customize Everything',
      desc: 'Pick voices, styles, music, and visual effects in seconds.',
      icon: '🎨',
      gradient: 'from-purple-500/20 to-pink-500/20',
      glowColor: 'rgba(168, 85, 247, 0.3)',
    },
    {
      step: '03',
      title: 'Export & Share',
      desc: 'Generate your video and share directly to social media.',
      icon: '🚀',
      gradient: 'from-green-500/20 to-emerald-500/20',
      glowColor: 'rgba(52, 211, 153, 0.3)',
    },
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = stepRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            setVisibleSteps((prev) => new Set([...prev, index]));
          }
        }
      });
    }, observerOptions);

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="how-it-works" 
      className={`relative py-24 md:py-40 overflow-hidden`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-b ${currentColors.bg}`}></div>
        
        {/* Animated orbs */}
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15 top-1/4 -left-20"
          style={{
            background: 'radial-gradient(circle, #4D4AFF 0%, transparent 70%)',
            animation: 'float 12s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15 bottom-1/4 -right-20"
          style={{
            background: 'radial-gradient(circle, #0300BA 0%, transparent 70%)',
            animation: 'float 14s ease-in-out infinite',
            animationDelay: '2s'
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2">
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
              Simple Process
            </span>
          </div>

          <h2 
            className={`text-5xl md:text-6xl font-black leading-tight ${currentColors.text}`}
            style={{
              animationName: 'fade-in-up',
              animationDuration: '1s',
              animationTimingFunction: 'ease-out',
              animationDelay: '0s',
              animationFillMode: 'both',
              opacity: 0,
            }}
          >
            From Script to <span style={{color: '#4D4AFF'}}>Video in Minutes</span>
          </h2>

          <p 
            className={`${currentColors.textSecondary} text-lg md:text-xl max-w-3xl mx-auto`}
            style={{
              animationName: 'fade-in-up',
              animationDuration: '1s',
              animationTimingFunction: 'ease-out',
              animationDelay: '0.1s',
              animationFillMode: 'both',
              opacity: 0,
            }}
          >
            Three simple steps to transform your ideas into professional videos powered by AI
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-px pointer-events-none">
            <div 
              className="h-full"
              style={{
                background: `linear-gradient(90deg, 
                  transparent, 
                  rgba(77, 74, 255, 0.2) 33%, 
                  rgba(77, 74, 255, 0.2) 66%, 
                  transparent)`,
              }}
            ></div>
          </div>

          {steps.map((item, i) => {
            const isVisible = visibleSteps.has(i);
            const isHovered = hoveredStep === i;

            return (
              <div
                key={i}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
                className="relative"
                style={{
                  opacity: isVisible ? 1 : 0,
                  animationName: isVisible ? 'slideUp' : 'none',
                  animationDuration: '0.8s',
                  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  animationFillMode: 'forwards',
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                {/* Card */}
                <div
                  className="group relative overflow-hidden rounded-2xl backdrop-blur-xl border h-full"
                  style={{
                    background: isDarkMode
                      ? `linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.4))`
                      : `linear-gradient(135deg, rgba(248, 250, 252, 0.7), rgba(248, 250, 252, 0.5))`,
                    border: `2px solid ${
                      isHovered ? 'rgba(77, 74, 255, 0.4)' : currentColors.cardBorder
                    }`,
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isHovered
                      ? `0 20px 60px ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}, 
                         0 0 40px rgba(77, 74, 255, 0.2),
                         inset 0 0 40px rgba(77, 74, 255, 0.05)`
                      : '0 4px 20px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${item.glowColor}, transparent)`,
                    }}
                  ></div>

                  {/* Border Glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 40px ${item.glowColor}`,
                      transition: 'opacity 0.4s ease-out',
                    }}
                  ></div>

                  {/* Content */}
                  <div className="relative p-8 md:p-10 h-full flex flex-col">
                    {/* Step Number with Circle */}
                    <div className="mb-8">
                      <div
                        className="relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${item.glowColor}, rgba(77, 74, 255, 0.1))`,
                          transform: isHovered ? 'scale(1.1) rotate(8deg)' : 'scale(1)',
                          boxShadow: isHovered
                            ? `0 0 30px ${item.glowColor}`
                            : '0 4px 20px rgba(77, 74, 255, 0.1)',
                        }}
                      >
                        <span className={`text-4xl font-black ${currentColors.text} opacity-80`}>
                          {item.step}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      className={`text-2xl font-bold mb-4 ${currentColors.text} transition-colors duration-300`}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className={`${currentColors.textTertiary} text-sm leading-relaxed mb-6 flex-grow`}>
                      {item.desc}
                    </p>

                    {/* Icon and Arrow */}
                    <div className="flex items-center justify-between pt-4 border-t" 
                      style={{ borderColor: 'rgba(77, 74, 255, 0.1)' }}>
                      <span className="text-3xl">
                        {item.icon}
                      </span>
                      <ArrowRight 
                        className="w-5 h-5"
                        style={{
                          color: '#4D4AFF',
                          transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Scroll Animation Glow */}
                  {isVisible && !isHovered && (
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${item.glowColor}, transparent)`,
                        animationName: 'pulse-glow-smooth',
                        animationDuration: '3s',
                        animationTimingFunction: 'ease-in-out',
                        animationIterationCount: 'infinite',
                        opacity: 0.15,
                      }}
                    ></div>
                  )}
                </div>

                {/* Connection Dot for Desktop */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:flex absolute -right-4 top-32 w-8 h-8 rounded-full items-center justify-center z-20"
                    style={{
                      background: isDarkMode ? 'rgba(15, 23, 42, 1)' : 'rgba(255, 255, 255, 1)',
                      border: '3px solid rgba(77, 74, 255, 0.3)',
                      boxShadow: '0 0 20px rgba(77, 74, 255, 0.2)',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: '#4D4AFF',
                        boxShadow: '0 0 10px rgba(77, 74, 255, 0.8)',
                      }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div 
          className="mt-20 text-center"
          style={{
            animationName: 'fade-in-up',
            animationDuration: '1s',
            animationTimingFunction: 'ease-out',
            animationDelay: '0.5s',
            animationFillMode: 'both',
            opacity: 0,
          }}
        >
          <p className={`${currentColors.textSecondary} mb-8`}>
            Ready to create your first video?
          </p>
          <button
            className="group relative px-8 py-3.5 rounded-full font-semibold text-white overflow-hidden inline-flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #4D4AFF 0%, #0300BA 100%)',
              boxShadow: '0 0 30px rgba(77, 74, 255, 0.4)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(77, 74, 255, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(77, 74, 255, 0.4)';
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #0300BA 0%, #4D4AFF 100%)',
                opacity: 0,
                transition: 'opacity 0.3s ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0';
              }}
            ></div>
            <span className="relative">Get Started Free</span>
            <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
          </button>
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        @keyframes pulse-glow-smooth {
          0%, 100% {
            transform: scale(1);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.25;
          }
        }
      `}</style>
    </section>
  );
}