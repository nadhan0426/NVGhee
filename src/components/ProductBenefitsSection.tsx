import React from 'react';
import { ShieldCheck, Heart, Sparkles, Droplets, Flame, Sun, CheckCircle2, Award } from 'lucide-react';

export const ProductBenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <Droplets className="w-6 h-6 text-ghee-600" />,
      badge: 'Ayurvedic Rasayana',
      title: 'Lactose & Casein-Free',
      description:
        'Slow, gentle clarifying removes milk solids down to <0.01%. Nourishing and easy to digest even for those with dairy sensitivities.',
      highlight: 'Cultured A2 Whole Curd',
    },
    {
      icon: <Flame className="w-6 h-6 text-ghee-600" />,
      badge: 'Culinary Perfection',
      title: 'High Smoke Point (250°C / 485°F)',
      description:
        'Resists heat degradation and oxidation. Searing, roasting, or tempering spices without releasing harmful acrylamides or toxic smoke.',
      highlight: 'Zero Trans Fats',
    },
    {
      icon: <Heart className="w-6 h-6 text-ghee-600" />,
      badge: 'Cellular Vitality',
      title: 'Rich in Butyrate & Omega-3',
      description:
        'Natural short-chain fatty acids nourish the colonic wall, strengthen gut microbiome integrity, and aid optimal nutrient absorption.',
      highlight: 'Bioavailable Nutrition',
    },
    {
      icon: <Sun className="w-6 h-6 text-ghee-600" />,
      badge: 'Vedic Purity',
      title: 'Vitamins A, D, E & K2',
      description:
        'Abundant in naturally occurring fat-soluble vitamins essential for bone density, hormonal balance, and radiant glowing skin vitality.',
      highlight: '100% Grass-Fed Origin',
    },
  ];

  return (
    <section id="benefits" className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 bg-[#FAF7EE] border-t border-ghee-gold/20 overflow-hidden">
      {/* Background Soft Warm Caustic Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial-glow opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ivory-200/90 border border-ghee-gold/30 text-ghee-800 text-[11px] font-semibold tracking-[0.25em] uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-ghee-600" />
            <span>Nourishment In Its Highest Form</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-earth-900 font-normal tracking-tight uppercase mb-4">
            Living Benefits of <span className="italic text-ghee-700">Artisanal Ghee</span>
          </h2>

          <p className="text-sm sm:text-base text-earth-800/80 font-light leading-relaxed">
            Revered in classical Ayurveda as supreme golden elixir (Ghrita), our traditional bilona ghee
            harmonizes all three doshas while elevating every culinary dish.
          </p>
        </div>

        {/* 4 Restrained Glassmorphism Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-3xl glass-panel border border-ghee-gold/30 hover:border-ghee-gold/60 transition-all duration-300 hover:-translate-y-1 shadow-luxury flex flex-col justify-between"
            >
              <div>
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-ivory-200/90 border border-ghee-gold/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {b.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200">
                    {b.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-serif text-xl sm:text-2xl text-earth-900 font-normal tracking-tight mb-2.5">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-earth-800/75 font-light leading-relaxed">
                  {b.description}
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="mt-6 pt-4 border-t border-ghee-gold/20 flex items-center gap-2 text-earth-900 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-ghee-600 shrink-0" />
                <span>{b.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Purity Guarantee Ribbon */}
        <div className="mt-16 p-8 rounded-3xl glass-panel border border-ghee-gold/35 flex flex-wrap items-center justify-around gap-8 text-center bg-gradient-to-r from-ivory-50/70 via-ivory-100/80 to-ivory-50/70">
          <div className="flex items-center gap-3.5">
            <ShieldCheck className="w-6 h-6 text-ghee-600 shrink-0" />
            <div className="text-left">
              <span className="text-xs uppercase font-bold text-earth-900 block tracking-wide">
                100% Lead-Free Glass
              </span>
              <span className="text-[11px] text-earth-800/60 font-light">Zero toxic microplastic leaching</span>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-ghee-gold/25 hidden md:block" />

          <div className="flex items-center gap-3.5">
            <Sparkles className="w-6 h-6 text-ghee-600 shrink-0" />
            <div className="text-left">
              <span className="text-xs uppercase font-bold text-earth-900 block tracking-wide">
                Zero Additives or Colors
              </span>
              <span className="text-[11px] text-earth-800/60 font-light">Pure golden hue from pasture beta-carotene</span>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-ghee-gold/25 hidden md:block" />

          <div className="flex items-center gap-3.5">
            <Award className="w-6 h-6 text-ghee-600 shrink-0" />
            <div className="text-left">
              <span className="text-xs uppercase font-bold text-earth-900 block tracking-wide">
                NABL Accredited Lab Tested
              </span>
              <span className="text-[11px] text-earth-800/60 font-light">Batch certificate verified purity</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
