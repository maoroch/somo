'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';

export default function Testimonials({ isDarkMode }: { isDarkMode: boolean; toggleTheme?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

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

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Content Creator',
      image: '👩‍💼',
      text: 'Somo has completely transformed my workflow. I can create professional videos in minutes instead of hours. Absolutely game-changing!',
      rating: 5,
      company: 'Creative Studios',
    },
    {
      name: 'Marcus Johnson',
      role: 'Marketing Manager',
      image: '👨‍💼',
      text: 'The AI voiceover quality is incredible. Our team uses it for all social media content now. ROI has been fantastic.',
      rating: 5,
      company: 'Tech Marketing Inc',
    },
    {
      name: 'Emma Rodriguez',
      role: 'YouTube Creator',
      image: '👩‍🎨',
      text: 'Finally a tool that understands creators! The automatic subtitles and formatting for different platforms saves me so much time.',
      rating: 5,
      company: 'Digital Content Co',
    },
    {
      name: 'David Kim',
      role: 'Entrepreneur',
      image: '👨‍💻',
      text: 'The learning curve is minimal and results are instant. Best investment for my content strategy this year.',
      rating: 5,
      company: 'StartUp Labs',
    },
    {
      name: 'Lisa Anderson',
      role: 'Brand Manager',
      image: '👩‍🔬',
      text: 'Team collaboration features are seamless. We can work together on projects without any hassle. Highly recommend!',
      rating: 5,
      company: 'Brand Agency',
    },
    {
      name: 'James Wilson',
      role: 'Podcast Host',
      image: '👨‍🎤',
      text: 'Converting my podcast transcripts into video content has never been easier. Somo is a lifesaver for content creators.',
      rating: 5,
      company: 'Podcast Network',
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return;

    autoPlayRef.current = setTimeout(() => {
      setDirection('right');
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [currentIndex, isAutoPlay, testimonials.length]);

  const goToPrevious = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
    setIsAutoPlay(false);
  };

  // Get visible testimonials (current and adjacent)
  const getVisibleTestimonials = () => {
    const prev = (currentIndex - 1 + testimonials.length) % testimonials.length;
    const next = (currentIndex + 1) % testimonials.length;
    return [prev, currentIndex, next];
  };

  const visibleIndices = getVisibleTestimonials();

  return (
    <section className={`relative py-24 md:py-40 overflow-hidden`}>
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-b ${currentColors.bg}`}></div>

        {/* Animated orbs */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15 top-1/3 -left-32"
          style={{
            background: 'radial-gradient(circle, #4D4AFF 0%, transparent 70%)',
            animation: 'float 12s ease-in-out infinite',
          }}
        ></div>
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15 bottom-0 -right-32"
          style={{
            background: 'radial-gradient(circle, #0300BA 0%, transparent 70%)',
            animation: 'float 14s ease-in-out infinite',
            animationDelay: '2s',
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2">
            <span
              className="px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)',
                color: '#4D4AFF',
                border: '1px solid rgba(77, 74, 255, 0.2)',
              }}
            >
              Creators Love Us
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
            Loved by <span style={{ color: '#4D4AFF' }}>Creators Worldwide</span>
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
            Join thousands of content creators transforming their ideas into stunning videos
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Carousel */}
          <div className="relative h-[480px] md:h-[420px] perspective">
            {testimonials.map((testimonial, index) => {
              const isVisible = visibleIndices.includes(index);
              const position = visibleIndices.indexOf(index);
              const isCenter = position === 1;

              if (!isVisible) return null;

              return (
                <div
                  key={index}
                  className="absolute w-full h-full transition-all duration-700 ease-out"
                  style={{
                    opacity: isCenter ? 1 : 0.5,
                    transform: isCenter
                      ? 'translateX(0) scale(1) translateZ(0)'
                      : position === 0
                        ? 'translateX(-100%) scale(0.85) translateZ(-100px)'
                        : 'translateX(100%) scale(0.85) translateZ(-100px)',
                    zIndex: isCenter ? 10 : 5,
                    pointerEvents: isCenter ? 'auto' : 'none',
                  }}
                >
                  {/* Card */}
                  <div
                    className="group relative h-full rounded-3xl overflow-hidden backdrop-blur-xl border p-8 md:p-10"
                    style={{
                      background: isDarkMode
                        ? `linear-gradient(135deg, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.4))`
                        : `linear-gradient(135deg, rgba(248, 250, 252, 0.7), rgba(248, 250, 252, 0.5))`,
                      border: `2px solid ${isCenter ? 'rgba(77, 74, 255, 0.4)' : currentColors.cardBorder}`,
                      boxShadow: isCenter
                        ? `0 25px 70px ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}, 
                           0 0 50px rgba(77, 74, 255, 0.3),
                           inset 0 0 50px rgba(77, 74, 255, 0.05)`
                        : '0 4px 20px rgba(0,0,0,0.05)',
                      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, rgba(77, 74, 255, 0.2), transparent)`,
                      }}
                    ></div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between">
                      {/* Stars */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <Star
                            key={j}
                            className="w-5 h-5 fill-current"
                            style={{ color: '#4D4AFF' }}
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className={`${currentColors.textSecondary} text-lg leading-relaxed mb-8 flex-grow`}>
                        "{testimonial.text}"
                      </p>

                      {/* Author Info */}
                      <div className="space-y-4">
                        <div
                          className="h-px"
                          style={{
                            background: `linear-gradient(90deg, transparent, rgba(77, 74, 255, 0.2), transparent)`,
                          }}
                        ></div>

                        <div className="flex items-center gap-4">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-transform duration-300"
                            style={{
                              background: `linear-gradient(135deg, rgba(77, 74, 255, 0.2), rgba(3, 0, 186, 0.1))`,
                              transform: isCenter ? 'scale(1)' : 'scale(0.95)',
                              boxShadow: '0 0 20px rgba(77, 74, 255, 0.2)',
                            }}
                          >
                            {testimonial.image}
                          </div>

                          <div className="flex-grow">
                            <p className={`${currentColors.text} font-bold text-sm`}>
                              {testimonial.name}
                            </p>
                            <p className={`${currentColors.textTertiary} text-xs mb-1`}>
                              {testimonial.role}
                            </p>
                            <p className={`${currentColors.textTertiary} text-xs opacity-70`}>
                              {testimonial.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-20 z-20 p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: isDarkMode ? 'rgba(77, 74, 255, 0.2)' : 'rgba(77, 74, 255, 0.1)',
              border: '2px solid rgba(77, 74, 255, 0.3)',
              color: '#4D4AFF',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(77, 74, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(77, 74, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode
                ? 'rgba(77, 74, 255, 0.2)'
                : 'rgba(77, 74, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-20 z-20 p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: isDarkMode ? 'rgba(77, 74, 255, 0.2)' : 'rgba(77, 74, 255, 0.1)',
              border: '2px solid rgba(77, 74, 255, 0.3)',
              color: '#4D4AFF',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(77, 74, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(77, 74, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode
                ? 'rgba(77, 74, 255, 0.2)'
                : 'rgba(77, 74, 255, 0.1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3 items-center justify-center">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: index === currentIndex ? '32px' : '12px',
                  height: '12px',
                  background:
                    index === currentIndex
                      ? 'linear-gradient(135deg, #4D4AFF, #0300BA)'
                      : isDarkMode
                        ? 'rgba(77, 74, 255, 0.2)'
                        : 'rgba(77, 74, 255, 0.1)',
                  border:
                    index === currentIndex
                      ? '2px solid rgba(77, 74, 255, 0.4)'
                      : '2px solid transparent',
                  boxShadow:
                    index === currentIndex
                      ? '0 0 15px rgba(77, 74, 255, 0.5)'
                      : 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          className="mt-32 grid md:grid-cols-3 gap-8 max-w-3xl mx-auto text-center"
          style={{
            animationName: 'fade-in-up',
            animationDuration: '1s',
            animationTimingFunction: 'ease-out',
            animationDelay: '0.5s',
            animationFillMode: 'both',
            opacity: 0,
          }}
        >
          <div>
            <p className="text-3xl font-bold" style={{ color: '#4D4AFF' }}>
              50K+
            </p>
            <p className={currentColors.textTertiary}>Active Creators</p>
          </div>
          <div>
            <p className="text-3xl font-bold" style={{ color: '#4D4AFF' }}>
              500K+
            </p>
            <p className={currentColors.textTertiary}>Videos Created</p>
          </div>
          <div>
            <p className="text-3xl font-bold" style={{ color: '#4D4AFF' }}>
              4.9★
            </p>
            <p className={currentColors.textTertiary}>Average Rating</p>
          </div>
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

        @supports (perspective: 1000px) {
          .perspective {
            perspective: 1000px;
          }
        }
      `}</style>
    </section>
  );
}