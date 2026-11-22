import React from 'react';
import { Leaf, Award, HeartHandshake, Package } from 'lucide-react';

export const BrandStorySection: React.FC = () => {
  const pillars = [
    {
      icon: HeartHandshake,
      title: 'Traditional Preparation',
      subtitle: 'The Vedic Curd Method',
      description:
        'We never take industrial shortcuts. Milk is cultured into whole curd overnight and churned in bi-directional wooden bilonas to separate fresh white makkhan before gentle clarification.',
    },
    {
      icon: Leaf,
      title: 'Quality-Focused Sourcing',
      subtitle: 'Free-Grazing Pasture Heritage',
      description:
        'Our milk is collected from indigenous humped Gir cows free to graze on open pastures, enjoying seasonal clover, wild medicinal grasses, and pure well water.',
    },
    {
      icon: Award,
      title: 'Careful Production',
      subtitle: 'Brass Cauldron Simmer',
      description:
        'Slow-simmered at controlled gentle temperatures in heavy brass cauldrons. This allows natural moisture evaporation without scalding, creating our signature granular danedar texture.',
    },
    {
      icon: Package,
      title: 'Premium Packaging',
      subtitle: 'UV-Shielded Glass Sanctuary',
      description:
        'Poured warm into lead-free, food-grade glass jars and hermetically sealed with gold-embossed lids to safeguard the fragrant toasted-almond aroma against oxygen and light.',
    },
  ];

  return (
    <section id="heritage" className="relative w-full py-24 px-6 sm:px-12 lg:px-20 bg-[#FAF7EE] border-t border-ghee-gold/20">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-ghee-gold/30">
          <div className="lg:col-span-7">
            <span className="text-[11px] font-bold tracking-[0.25em] text-ghee-700 uppercase block mb-3">
              Sacred Heritage & Craft
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-earth-900 font-normal tracking-tight uppercase leading-none">
              A Quiet Devotion <br />
              <span className="italic font-light text-ghee-700">to Honest Food</span>
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-sm sm:text-base text-earth-800/80 font-light leading-relaxed">
              In an era of mass commercial processing, NV Ghee preserves the quiet rhythm of 
              artisan dairy craft. Every jar is a testament to unhurried time, traditional patience, 
              and respect for living ingredients.
            </p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group relative p-8 rounded-3xl glass-panel border border-ghee-gold/30 hover:border-ghee-gold/70 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-ivory-200 border border-ghee-gold/40 flex items-center justify-center text-ghee-700 mb-6 group-hover:bg-ghee-500 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] font-bold tracking-[0.2em] text-earth-800/50 uppercase block mb-1">
                    Pillar 0{idx + 1}
                  </span>

                  <h3 className="font-serif text-2xl font-bold text-earth-900 mb-1">
                    {pillar.title}
                  </h3>

                  <p className="text-xs uppercase tracking-wider text-ghee-700 font-semibold mb-4">
                    {pillar.subtitle}
                  </p>

                  <p className="text-xs text-earth-800/80 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-ghee-gold/20 flex items-center justify-between text-[11px] text-earth-800/60 font-medium">
                  <span>Vedic Standards</span>
                  <span className="text-ghee-600 font-bold">100% Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Culinary Pairing Monograph Strip */}
        <div className="mt-16 p-8 rounded-3xl bg-ivory-100/90 border border-ghee-gold/40 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-ghee-gold/20">
          <div className="px-4">
            <span className="font-serif text-lg font-bold text-earth-900 block mb-1">
              Morning Saffron Elixir
            </span>
            <p className="text-xs text-earth-800/70 font-light">
              Melt half a teaspoon into warm golden saffron milk or herbal tea for a soothing start.
            </p>
          </div>
          <div className="px-4 pt-4 md:pt-0">
            <span className="font-serif text-lg font-bold text-earth-900 block mb-1">
              Artisan Crust & Sourdough
            </span>
            <p className="text-xs text-earth-800/70 font-light">
              Brush over fresh out-of-the-oven sourdough or crisp rotis for a fragrant nutty aroma.
            </p>
          </div>
          <div className="px-4 pt-4 md:pt-0">
            <span className="font-serif text-lg font-bold text-earth-900 block mb-1">
              High-Heat Culinary Sear
            </span>
            <p className="text-xs text-earth-800/70 font-light">
              With a high 250°C smoke point, sear vegetables and spices without burning or smoking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
