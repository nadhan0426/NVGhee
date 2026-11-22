import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GheeJar3D } from './GheeJar3D';
import heroFallback from '../assets/hero.png';
import { Sparkles, Compass } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 192;

interface HeroSectionProps {
  isReady?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isReady = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const framesCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const editorialOverlayRef = useRef<HTMLDivElement>(null);

  const [activeMode, setActiveMode] = useState<'film' | 'interactive3d'>('film');
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cached frame images
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<{ index: number }>({ index: 0 });

  // -------------------------------------------------------------
  // 1. FRAME RENDERING FUNCTION (HIGH DPI & COVER FIT)
  // -------------------------------------------------------------
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = framesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    if (canvasWidth === 0 || canvasHeight === 0) return;

    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate aspect ratio cover fit
    const hRatio = canvasWidth / imgWidth;
    const vRatio = canvasHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const centerShiftX = (canvasWidth - imgWidth * ratio) / 2;
    const centerShiftY = (canvasHeight - imgHeight * ratio) / 2;

    ctx.drawImage(
      img,
      0,
      0,
      imgWidth,
      imgHeight,
      centerShiftX,
      centerShiftY,
      imgWidth * ratio,
      imgHeight * ratio
    );
  }, []);

  // -------------------------------------------------------------
  // 2. PRELOAD GHEE FRAMES (192 WebP with fallback to PNG)
  // -------------------------------------------------------------
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    // Prioritize frame 1 for instant display
    const firstImg = new Image();
    firstImg.src = '/frames-webp/frame_000001.webp';
    firstImg.onload = () => {
      images[0] = firstImg;
      imagesRef.current[0] = firstImg;
      renderFrame(0);
      setIsLoaded(true);
    };
    firstImg.onerror = () => {
      if (firstImg.src.includes('/frames-webp/')) {
        firstImg.src = '/frames/frame_000001.png';
      } else if (!firstImg.src.includes(heroFallback)) {
        firstImg.src = heroFallback;
      }
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(6, '0');
      img.src = `/frames-webp/frame_${paddedIndex}.webp`;

      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        if (i === 1) {
          renderFrame(0);
        }
      };

      img.onerror = () => {
        if (img.src.includes('/frames-webp/')) {
          img.src = `/frames/frame_${paddedIndex}.png`;
        } else if (!img.src.includes(heroFallback)) {
          img.src = heroFallback;
        }
      };

      images.push(img);
    }

    imagesRef.current = images;
    // Frame zero is loaded separately so the first visual can appear immediately.
    imagesRef.current[0] = firstImg;
  }, [renderFrame]);

  // -------------------------------------------------------------
  // 3. FRAMES CANVAS RESIZE HANDLER
  // -------------------------------------------------------------
  useEffect(() => {
    const handleResize = () => {
      const canvas = framesCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      renderFrame(Math.round(currentFrameRef.current.index));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrame]);

  // -------------------------------------------------------------
  // 4. SUBTLE ETHEREAL GOLDEN LIGHT DUST (LIGHTWEIGHT & ELEGANT)
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
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

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      maxOpacity: number;
      fadeSpeed: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 24; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1 + Math.random() * 2,
        speedY: -0.2 - Math.random() * 0.3,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5,
        maxOpacity: 0.3 + Math.random() * 0.4,
        fadeSpeed: 0.005 + Math.random() * 0.01,
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;

        if (p.opacity > p.maxOpacity || p.opacity < 0.05) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        // Golden soft halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 169, 60, ${Math.max(0, p.opacity)})`;
        ctx.shadowColor = '#D4AF37';
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      animId = requestAnimationFrame(drawParticles);
    };
    drawParticles();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // -------------------------------------------------------------
  // 5. UNIFIED GSAP SCROLLTRIGGER (CREATED ONCE, ZERO GLITCH)
  // -------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Pin hero and scrub across all 192 frames
      gsap.to(currentFrameRef.current, {
        index: TOTAL_FRAMES - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=2500',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: () => {
            renderFrame(Math.round(currentFrameRef.current.index));
          },
        },
      });

      // Subtle editorial framing fades out as scroll deepens
      if (editorialOverlayRef.current) {
        gsap.to(editorialOverlayRef.current, {
          opacity: 0,
          y: -30,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '+=800',
            scrub: 0.8,
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, [renderFrame]);

  // Entrance reveal when loading finishes
  useEffect(() => {
    if (isReady && editorialOverlayRef.current) {
      gsap.fromTo(
        editorialOverlayRef.current,
        { opacity: 0, y: 30, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out', delay: 0.15 }
      );
    }
  }, [isReady]);

  // Mode Switch without glitch
  const handleModeSwitch = (mode: 'film' | 'interactive3d') => {
    setActiveMode(mode);
    if (mode === 'film') {
      setTimeout(() => {
        renderFrame(Math.round(currentFrameRef.current.index));
      }, 50);
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-[100vh] bg-[#FAF7EE] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* -------------------------------------------------------------
          LAYER 0: CINEMATIC GHEE FRAMES CANVAS (MAIN BACKDROP)
         ------------------------------------------------------------- */}
      <canvas
        ref={framesCanvasRef}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${
          activeMode === 'interactive3d' ? 'opacity-20 blur-sm' : isLoaded ? 'opacity-100' : 'opacity-90'
        }`}
      />

      {/* Gentle vignette edges */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-[#FAF7EE]/90 via-transparent to-[#FAF7EE]/30" />
      <div className="absolute inset-0 pointer-events-none z-10 bg-radial-glow opacity-60" />

      {/* -------------------------------------------------------------
          LAYER 1: ETHEREAL GOLDEN LIGHT PARTICLES
         ------------------------------------------------------------- */}
      <canvas
        ref={particlesCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* -------------------------------------------------------------
          LAYER 2: INTERACTIVE 3D JAR (CROSS-FADED ON DEMAND)
         ------------------------------------------------------------- */}
      <div
        className={`absolute inset-0 z-20 flex items-center justify-center p-4 transition-all duration-500 ${
          activeMode === 'interactive3d'
            ? 'opacity-100 pointer-events-auto scale-100'
            : 'opacity-0 pointer-events-none scale-95'
        }`}
      >
        <div className="w-full max-w-4xl mx-auto">
          <GheeJar3D />
        </div>
      </div>

      {/* -------------------------------------------------------------
          LAYER 3: SLEEK LUXURY EDITORIAL OVERLAYS (UNOBSTRUCTED CENTER)
         ------------------------------------------------------------- */}
      <div
        ref={editorialOverlayRef}
        className={`relative z-20 pointer-events-none flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto w-full h-full transition-opacity duration-300 ${
          activeMode === 'interactive3d' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Top Metadata Row (Comfortably below Navbar) */}
        <div className="flex justify-between items-center pt-24 text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-ghee-800/80">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ghee-600 animate-pulse" />
            <span>Sacred Bilona Churned</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-earth-800/70">
            <span>A2 Gir Cow Milk</span>
            <span>•</span>
            <span>Est. 1948</span>
          </div>
        </div>

        {/* The center is completely CLEAN and UNBLOCKED so the jar label NV GHEE shines! */}

        {/* Bottom Editorial Caption & Scroll Prompts */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pb-6">
          <div className="max-w-md pointer-events-auto">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-ghee-700 block mb-1">
              Pure Artisanal Reserve
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-earth-900 font-light tracking-tight leading-snug">
              Living Gold in Pure Glass
            </h2>
            <p className="text-xs text-earth-800/70 font-light mt-1.5 leading-relaxed">
              Cultured from grass-fed whole curd, slowly clarified over gentle embers, 
              preserving its sacred granular texture.
            </p>
          </div>

          {/* Scroll Down Affordance */}
          <div className="flex items-center gap-3 text-earth-800/70 text-[11px] tracking-widest uppercase font-medium">
            <span>Scroll to unfold story</span>
            <div className="w-5 h-8 rounded-full border border-earth-900/30 flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-ghee-600 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          LAYER 4: DISCREET FLOATING MODE SWITCHER (BOTTOM RIGHT)
         ------------------------------------------------------------- */}
      <div className="absolute bottom-8 right-6 sm:right-12 z-30 flex items-center bg-ivory-100/90 backdrop-blur-md p-1.5 rounded-full border border-ghee-gold/40 shadow-xl">
        <button
          onClick={() => handleModeSwitch('film')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            activeMode === 'film'
              ? 'bg-earth-900 text-ivory-50 shadow-sm'
              : 'text-earth-800 hover:text-earth-950'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-ghee-400" />
          <span>Cinematic Film</span>
        </button>

        <button
          onClick={() => handleModeSwitch('interactive3d')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            activeMode === 'interactive3d'
              ? 'bg-earth-900 text-ivory-50 shadow-sm'
              : 'text-earth-800 hover:text-earth-950'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-ghee-400" />
          <span>3D Jar View</span>
        </button>
      </div>

      {/* Frame Loading Indicator (subtle bottom bar) */}
      {loadProgress < 100 && (
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-ivory-200 z-40">
          <div
            className="h-full bg-ghee-500 transition-all duration-300"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
      )}
    </section>
  );
};
