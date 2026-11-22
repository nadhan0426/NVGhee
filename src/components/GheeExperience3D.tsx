import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ShieldCheck, Flame, Droplets, Award, Compass } from 'lucide-react';
import { loadGheeJarModel, clearModelCache } from '../utils/modelLoader';
import { ThreeModelLoader } from './ThreeModelLoader';

gsap.registerPlugin(ScrollTrigger);

interface GheeExperience3DProps {
  onModelLoaded?: () => void;
}

export const GheeExperience3D: React.FC<GheeExperience3DProps> = ({ onModelLoaded }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Overlay DOM element refs for GSAP ScrollTrigger timeline
  const heroContentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const storyPanelLeftRef = useRef<HTMLDivElement>(null);
  const storyPanelRightRef = useRef<HTMLDivElement>(null);
  const transitionOverlayRef = useRef<HTMLDivElement>(null);

  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState<'downloading' | 'decoding' | 'ready'>('downloading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  // Store 3D model transforms to coordinate between GSAP and Three.js render loop
  const animStateRef = useRef({
    // Jar Position
    posX: 0,
    posY: 0,
    posZ: 0,
    // Jar Rotation: 0 aligns the front label squarely to the camera
    rotX: 0.04,
    rotY: 0,
    rotZ: 0,
    // Scale
    scale: 2.05,
    // Mouse Parallax Offsets
    targetMouseX: 0,
    targetMouseY: 0,
    currentMouseX: 0,
    currentMouseY: 0,
    // Idle rotation factor
    idleSpeed: 1.0,
    // Shadow Opacity and Scale
    shadowOpacity: 0.42,
    shadowScale: 1.0,
  });

  // Track viewport size for responsive 3D framing
  const responsiveConfigRef = useRef({
    isMobile: false,
    desktopXOffset: 1.65,
    baseScale: 2.05,
  });

  const checkViewport = useCallback(() => {
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    responsiveConfigRef.current.isMobile = isMobile;
    if (isMobile) {
      responsiveConfigRef.current.baseScale = 1.6;
      responsiveConfigRef.current.desktopXOffset = 0.0;
      animStateRef.current.scale = 1.6;
    } else if (isTablet) {
      responsiveConfigRef.current.baseScale = 1.85;
      responsiveConfigRef.current.desktopXOffset = 1.3;
      animStateRef.current.scale = 1.85;
    } else {
      responsiveConfigRef.current.baseScale = 2.05;
      responsiveConfigRef.current.desktopXOffset = 1.65;
      animStateRef.current.scale = 2.05;
    }
  }, []);

  const onModelLoadedRef = useRef(onModelLoaded);
  useEffect(() => {
    onModelLoadedRef.current = onModelLoaded;
  }, [onModelLoaded]);

  // -------------------------------------------------------------
  // THREE.JS SCENE SETUP, MODEL LOADING & GSAP TIMELINE
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    checkViewport();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.15, 6.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setLoadError('WebGL is not supported on this device.');
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    const isMobileDevice = responsiveConfigRef.current.isMobile;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileDevice ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isMobileDevice;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // 2. High-End Cinematic Dark Studio Reflection Environment (Procedural PMREM)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext('2d');
    if (envCtx) {
      // Atmospheric deep forest green & dark olive studio gradient
      const bgGrad = envCtx.createLinearGradient(0, 0, 0, 512);
      bgGrad.addColorStop(0, '#14251B');
      bgGrad.addColorStop(0.4, '#1C3224');
      bgGrad.addColorStop(0.8, '#26382A');
      bgGrad.addColorStop(1, '#14251B');
      envCtx.fillStyle = bgGrad;
      envCtx.fillRect(0, 0, 1024, 512);

      // Key Warm Golden Softbox (Top Right - defines ghee luminosity and label)
      const keyGrad = envCtx.createRadialGradient(720, 140, 20, 720, 140, 260);
      keyGrad.addColorStop(0, 'rgba(255, 248, 225, 0.95)');
      keyGrad.addColorStop(0.35, 'rgba(217, 174, 69, 0.65)');
      keyGrad.addColorStop(0.7, 'rgba(180, 138, 45, 0.2)');
      keyGrad.addColorStop(1, 'rgba(20, 37, 27, 0)');
      envCtx.fillStyle = keyGrad;
      envCtx.fillRect(450, 0, 550, 360);

      // Controlled Warm Golden Rim Softbox (Left side - outlines glass silhouette)
      const rimGrad = envCtx.createRadialGradient(260, 110, 15, 260, 110, 240);
      rimGrad.addColorStop(0, 'rgba(245, 205, 95, 0.9)');
      rimGrad.addColorStop(0.4, 'rgba(217, 174, 69, 0.5)');
      rimGrad.addColorStop(0.8, 'rgba(38, 56, 42, 0.15)');
      rimGrad.addColorStop(1, 'rgba(20, 37, 27, 0)');
      envCtx.fillStyle = rimGrad;
      envCtx.fillRect(40, 0, 440, 340);

      // Soft top overhead fill
      const topGrad = envCtx.createRadialGradient(512, 40, 10, 512, 40, 200);
      topGrad.addColorStop(0, 'rgba(248, 240, 223, 0.45)');
      topGrad.addColorStop(1, 'rgba(20, 37, 27, 0)');
      envCtx.fillStyle = topGrad;
      envCtx.fillRect(200, 0, 624, 180);

      const envTexture = new THREE.CanvasTexture(envCanvas);
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = pmremGenerator.fromEquirectangular(envTexture).texture;
      envTexture.dispose();
      pmremGenerator.dispose();
    }

    // 3. Realistic Dark Studio Lighting (Preserves authentic golden-yellow ghee & label legibility)
    const ambientLight = new THREE.AmbientLight(0xd9e5d9, 0.85);
    scene.add(ambientLight);

    // Warm Studio Key Light: Illuminates front label and natural ghee amber tones
    const keyLight = new THREE.DirectionalLight(0xfff6e5, 3.2);
    keyLight.position.set(3.8, 6.2, 5.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // Controlled Warm Golden Rim Lighting: Accentuates glass silhouette against dark backdrop
    const rimLight1 = new THREE.DirectionalLight(0xd9ae45, 4.4);
    rimLight1.position.set(-5.2, 3.8, -3.8);
    scene.add(rimLight1);

    // Secondary subtle rim light on opposite side for depth definition
    const rimLight2 = new THREE.DirectionalLight(0xedd48a, 2.6);
    rimLight2.position.set(5.2, 3.2, -4.0);
    scene.add(rimLight2);

    // Front soft fill light ensuring label is clear and balanced
    const fillLight = new THREE.DirectionalLight(0xfffaee, 1.4);
    fillLight.position.set(0.1, 1.2, 5.0);
    scene.add(fillLight);

    // Warm golden pedestal bounce light
    const bounceLight = new THREE.PointLight(0xd9ae45, 1.2, 9);
    bounceLight.position.set(0, -2.2, 2.2);
    scene.add(bounceLight);

    // 4. Contact Shadow & Grounding Plane (Deep velvety shadow for dark background)
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(256, 256, 25, 256, 256, 240);
      grad.addColorStop(0, 'rgba(6, 12, 8, 0.78)');
      grad.addColorStop(0.3, 'rgba(10, 19, 13, 0.48)');
      grad.addColorStop(0.65, 'rgba(18, 33, 23, 0.16)');
      grad.addColorStop(0.9, 'rgba(20, 37, 27, 0.02)');
      grad.addColorStop(1, 'rgba(20, 37, 27, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 512, 512);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: animStateRef.current.shadowOpacity,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.02;
    scene.add(shadowMesh);

    // Elegant Metallic Gold platform pedestal rim ring matching jar footprint
    const pedestalGeo = new THREE.RingGeometry(0.52, 0.70, 64);
    const pedestalMat = new THREE.MeshBasicMaterial({
      color: 0xd9ae45,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.rotation.x = -Math.PI / 2;
    pedestalMesh.position.y = -1.015;
    scene.add(pedestalMesh);

    // 5. Floating Golden Dust Halo Particles (Soft golden embers against dark atmosphere)
    const particleCount = 42;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 5.5;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5.0;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.003;
      particleVelocities[i * 3 + 1] = 0.002 + Math.random() * 0.004;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      pGrad.addColorStop(0, 'rgba(255, 248, 225, 1)');
      pGrad.addColorStop(0.35, 'rgba(217, 174, 69, 0.85)');
      pGrad.addColorStop(0.7, 'rgba(180, 138, 45, 0.2)');
      pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pCtx.fillStyle = pGrad;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      color: 0xd9ae45,
      size: 0.08,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Jar Group container
    const jarGroup = new THREE.Group();
    scene.add(jarGroup);



    // 7. SETUP GSAP SCROLLTRIGGER TIMELINE ON MOUNT (CLEAN & DETERMINISTIC)
    const isMobile = responsiveConfigRef.current.isMobile;
    const xOffset = isMobile ? 0.0 : responsiveConfigRef.current.desktopXOffset;
    const yMobileShift = isMobile ? -0.55 : 0;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=2600',
          pin: true,
          scrub: 1.0,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Smoothly blend out hero idle sway as scroll starts (0 to 7% progress)
            const fade = Math.max(0, 1 - self.progress * 14);
            animStateRef.current.idleSpeed = fade;
          },
        },
      });

      // -------------------------------------------------------------
      // HERO EXIT: Hero content and indicator fade out smoothly
      // -------------------------------------------------------------
      if (heroContentRef.current) {
        tl.to(
          heroContentRef.current,
          {
            opacity: 0,
            y: -36,
            filter: 'blur(4px)',
            duration: 0.35,
            ease: 'power2.inOut',
          },
          0.05
        );
      }

      if (scrollIndicatorRef.current) {
        tl.to(
          scrollIndicatorRef.current,
          {
            opacity: 0,
            duration: 0.2,
            ease: 'power1.out',
          },
          0.05
        );
      }

      // -------------------------------------------------------------
      // STAGE 1: Jar glides Center -> Right (0.35 -> 1.25)
      // Subtle 3/4 turn towards viewer/left card: rotY transitions 0 -> -0.26
      // -------------------------------------------------------------
      tl.to(
        animStateRef.current,
        {
          posX: xOffset,
          posY: yMobileShift,
          rotY: -0.26,
          rotX: 0.05,
          rotZ: -0.02,
          duration: 0.9,
          ease: 'power2.inOut',
        },
        0.35
      );

      // Story Panel Left enters smoothly as jar reaches the right side
      if (storyPanelLeftRef.current) {
        tl.fromTo(
          storyPanelLeftRef.current,
          { opacity: 0, x: -60, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.45,
            ease: 'power2.out',
          },
          0.8
        );

        // Story Panel Left fades out before next stage starts
        tl.to(
          storyPanelLeftRef.current,
          {
            opacity: 0,
            x: -40,
            scale: 0.95,
            duration: 0.35,
            ease: 'power2.in',
          },
          1.55
        );
      }

      // -------------------------------------------------------------
      // STAGE 2: Jar glides smoothly Right -> Left (1.60 -> 2.60)
      // Continuous horizontal sweep from +xOffset across center to -xOffset
      // Rotation transitions from -0.26 through 0 to +0.26 (subtle 3/4 turn towards right card)
      // -------------------------------------------------------------
      tl.to(
        animStateRef.current,
        {
          posX: -xOffset,
          posY: yMobileShift,
          rotY: 0.26,
          rotX: 0.05,
          rotZ: 0.02,
          duration: 1.0,
          ease: 'power2.inOut',
        },
        1.60
      );

      // Story Panel Right enters smoothly as jar reaches the left side
      if (storyPanelRightRef.current) {
        tl.fromTo(
          storyPanelRightRef.current,
          { opacity: 0, x: 60, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.45,
            ease: 'power2.out',
          },
          2.15
        );

        // Story Panel Right fades out before release
        tl.to(
          storyPanelRightRef.current,
          {
            opacity: 0,
            x: 40,
            scale: 0.95,
            duration: 0.35,
            ease: 'power2.in',
          },
          2.95
        );
      }

      // -------------------------------------------------------------
      // STAGE 3: Smooth return to center before unpinning (2.95 -> 3.65)
      // Jar glides from -xOffset back to 0, returning to front-facing rotY: 0
      // -------------------------------------------------------------
      tl.to(
        animStateRef.current,
        {
          posX: 0,
          posY: 0,
          rotY: 0,
          rotX: 0.04,
          rotZ: 0,
          duration: 0.7,
          ease: 'power2.inOut',
        },
        2.95
      );

      // Transition overlay smoothly blends from dark to cream as Stage 3 unpins
      if (transitionOverlayRef.current) {
        tl.fromTo(
          transitionOverlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, ease: 'power2.inOut' },
          2.95
        );
      }
    }, container);

    // 8. ASYNCHRONOUS GLB MODEL LOADING WITH DRACO & CACHING
    let isCancelled = false;

    setLoadingProgress(0);
    setLoadingStage('downloading');
    setLoadError(null);

    loadGheeJarModel((prog) => {
      if (isCancelled) return;
      setLoadingProgress(prog.percentage);
      setLoadingStage(prog.stage);
    })
      .then((model) => {
        if (isCancelled) return;

        // Add model to container
        jarGroup.add(model);

        // Pre-compile shaders so rendering starts smoothly with zero hitch
        renderer.compile(scene, camera);

        setLoadingProgress(100);
        setLoadingStage('ready');

        // Smooth entrance reveal: gently scales in and settles squarely facing the camera (rotY: 0)
        const initialScale = responsiveConfigRef.current.baseScale;
        gsap.fromTo(
          animStateRef.current,
          { scale: initialScale * 0.7, rotY: -0.25, posY: -0.2 },
          {
            scale: initialScale,
            rotY: 0,
            posY: 0,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.05,
          }
        );

        // Ground shadow entrance
        gsap.fromTo(
          shadowMat,
          { opacity: 0 },
          { opacity: 0.42, duration: 1.4, ease: 'power2.out', delay: 0.1 }
        );

        // Fade out preloader smoothly once initial render is ready
        setTimeout(() => {
          if (!isCancelled) {
            setIsLoaderVisible(false);
            if (onModelLoadedRef.current) onModelLoadedRef.current();
          }
        }, 350);
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('[GheeExperience3D] Failed to load 3D model:', err);
        setLoadError('Failed to initialize 3D model. Please check network connection.');
      });

    // 9. Interactive Mouse Parallax
    const handlePointerMove = (e: PointerEvent) => {
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;

      const nx = (clientX / width - 0.5) * 2;
      const ny = (clientY / height - 0.5) * 2;

      animStateRef.current.targetMouseX = nx * 0.18;
      animStateRef.current.targetMouseY = ny * 0.12;
    };
    window.addEventListener('pointermove', handlePointerMove);

    // 10. Pause rendering when outside viewport to optimize GPU & battery
    let isIntersecting = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    // 11. Render Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isIntersecting) return;

      const elapsed = clock.getElapsedTime();
      const state = animStateRef.current;

      state.currentMouseX += (state.targetMouseX - state.currentMouseX) * 0.06;
      state.currentMouseY += (state.targetMouseY - state.currentMouseY) * 0.06;

      const floatOffset = Math.sin(elapsed * 1.4) * 0.03;

      jarGroup.position.x = state.posX + state.currentMouseX * 0.35;
      jarGroup.position.y = state.posY + floatOffset - state.currentMouseY * 0.15;
      jarGroup.position.z = state.posZ;

      // Gentle natural breathing sway preserving prominent front label visibility
      const breathingSway = Math.sin(elapsed * 0.85) * 0.08 * state.idleSpeed;
      jarGroup.rotation.x = state.rotX + state.currentMouseY * 0.08;
      jarGroup.rotation.y = state.rotY + breathingSway + state.currentMouseX * 0.18;
      jarGroup.rotation.z = state.rotZ;

      // Apply dynamic scale
      jarGroup.scale.set(state.scale, state.scale, state.scale);

      // Dynamically ground contact shadow and pedestal ring right beneath the jar's base
      const jarBaseY = jarGroup.position.y - 0.5 * state.scale;
      shadowMesh.position.x = jarGroup.position.x;
      pedestalMesh.position.x = jarGroup.position.x;
      shadowMesh.position.y = jarBaseY - 0.012;
      pedestalMesh.position.y = jarBaseY - 0.006;

      const dynamicShadowScale = state.scale * (1 - floatOffset * 0.4) * state.shadowScale;
      shadowMesh.scale.set(dynamicShadowScale, dynamicShadowScale, 1);
      pedestalMesh.scale.set(state.scale, state.scale, 1);

      // Animate golden dust particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleVelocities[i * 3 + 1];
        positions[i * 3] += particleVelocities[i * 3];

        if (positions[i * 3 + 1] > 2.5) {
          positions[i * 3 + 1] = -2.2;
          positions[i * 3] = (Math.random() - 0.5) * 5.5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsed * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // 12. Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      checkViewport();

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);

      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      ctx.revert();

      renderer.dispose();
      shadowGeo.dispose();
      shadowTex.dispose();
      pedestalGeo.dispose();
      particleGeo.dispose();
      pTexture.dispose();
    };
  }, [checkViewport, retryKey]);

  const handleRetry = useCallback(() => {
    clearModelCache();
    setLoadError(null);
    setIsLoaderVisible(true);
    setLoadingProgress(0);
    setLoadingStage('downloading');
    setRetryKey((k) => k + 1);
  }, []);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full h-[100vh] bg-[#14251B] overflow-hidden select-none"
    >
      {/* -------------------------------------------------------------
          LAYER 0: CINEMATIC DARK FOREST GREEN & OLIVE ATMOSPHERE
         ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Deep Forest Green (#14251B) to Dark Olive (#26382A) base radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 42%, #26382A 0%, #1a2f22 50%, #14251B 100%)',
          }}
        />

        {/* Warm golden and olive atmospheric radial glow centered behind 3D jar */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none opacity-45 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(217, 174, 69, 0.28) 0%, rgba(38, 56, 42, 0.45) 45%, transparent 75%)',
          }}
        />

        {/* Subtle organic vertical depth gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14251B] via-transparent to-[#14251B]/60" />

        {/* Ultra-subtle tactile organic micro-texture */}
        <div
          className="absolute inset-0 opacity-[0.032] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* -------------------------------------------------------------
          LAYER 1: WEBGL 3D CANVAS (THE REAL GLB JAR)
         ------------------------------------------------------------- */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-10 block pointer-events-none"
      />

      {/* Premium Dark Green & Gold Centered Circular Loader */}
      <ThreeModelLoader
        progress={loadingProgress}
        stage={loadingStage}
        error={loadError}
        onRetry={handleRetry}
        isVisible={isLoaderVisible}
      />

      {/* -------------------------------------------------------------
          LAYER 2: SECTION 1 — IMMERSIVE HERO OVERLAYS (CENTERED & UNBLOCKED)
         ------------------------------------------------------------- */}
      <div
        ref={heroContentRef}
        className="relative z-20 pointer-events-none flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto w-full h-full"
      >
        {/* Top Heritage Badge */}
        <div className="pt-20 sm:pt-24 flex justify-between items-center text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#D9AE45]">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1A2E22]/85 backdrop-blur-md border border-[#D9AE45]/35 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#D9AE45] animate-pulse" />
            <span>Sacred Vedic Bilona Churned</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[#F8F0DF]/75 font-medium">
            <span>Grass-Fed Gir Cow Milk</span>
            <span className="text-[#D9AE45]/60">•</span>
            <span>Est. 1948</span>
          </div>
        </div>

        {/* Center of hero is open so the 3D jar shines prominently */}

        {/* Bottom Hero Caption */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pb-8">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#D9AE45]">
                Artisanal Living Gold
              </span>
              <span className="w-6 h-[1px] bg-[#D9AE45]/60" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F8F0DF] font-light tracking-tight leading-tight">
              Living Gold in Pure Glass
            </h1>
            <p className="text-xs sm:text-sm text-[#F8F0DF]/80 font-light mt-2 leading-relaxed">
              Cultured naturally from whole curd, gently clarified over low embers, preserving its
              sacred granular crystals and divine nutty aroma.
            </p>
          </div>

          {/* Interactive Hint */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1A2E22]/90 backdrop-blur-md border border-[#D9AE45]/40 shadow-lg text-[11px] font-medium text-[#F8F0DF]">
            <Compass className="w-3.5 h-3.5 text-[#D9AE45] animate-spin" style={{ animationDuration: '8s' }} />
            <span>Interactive 3D Experience</span>
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator (Hero Bottom Center) */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 text-[#F8F0DF]/70"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase font-semibold">Scroll to Explore</span>
        <div className="w-5 h-8 rounded-full border border-[#D9AE45]/40 flex justify-center pt-1.5 bg-[#1A2E22]/60 backdrop-blur-xs shadow-sm">
          <div className="w-1 h-2 bg-[#D9AE45] rounded-full animate-bounce" />
        </div>
      </div>

      {/* -------------------------------------------------------------
          LAYER 3: SECTION 2 — FIRST SCROLL STORY (LEFT GLASS PANEL)
          Triggered when jar glides toward the Right side
         ------------------------------------------------------------- */}
      <div
        ref={storyPanelLeftRef}
        className="absolute inset-y-0 left-0 z-20 flex items-center justify-start p-6 sm:p-12 lg:p-20 max-w-xl pointer-events-none opacity-0"
      >
        <div className="pointer-events-auto w-full p-8 sm:p-10 rounded-3xl bg-[#14251B]/85 backdrop-blur-xl border border-[#D9AE45]/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.65)] transition-all">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A2E22] border border-[#D9AE45]/35 text-[#D9AE45] text-[10px] font-bold tracking-[0.22em] uppercase mb-4">
            <Award className="w-3.5 h-3.5 text-[#D9AE45]" />
            <span>Sacred Vedic Heritage</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#F8F0DF] font-normal tracking-tight leading-snug mb-3">
            Pure Gir Cow <span className="italic text-[#D9AE45]">Whole Curd</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#F8F0DF]/80 font-light leading-relaxed mb-6">
            Unlike industrial ghee made from heated raw cream, NV Ghee begins with grass-fed indigenous
            Gir cows grazing freely on open pastures. Their nutrient-dense A2 milk is naturally
            cultured into whole curd overnight, honoring timeless Vedic Ayurvedic wisdom.
          </p>

          <div className="space-y-3 pt-2 border-t border-[#D9AE45]/20">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1A2E22] border border-[#D9AE45]/40 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D9AE45]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F8F0DF]">100% A2 Beta-Casein Protein</h4>
                <p className="text-[11px] text-[#F8F0DF]/70 font-light">Gentle on digestion, completely free of bloating A1 proteins.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1A2E22] border border-[#D9AE45]/40 flex items-center justify-center shrink-0 mt-0.5">
                <Droplets className="w-3.5 h-3.5 text-[#D9AE45]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F8F0DF]">Naturally Rich in Butyric Acid</h4>
                <p className="text-[11px] text-[#F8F0DF]/70 font-light">Nourishes the intestinal lining and supports mucosal immune defenses.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1A2E22] border border-[#D9AE45]/40 flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-[#D9AE45]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F8F0DF]">Lead-Free Amber Glass Reserve</h4>
                <p className="text-[11px] text-[#F8F0DF]/70 font-light">Zero microplastics leaching; preserves fresh aroma for over 12 months.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          LAYER 4: SECTION 3 — SECOND SCROLL STORY (RIGHT GLASS PANEL)
          Triggered when jar glides from Right across to the Left side
         ------------------------------------------------------------- */}
      <div
        ref={storyPanelRightRef}
        className="absolute inset-y-0 right-0 z-20 flex items-center justify-end p-6 sm:p-12 lg:p-20 max-w-xl pointer-events-none opacity-0"
      >
        <div className="pointer-events-auto w-full p-8 sm:p-10 rounded-3xl bg-[#14251B]/85 backdrop-blur-xl border border-[#D9AE45]/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.65)] transition-all">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A2E22] border border-[#D9AE45]/35 text-[#D9AE45] text-[10px] font-bold tracking-[0.22em] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D9AE45]" />
            <span>The Bilona Craftsmanship</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#F8F0DF] font-normal tracking-tight leading-snug mb-3">
            Slow-Clarified <span className="italic text-[#D9AE45]">Golden Granules</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#F8F0DF]/80 font-light leading-relaxed mb-6">
            Wooden Bilona churns operate in bidirectional clockwise and anticlockwise movements,
            coaxing out purest makkhan without mechanical friction heat. Slowly clarified over gentle
            cow-dung embers in open brass cauldrons to achieve our prized nutty bouquet.
          </p>

          <div className="space-y-3 pt-2 border-t border-[#D9AE45]/20">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1A2E22] border border-[#D9AE45]/40 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[11px] font-bold text-[#D9AE45]">01</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F8F0DF]">Bidirectional Wooden Churn</h4>
                <p className="text-[11px] text-[#F8F0DF]/70 font-light">Separates pure cultured butter fat while keeping live enzymes unharmed.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1A2E22] border border-[#D9AE45]/40 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[11px] font-bold text-[#D9AE45]">02</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F8F0DF]">High Smoke Point 250°C (485°F)</h4>
                <p className="text-[11px] text-[#F8F0DF]/70 font-light">Ideal for high-heat searing, sautéing, or pure drizzling without smoking.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1A2E22] border border-[#D9AE45]/40 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[11px] font-bold text-[#D9AE45]">03</span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#F8F0DF]">Prized Danedar Granular Texture</h4>
                <p className="text-[11px] text-[#F8F0DF]/70 font-light">Distinct tiny golden crystal granules that melt luxuriously over warm roti or rice.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          LAYER 5: REFINED GRADIENT TRANSITION INTO CREAM SECTIONS BELOW
         ------------------------------------------------------------- */}
      <div
        ref={transitionOverlayRef}
        className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent via-[#14251B]/60 to-[#FAF7EE] pointer-events-none z-30 opacity-0"
      />
    </section>
  );
};
