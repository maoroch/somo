'use client';
import React, { useState } from 'react';
import { X, Check, Zap, Crown, Rocket, ArrowRight } from 'lucide-react';

export default function PricingPopup({ isDarkMode }: { isDarkMode: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

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

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for getting started',
      icon: Zap,
      monthlyPrice: 0,
      yearlyPrice: 290,
      monthlyOldPrice: 39,
      yearlyOldPrice: 390,
      features: [
        '10 Videos per month',
        '50+ AI Voices',
        'Auto Subtitles (5 languages)',
        'Basic Templates',
        '720p Export',
        'Email Support',
      ],
      gradient: 'from-blue-500/20 to-cyan-500/20',
      glowColor: 'rgba(59, 130, 246, 0.3)',
      highlighted: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For serious creators',
      icon: Crown,
      monthlyPrice: 0,
      yearlyPrice: 790,
      monthlyOldPrice: 99,
      yearlyOldPrice: 990,
      features: [
        'Unlimited Videos',
        '100+ AI Voices',
        'Auto Subtitles (40 languages)',
        'Advanced Templates',
        '4K Export',
        'Priority Support',
        'Team Collaboration (3 members)',
        'Brand Kit',
        'Custom Fonts & Colors',
      ],
      gradient: 'from-purple-500/20 to-pink-500/20',
      glowColor: 'rgba(168, 85, 247, 0.3)',
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large teams',
      icon: Rocket,
      monthlyPrice: null,
      yearlyPrice: null,
      features: [
        'Everything in Pro',
        'Unlimited Team Members',
        'Advanced Analytics',
        'API Access',
        'Custom Integrations',
        'Dedicated Account Manager',
        'SLA Guarantee',
        '24/7 Phone Support',
      ],
      gradient: 'from-green-500/20 to-emerald-500/20',
      glowColor: 'rgba(52, 211, 153, 0.3)',
      highlighted: false,
      customPrice: true,
    },
  ];

  const handleOpenPopup = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClosePopup = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        data-pricing-trigger
        onClick={handleOpenPopup}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 40px rgba(77, 74, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 0 30px rgba(77, 74, 255, 0.4)';
        }}
      >
      </button>

      {/* Popup Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300"
          style={{
            background: isDarkMode
              ? 'rgba(0, 0, 0, 0.6)'
              : 'rgba(0, 0, 0, 0.4)',
          }}
          onClick={handleClosePopup}
        >
          {/* Glass Popup */}
          <div
            className="relative w-full max-w-7xl rounded-3xl overflow-hidden backdrop-blur-3xl border max-h-[90vh] overflow-y-auto"
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.7))'
                : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(248, 250, 252, 0.85))',
              border: `2px solid rgba(77, 74, 255, 0.2)`,
              boxShadow: `0 25px 100px ${isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.15)'}, 
                          0 0 100px rgba(77, 74, 255, 0.2),
                          inset 0 0 100px rgba(77, 74, 255, 0.05)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-8 md:p-12 border-b" style={{ borderColor: 'rgba(77, 74, 255, 0.1)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className={`text-4xl md:text-5xl font-black ${currentColors.text} mb-2`}>
                    Simple, Transparent <span style={{ color: '#4D4AFF' }}>Pricing</span>
                  </h2>
                  <p className={`${currentColors.textSecondary} text-lg`}>
                    Choose the perfect plan for your content creation needs
                  </p>
                </div>
                <button
                  onClick={handleClosePopup}
                  className="p-2 rounded-full transition-all hover:scale-110 flex-shrink-0"
                  style={{
                    background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)',
                    color: '#4D4AFF',
                  }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Billing Toggle */}
              <div className="mt-8 inline-flex items-center gap-4 p-1 rounded-full" style={{
                background: isDarkMode ? 'rgba(77, 74, 255, 0.1)' : 'rgba(77, 74, 255, 0.05)',
              }}>
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                    billingPeriod === 'monthly'
                      ? 'text-white'
                      : currentColors.textSecondary
                  }`}
                  style={{
                    background: billingPeriod === 'monthly'
                      ? 'linear-gradient(135deg, #4D4AFF, #0300BA)'
                      : 'transparent',
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 relative ${
                    billingPeriod === 'yearly'
                      ? 'text-white'
                      : currentColors.textSecondary
                  }`}
                  style={{
                    background: billingPeriod === 'yearly'
                      ? 'linear-gradient(135deg, #4D4AFF, #0300BA)'
                      : 'transparent',
                  }}
                >
                  Yearly
                  <span
                    className="absolute -top-3 -right-2 px-2 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                      color: 'white',
                    }}
                  >
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-6">
                {pricingPlans.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan === plan.id;
                  const currentPrice = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
                  const oldPrice = billingPeriod === 'monthly' ? plan.monthlyOldPrice : plan.yearlyOldPrice;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className="group relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-500 cursor-pointer"
                      style={{
                        background: isDarkMode
                          ? `linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.5))`
                          : `linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(248, 250, 252, 0.6))`,
                        border: `2px solid ${
                          isSelected || plan.highlighted
                            ? 'rgba(77, 74, 255, 0.4)'
                            : 'rgba(77, 74, 255, 0.15)'
                        }`,
                        boxShadow: isSelected || plan.highlighted
                          ? `0 0 50px ${plan.glowColor}, inset 0 0 40px ${plan.glowColor}`
                          : '0 4px 20px rgba(0,0,0,0.05)',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      {/* Gradient Overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${plan.glowColor}, transparent)`,
                        }}
                      ></div>

                      {/* Featured Badge */}
                      {plan.highlighted && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                          style={{
                            background: 'linear-gradient(135deg, #4D4AFF, #0300BA)',
                          }}
                        >
                          Most Popular
                        </div>
                      )}

                      {/* Content */}
                      <div className="relative z-10 p-8 space-y-6 h-full flex flex-col">
                        {/* Header */}
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="p-3 rounded-xl"
                              style={{
                                background: `linear-gradient(135deg, ${plan.glowColor}, rgba(77, 74, 255, 0.1))`,
                              }}
                            >
                              <Icon className="w-5 h-5" style={{ color: '#4D4AFF' }} />
                            </div>
                            <h3 className={`text-2xl font-bold ${currentColors.text}`}>
                              {plan.name}
                            </h3>
                          </div>
                          <p className={`${currentColors.textTertiary} text-sm`}>
                            {plan.description}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                          {plan.customPrice ? (
                            <div>
                              <p className={`text-4xl font-black ${currentColors.text}`}>
                                Custom
                              </p>
                              <p className={`${currentColors.textTertiary} text-sm`}>
                                Contact sales for pricing
                              </p>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black" style={{ color: '#4D4AFF' }}>
                                  ${currentPrice}
                                </span>
                                <span className={`${currentColors.textTertiary} line-through text-sm`}>
                                  ${oldPrice}
                                </span>
                              </div>
                              <p className={`${currentColors.textTertiary} text-sm`}>
                                per {billingPeriod === 'monthly' ? 'month' : 'year'}
                              </p>
                            </>
                          )}
                        </div>

                        {/* CTA Button */}
                        <button
                          className="group relative w-full py-3 rounded-full font-semibold transition-all duration-300 overflow-hidden mt-4"
                          style={{
                            background: isSelected
                              ? 'linear-gradient(135deg, #4D4AFF, #0300BA)'
                              : isDarkMode
                                ? 'rgba(77, 74, 255, 0.1)'
                                : 'rgba(77, 74, 255, 0.05)',
                            color: isSelected ? 'white' : '#4D4AFF',
                            border: `2px solid ${isSelected ? 'rgba(77, 74, 255, 0.5)' : 'rgba(77, 74, 255, 0.2)'}`,
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.background = isDarkMode
                                ? 'rgba(77, 74, 255, 0.2)'
                                : 'rgba(77, 74, 255, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.background = isDarkMode
                                ? 'rgba(77, 74, 255, 0.1)'
                                : 'rgba(77, 74, 255, 0.05)';
                            }
                          }}
                        >
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background: 'linear-gradient(135deg, #0300BA, #4D4AFF)',
                            }}
                          ></div>
                          <span className="relative">
                            {plan.customPrice ? 'Contact Sales' : 'Get Started'}
                          </span>
                        </button>

                        {/* Features */}
                        <div className="space-y-3 pt-4 border-t flex-grow"
                          style={{ borderColor: 'rgba(77, 74, 255, 0.1)' }}>
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4D4AFF' }} />
                              <span className={`text-sm ${currentColors.textSecondary}`}>
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="relative p-8 md:p-12 border-t text-center" style={{ borderColor: 'rgba(77, 74, 255, 0.1)' }}>
              <p className={currentColors.textTertiary}>
                All plans include 14-day free trial. No credit card required.
                <br />
                <span className="text-sm opacity-75">Cancel anytime. Money-back guarantee.</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(77, 74, 255, 0.2);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(77, 74, 255, 0.3);
        }
      `}</style>
    </>
  );
}