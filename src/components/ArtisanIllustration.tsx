import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProcessStage } from '../data/processStages';

interface ArtisanIllustrationProps {
  currentStage: ProcessStage;
  scrollProgress: number; // 0 to 1 across the section
  stageProgress: number; // 0 to 1 within the current stage
}

export const ArtisanIllustration: React.FC<ArtisanIllustrationProps> = ({
  currentStage,
  stageProgress,
}) => {
  // Calculate dynamic liquid height for stage 7 (bottle filling)
  const liquidHeightPercent = useMemo(() => {
    if (currentStage.step < 7) return currentStage.liquidFillPercent;
    if (currentStage.step === 7) {
      // Scale from 20% to 92% based on stageProgress
      return 20 + stageProgress * 72;
    }
    return 100;
  }, [currentStage.step, currentStage.liquidFillPercent, stageProgress]);

  return (
    <div className="relative w-full aspect-square max-w-[540px] lg:max-w-[600px] mx-auto rounded-3xl overflow-hidden shadow-luxury border border-ghee-gold/30 bg-[#FAF6ED]">
      {/* Base Handcrafted Watercolor Illustration with Smooth Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage.step}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentStage.image}
            alt={currentStage.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Clean Dynamic Overlays without intrusive artificial vector lines */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Stage 4: Clean Badge Only */}
        {currentStage.step === 4 && (
          <div className="absolute bottom-6 right-6 px-3.5 py-1.5 rounded-full bg-ivory-100/90 backdrop-blur-md border border-ghee-gold/40 text-[11px] font-semibold text-ghee-800 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-ghee-500 animate-ping" />
            <span>Bi-directional Bilona Churning</span>
          </div>
        )}

        {/* Stage 5: Clean Badge Only */}
        {currentStage.step === 5 && (
          <div className="absolute bottom-6 right-6 px-3.5 py-1.5 rounded-full bg-ivory-100/90 backdrop-blur-md border border-ghee-gold/40 text-[11px] font-semibold text-ghee-800 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Slow Embers • 110°C Simmer</span>
          </div>
        )}

        {/* Stage 6: Clean Badge Only */}
        {currentStage.step === 6 && (
          <div className="absolute bottom-6 right-6 px-3.5 py-1.5 rounded-full bg-ivory-100/90 backdrop-blur-md border border-ghee-gold/40 text-[11px] font-semibold text-ghee-800 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-ghee-500 animate-ping" />
            <span>Multi-layer Muslin Filtration</span>
          </div>
        )}

        {/* Stage 7: Elegant Glass Jar Fill Progress Card */}
        {currentStage.step === 7 && (
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between glass-panel p-3.5 rounded-2xl shadow-lg border border-ghee-gold/40">
            <div className="flex items-center gap-3">
              {/* Miniature Interactive Glass Jar Graphic with Animated Liquid */}
              <div className="relative w-8 h-12 rounded-t-sm rounded-b-md border-2 border-ghee-gold/60 bg-white/40 overflow-hidden flex flex-col justify-end p-0.5">
                <div
                  className="w-full bg-gradient-to-t from-ghee-600 via-ghee-400 to-ghee-300 rounded-b-sm transition-all duration-150"
                  style={{ height: `${liquidHeightPercent}%` }}
                />
                <div className="absolute top-0 left-0 w-full h-1 bg-ghee-700/60" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-ghee-800 tracking-wider block">
                  Jar Fill Status
                </span>
                <span className="text-sm font-serif font-bold text-earth-900">
                  {Math.round(liquidHeightPercent)}% Filled
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-earth-800/70 block uppercase tracking-widest">
                Sterile Glass
              </span>
              <span className="text-xs font-semibold text-ghee-700">
                Airtight Preserve
              </span>
            </div>
          </div>
        )}

        {/* Stage 8: Radiant Glow and Crown Badge */}
        {currentStage.step === 8 && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Soft ambient golden glow */}
            <div className="w-72 h-72 rounded-full bg-gradient-to-r from-ghee-300/20 to-ghee-500/15 blur-3xl animate-pulse" />
            <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-ivory-100/90 backdrop-blur-md border border-ghee-gold text-xs font-bold text-ghee-800 flex items-center gap-2 shadow-glow-gold">
              <span className="text-base">✨</span>
              <span>100% Danedar Pure Vedic Ghee</span>
            </div>
          </div>
        )}
      </div>

      {/* Subtle Frame Vignette */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl ring-1 ring-inset ring-black/5" />
    </div>
  );
};
