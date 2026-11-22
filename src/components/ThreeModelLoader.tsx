import React from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';

interface ThreeModelLoaderProps {
  progress: number;
  stage: 'downloading' | 'decoding' | 'ready';
  error: string | null;
  onRetry: () => void;
  isVisible: boolean;
}

export const ThreeModelLoader: React.FC<ThreeModelLoaderProps> = ({
  progress,
  stage,
  error,
  onRetry,
  isVisible,
}) => {
  // SVG circle calculations for smooth circular progress
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const stageLabel =
    stage === 'downloading'
      ? 'Downloading 3D Environment...'
      : stage === 'decoding'
      ? 'Clarifying Vedic Geometry...'
      : 'Rendering Amber Glass...';

  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 backdrop-blur-[2px]' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        background: isVisible
          ? 'radial-gradient(ellipse at 50% 50%, rgba(20, 37, 27, 0.75) 0%, rgba(20, 37, 27, 0.4) 65%, transparent 100%)'
          : 'transparent',
      }}
      aria-live="polite"
    >
      {error ? (
        // Error & Retry Display
        <div className="pointer-events-auto max-w-sm mx-auto p-6 rounded-3xl bg-[#1A2E22]/95 border border-[#D9AE45]/40 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 rounded-full bg-[#D9AE45]/15 border border-[#D9AE45]/40 flex items-center justify-center mx-auto mb-3 text-[#D9AE45]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg text-[#F8F0DF] font-semibold mb-1">
            3D Initialization Paused
          </h3>
          <p className="text-xs text-[#F8F0DF]/75 mb-4 leading-relaxed">
            {error || 'Unable to download 3D assets. Check your network connection.'}
          </p>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D9AE45] hover:bg-[#edd48a] text-[#14251B] text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(217,174,69,0.5)] active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      ) : (
        // Premium Centered Animated Gold Circular Loader
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Outer subtle decorative glow */}
            <div className="absolute inset-0 rounded-full bg-[#D9AE45]/10 filter blur-md animate-pulse" />

            {/* SVG Circular Progress Bar */}
            <svg
              className="w-full h-full -rotate-90 transform"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="goldLoaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5CD5F" />
                  <stop offset="50%" stopColor="#D9AE45" />
                  <stop offset="100%" stopColor="#B88A2D" />
                </linearGradient>
              </defs>

              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#D9AE45"
                strokeOpacity="0.18"
                strokeWidth="3.5"
              />

              {/* Active Animated Progress Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="url(#goldLoaderGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-[stroke-dashoffset] duration-300 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(217, 174, 69, 0.6))',
                }}
              />
            </svg>

            {/* Inner Percentage Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-serif font-bold text-xl text-[#F8F0DF] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {progress}%
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#D9AE45] font-semibold">
                VEDIC
              </span>
            </div>
          </div>

          {/* Luxury Label & Dynamic Stage Subtitle */}
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-[#D9AE45] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              INITIALIZING 3D ENVIRONMENT
            </span>
            <span className="text-[11px] text-[#F8F0DF]/75 font-light tracking-wide mt-1">
              {stageLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
