import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROCESS_STAGES, type ProcessStage } from '../data/processStages';
import { ArtisanIllustration } from './ArtisanIllustration';
import { Clock, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const GheeProcessSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);

  const currentStage: ProcessStage = PROCESS_STAGES[activeStepIndex] || PROCESS_STAGES[0];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalStages = PROCESS_STAGES.length;

    const ctx = gsap.context(() => {
      // Pinned scroll-controlled sequence
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${totalStages * 750}`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress; // 0 to 1
          setScrollProgress(p);

          // Calculate current stage
          const exactIndex = p * (totalStages - 1);
          const stageIndex = Math.min(Math.floor(exactIndex), totalStages - 1);
          const intraStage = exactIndex - stageIndex;

          setActiveStepIndex(stageIndex);
          setStageProgress(intraStage);
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Allow manual clicking of stages
  const handleStageSelect = (index: number) => {
    setActiveStepIndex(index);
    setStageProgress(0.5);
  };

  return (
    <section
      id="story"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#FAF7EE] py-16 px-6 sm:px-12 lg:px-20 flex items-center justify-center overflow-hidden border-t border-b border-ghee-gold/20"
    >
      {/* Background Subtle Organic Watermark */}
      <div className="absolute right-0 bottom-0 w-96 h-96 opacity-5 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="#CA8A04">
          <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,87.6,-1.4C85.2,13.5,77.8,27.1,68.9,39.1C60,51.1,49.6,61.6,37.2,69.5C24.8,77.4,10.4,82.8,-3.7,89.2C-17.8,95.6,-31.6,103.1,-43.7,98.1C-55.8,93.1,-66.2,75.6,-73.4,59.3C-80.6,43,-84.6,27.9,-84.8,13.1C-85,-1.7,-81.4,-16.2,-74.6,-28.9C-67.8,-41.6,-57.8,-52.5,-45.6,-60.7C-33.4,-68.9,-19,-74.4,-2.4,-70.2C14.2,-66,28.4,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div
        ref={contentWrapperRef}
        className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
      >
        {/* Left Column: Handcrafted Illustrated Dairy Artisan Display */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <ArtisanIllustration
            currentStage={currentStage}
            scrollProgress={scrollProgress}
            stageProgress={stageProgress}
          />

          {/* Interactive Stage Picker Dots / Timeline */}
          <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3 flex-wrap max-w-md">
            {PROCESS_STAGES.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => handleStageSelect(idx)}
                className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                  idx === activeStepIndex
                    ? 'w-10 h-7 bg-earth-900 text-ivory-50 text-xs font-bold shadow-md'
                    : 'w-7 h-7 bg-ivory-200 text-earth-800/70 text-[11px] font-medium hover:bg-ghee-300'
                }`}
                title={s.title}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Anchored Heading “FROM SEED TO BOTTLE” & Dynamic Step Story */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          {/* Anchored Top Heading */}
          <div className="border-b border-ghee-gold/30 pb-6 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ivory-200/80 text-ghee-800 text-[11px] font-bold tracking-[0.25em] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-ghee-600" />
              <span>Sacred Alchemy of Clarification</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-earth-900 tracking-tight leading-none uppercase">
              From Seed <span className="italic font-serif font-normal text-ghee-700">To Bottle</span>
            </h2>

            <p className="mt-2 text-xs text-earth-800/70 font-sans tracking-wide">
              *The Authentic Vedic Dairy Craft: From pristine pasture forage to golden elixir.
            </p>
          </div>

          {/* Dynamic Stage Details Card */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-ghee-gold/40 shadow-luxury transition-all duration-500 min-h-[380px] flex flex-col justify-between">
            {/* Step Counter & Metric badge */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-ghee-700 bg-ghee-100 px-3 py-1 rounded-full border border-ghee-gold/30">
                  {currentStage.stageNumber}
                </span>

                <div className="flex items-center gap-2 text-earth-800 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5 text-ghee-600" />
                  <span>{currentStage.metric}</span>
                  <span className="text-earth-800/50">({currentStage.metricLabel})</span>
                </div>
              </div>

              {/* Step Title & Subtitle */}
              <h3 className="font-serif text-3xl sm:text-4xl text-earth-900 font-semibold mb-2">
                {currentStage.title}
              </h3>
              <p className="text-sm font-medium text-ghee-700 uppercase tracking-widest mb-4">
                {currentStage.subtitle}
              </p>

              {/* Description */}
              <p className="text-base text-earth-800/90 leading-relaxed font-light mb-6">
                {currentStage.description}
              </p>
            </div>

            {/* Artisan Quote */}
            <div className="border-t border-ghee-gold/20 pt-4 mt-2">
              <p className="font-serif italic text-earth-900 text-sm sm:text-base leading-snug">
                {currentStage.artisanQuote}
              </p>
              <span className="block mt-1 text-[11px] uppercase tracking-wider text-earth-800/60 font-semibold">
                — Traditional Dairy Master Craftsman
              </span>
            </div>

            {/* Stage Progress Bar inside card */}
            <div className="mt-6 pt-4 border-t border-ghee-gold/20 flex items-center justify-between gap-4">
              <div className="flex-1 h-1.5 bg-ivory-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-ghee-500 to-ghee-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${((activeStepIndex + 1) / PROCESS_STAGES.length) * 100}%`,
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStageSelect(Math.max(0, activeStepIndex - 1))}
                  disabled={activeStepIndex === 0}
                  className="p-1.5 rounded-full border border-ghee-gold/40 text-earth-900 disabled:opacity-30 hover:bg-ivory-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    handleStageSelect(
                      Math.min(PROCESS_STAGES.length - 1, activeStepIndex + 1)
                    )
                  }
                  disabled={activeStepIndex === PROCESS_STAGES.length - 1}
                  className="p-1.5 rounded-full border border-ghee-gold/40 text-earth-900 disabled:opacity-30 hover:bg-ivory-200 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
