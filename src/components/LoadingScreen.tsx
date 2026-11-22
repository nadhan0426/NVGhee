import React, { useEffect, useState, useRef } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

const CHURNING_STAGES = [
  { threshold: 0, text: 'Gathering pure A2 Gir Cow cultured milk...' },
  { threshold: 25, text: 'Traditional two-way wooden Bilona churning...' },
  { threshold: 55, text: 'Slowly clarifying makkhan over gentle embers...' },
  { threshold: 82, text: 'Filtering golden granular artisanal nectar...' },
  { threshold: 98, text: 'Sealing NV Ghee in pure amber glass...' },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDuration = 2400,
}) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [currentStageText, setCurrentStageText] = useState(CHURNING_STAGES[0].text);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background floating golden light specks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.5 + Math.random() * 3,
      speedY: -0.3 - Math.random() * 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      alpha: 0.2 + Math.random() * 0.7,
      fadeRate: 0.008 + Math.random() * 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += p.fadeRate;

        if (p.alpha > 0.8 || p.alpha < 0.1) {
          p.fadeRate = -p.fadeRate;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${Math.max(0, p.alpha)})`;
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Preloading & smooth progress interpolation
  useEffect(() => {
    // Preload loader image
    const imgLoader = new Image();
    imgLoader.src = '/images/loader.jpg';

    const startTime = performance.now();
    let animFrame: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / minDuration);

      // Ease-out cubic curve for natural anticipation
      const eased = 1 - Math.pow(1 - rawProgress, 2.6);
      const currentPercent = Math.min(100, Math.round(eased * 100));

      setProgress(currentPercent);

      // Update churning stage text
      for (let i = CHURNING_STAGES.length - 1; i >= 0; i--) {
        if (currentPercent >= CHURNING_STAGES[i].threshold) {
          setCurrentStageText(CHURNING_STAGES[i].text);
          break;
        }
      }

      if (rawProgress < 1) {
        animFrame = requestAnimationFrame(tick);
      } else {
        // Complete! Hold briefly for 250ms then trigger exit transition
        setTimeout(() => {
          setIsExiting(true);
          // Wait for smooth fade-out and scale-up before notifying parent
          setTimeout(() => {
            onComplete();
          }, 800);
        }, 250);
      }
    };

    animFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animFrame);
  }, [minDuration, onComplete]);

  return (
    <aside
      aria-label="Loading NV Ghee Experience"
      aria-live="polite"
      className={`fixed inset-0 z-[100] w-screen h-screen select-none overflow-hidden bg-black transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? 'opacity-0 scale-[1.04] pointer-events-none filter blur-sm'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
    >
      {/* -------------------------------------------------------------
          FULLSCREEN IMMERSIVE IMAGE BACKGROUND
         ------------------------------------------------------------- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="/images/loader.jpg"
          alt="NV Ghee Pure Vedic Experience"
          className={`w-full h-full object-cover object-center transform transition-transform duration-[3000ms] ease-out ${
            isExiting ? 'scale-110' : 'scale-100'
          }`}
        />

        {/* Cinematic Vignette & Gradient Overlays for readable text and depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_30%,rgba(0,0,0,0.45)_100%)] pointer-events-none" />
      </div>

      {/* Floating Golden Particles on Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* -------------------------------------------------------------
          TOP HEADER BRAND BADGE
         ------------------------------------------------------------- */}
      <div className="absolute top-6 sm:top-10 left-6 sm:left-12 z-20 flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-ghee-400 animate-ping" />
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          NV Artisanal Vedic Reserve
        </span>
      </div>

      <div className="hidden sm:flex absolute top-6 sm:top-10 right-6 sm:right-12 z-20 items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <span>A2 Gir Cow Milk</span>
        <span>•</span>
        <span>Est. 1948</span>
      </div>

      {/* -------------------------------------------------------------
          BOTTOM LUXURY PROGRESS & PROCESS OVERLAY
         ------------------------------------------------------------- */}
      <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 z-20 flex flex-col items-center px-6">
        
        {/* Dynamic Churning Stage Text */}
        <p className="text-sm sm:text-base text-amber-100 font-serif italic tracking-wide mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center">
          {currentStageText}
        </p>

        {/* Sleek Golden Glow Progress Bar */}
        <div className="w-full max-w-md h-2 bg-white/20 backdrop-blur-md rounded-full overflow-hidden p-0.5 relative mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/25">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-200 rounded-full transition-all duration-150 ease-out relative shadow-[0_0_12px_#FACC15]"
            style={{ width: `${progress}%` }}
          >
            {/* Glowing leading light */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#FFF]" />
          </div>
        </div>

        {/* Progress percentage & Bilona details */}
        <div className="flex items-center justify-between w-full max-w-md text-xs text-white/85 font-medium tracking-wider">
          <span className="uppercase text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Traditional Bilona
          </span>
          <span className="font-serif text-white font-bold tracking-widest text-sm drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            {progress}%
          </span>
          <span className="uppercase text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            100% Pure Gir Cow
          </span>
        </div>
      </div>
    </aside>
  );
};
