import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GoldenLeavesIntroProps {
  onExploreClick?: () => void;
}

export const GoldenLeavesIntro: React.FC<GoldenLeavesIntroProps> = ({ onExploreClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Studio Lighting for rich golden reflections
    const ambientLight = new THREE.AmbientLight(0xfff7e6, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffe28a, 3.5);
    dirLight1.position.set(10, 15, 12);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd4af37, 2.0);
    dirLight2.position.set(-12, -8, 8);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffd700, 3, 25);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Create Organic Curved Leaf Geometry
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, -1.8);
    leafShape.bezierCurveTo(1.2, -0.9, 1.5, 0.7, 0, 2.2);
    leafShape.bezierCurveTo(-1.5, 0.7, -1.2, -0.9, 0, -1.8);

    const leafGeo = new THREE.ShapeGeometry(leafShape, 16);
    // Subtle curve along the vein
    const pos = leafGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const curve = -Math.sin((x / 1.5) * Math.PI * 0.5) * 0.25 - (y * y * 0.02);
      pos.setZ(i, curve);
    }
    leafGeo.computeVertexNormals();

    // Luxurious gold material
    const leafMat = new THREE.MeshPhysicalMaterial({
      color: 0xdfa837,
      emissive: 0x5a3f08,
      roughness: 0.28,
      metalness: 0.88,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      side: THREE.DoubleSide,
    });

    const leafGroup = new THREE.Group();
    scene.add(leafGroup);

    interface LeafData {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      driftSpeed: number;
      driftOffset: number;
    }

    const leaves: LeafData[] = [];
    const LEAF_COUNT = 32;

    for (let i = 0; i < LEAF_COUNT; i++) {
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      
      const x = (Math.random() - 0.5) * 26;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 16;
      
      const scale = 0.45 + Math.random() * 0.75;
      leaf.scale.set(scale, scale, scale);

      leaf.position.set(x, y, z);
      leaf.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      leafGroup.add(leaf);

      leaves.push({
        mesh: leaf,
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeedX: (Math.random() - 0.5) * 0.012,
        rotSpeedY: (Math.random() - 0.5) * 0.016,
        rotSpeedZ: (Math.random() - 0.5) * 0.01,
        driftSpeed: 0.4 + Math.random() * 0.6,
        driftOffset: Math.random() * 100,
      });
    }

    // Mouse Parallax Interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2.5;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      leafGroup.position.x = mouseX;
      leafGroup.position.y = mouseY;

      // Animate each leaf gently
      leaves.forEach((l) => {
        l.mesh.rotation.x += l.rotSpeedX;
        l.mesh.rotation.y += l.rotSpeedY;
        l.mesh.rotation.z += l.rotSpeedZ;

        // Floating up and down wave
        const wave = Math.sin(elapsed * l.driftSpeed + l.driftOffset) * 0.8;
        const sway = Math.cos(elapsed * (l.driftSpeed * 0.7) + l.driftOffset) * 0.5;
        l.mesh.position.y = l.baseY + wave;
        l.mesh.position.x = l.baseX + sway;
      });

      renderer.render(scene, camera);
    };
    animate();

    // GSAP ScrollTrigger to scatter leaves outward and fade out as user scrolls down
    const ctx = gsap.context(() => {
      gsap.to(leafGroup.position, {
        z: -25,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        }
      });

      // Scatter leaves to the sides
      leaves.forEach((l) => {
        const scatterX = l.baseX > 0 ? l.baseX + 25 : l.baseX - 25;
        const scatterY = l.baseY > 0 ? l.baseY + 15 : l.baseY - 15;
        gsap.to(l.mesh.position, {
          x: scatterX,
          y: scatterY,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          }
        });
      });

      if (textRef.current) {
        gsap.to(textRef.current, {
          opacity: 0,
          y: -80,
          scale: 0.95,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '60% top',
            scrub: 0.8,
          }
        });
      }
    }, container);

    const handleResize = () => {
      if (!canvas) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      ctx.revert();
      renderer.dispose();
      leafGeo.dispose();
      leafMat.dispose();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[100vh] overflow-hidden bg-gradient-to-b from-[#FAF7EE] via-[#F4EFE0] to-[#FAF7EE] flex items-center justify-center select-none"
    >
      {/* 3D Golden Leaves Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10" 
      />

      {/* Warm Ambient Radial Backdrop Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none z-0" />

      {/* Intro Editorial Content */}
      <div 
        ref={textRef} 
        className="relative z-20 text-center max-w-4xl px-6 flex flex-col items-center pointer-events-auto"
      >
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-ghee-gold/30 bg-ivory-100/70 backdrop-blur-md mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-ghee-500 animate-pulse" />
          <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-ghee-700">
            Sacred Dairy Heritage • 100% Vedic
          </span>
        </div>

        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-earth-900 leading-[1.08] mb-6">
          The Pure Essence <br />
          <span className="italic font-light text-ghee-600">of Living Gold</span>
        </h1>

        <p className="max-w-xl text-base sm:text-lg text-earth-800/80 font-light leading-relaxed mb-10">
          Hand-churned from pasture-fed Vedic A2 curd, slow-clarified over gentle embers, 
          and preserved in pure glass for those who honor sacred nourishment.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onExploreClick}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-earth-900 text-ivory-50 text-sm font-medium tracking-wide overflow-hidden shadow-luxury hover:bg-ghee-700 transition-all duration-300"
          >
            <span className="relative z-10">Discover The Craft</span>
            <svg 
              className="w-4 h-4 text-ghee-400 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <a
            href="#story"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-ghee-gold/40 text-earth-900 text-sm font-medium hover:bg-ivory-200/50 transition-colors"
          >
            Watch Journey
          </a>
        </div>

        {/* Scroll down prompt */}
        <div className="mt-16 flex flex-col items-center gap-2 text-earth-900/60 animate-bounce">
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Scroll to explore</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};
