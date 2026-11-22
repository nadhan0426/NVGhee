import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCcw, Play, Pause, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';

export const GheeJar3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(60);
  const [isLoading, setIsLoading] = useState(true);

  // References for mouse drag & inertia controls
  const controlsRef = useRef<{
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    targetRotation: { x: number; y: number };
    currentRotation: { x: number; y: number };
    cameraDistance: number;
    targetCameraDistance: number;
    autoRotate: boolean;
  }>({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    targetRotation: { x: 0.08, y: -Math.PI / 2 },
    currentRotation: { x: 0.08, y: -Math.PI / 2 },
    cameraDistance: 6.0,
    targetCameraDistance: 6.0,
    autoRotate: true,
  });

  useEffect(() => {
    controlsRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = mountRef.current;
    if (!canvas || !container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.2, 6.0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e0, 3.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0002;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 3.2);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.3);
    fillLight.position.set(0, 1.5, 4.5);
    scene.add(fillLight);

    const bounceLight = new THREE.PointLight(0xe5a93c, 1.0, 8);
    bounceLight.position.set(0, -2, 2);
    scene.add(bounceLight);

    // 3. Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(6, 6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
      grad.addColorStop(0, 'rgba(60, 38, 14, 0.45)');
      grad.addColorStop(0.3, 'rgba(110, 70, 25, 0.22)');
      grad.addColorStop(0.65, 'rgba(197, 154, 63, 0.06)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.82;
    scene.add(shadowMesh);

    // 4. Floating Golden Particles
    const particleCount = 35;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 5.0;
      particlePos[i + 1] = (Math.random() - 0.5) * 4.0;
      particlePos[i + 2] = (Math.random() - 0.5) * 5.0;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.08,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Load the actual GLB Model with fallback resolution
    const jarGroup = new THREE.Group();
    scene.add(jarGroup);

    const loader = new GLTFLoader();
    const candidatePaths = [
      '/nv_ghee_jar.glb',
      '/nv%20ghee%20jar%203d%20model%20.glb',
      '/nv ghee jar 3d model.glb',
      '/nv ghee jar 3d model .glb',
    ];

    const tryLoadJar = (idx: number) => {
      if (idx >= candidatePaths.length) {
        setIsLoading(false);
        return;
      }

      loader.load(
        candidatePaths[idx],
        (gltf) => {
          const model = gltf.scene;

          model.updateMatrixWorld(true);
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          const naturalHeight = size.y > 0 ? size.y : 1.0;
          const normFactor = 1.0 / naturalHeight;
          model.scale.set(normFactor, normFactor, normFactor);
          model.position.set(-center.x * normFactor, -center.y * normFactor, -center.z * normFactor);

          // Enhance materials
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              if (mesh.material) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.roughness = Math.min(0.55, Math.max(0.2, mat.roughness ?? 0.35));
                mat.metalness = Math.min(0.3, mat.metalness ?? 0.15);
                mat.envMapIntensity = 1.35;
                mat.needsUpdate = true;
              }
            }
          });

          jarGroup.add(model);
          jarGroup.scale.set(2.2, 2.2, 2.2);

          // Position shadow right under the jar's base
          shadowMesh.position.y = -0.5 * 2.2 - 0.01;
          shadowMesh.scale.set(2.2 * 0.95, 2.2 * 0.95, 1);

          setIsLoading(false);
        },
        undefined,
        () => {
          tryLoadJar(idx + 1);
        }
      );
    };

    tryLoadJar(0);

    // 6. Pointer & Wheel Controls
    const handlePointerDown = (e: PointerEvent) => {
      controlsRef.current.isDragging = true;
      controlsRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!controlsRef.current.isDragging) return;
      const deltaX = e.clientX - controlsRef.current.previousMousePosition.x;
      const deltaY = e.clientY - controlsRef.current.previousMousePosition.y;

      controlsRef.current.targetRotation.y += deltaX * 0.008;
      controlsRef.current.targetRotation.x = Math.max(
        -0.4,
        Math.min(0.4, controlsRef.current.targetRotation.x + deltaY * 0.006)
      );

      controlsRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      controlsRef.current.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.004;
      controlsRef.current.targetCameraDistance = Math.max(
        4.5,
        Math.min(9.0, controlsRef.current.targetCameraDistance + zoomDelta)
      );
      setZoomLevel(
        Math.round(((9.0 - controlsRef.current.targetCameraDistance) / 4.5) * 100)
      );
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // 7. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Auto rotation
      if (controlsRef.current.autoRotate && !controlsRef.current.isDragging) {
        controlsRef.current.targetRotation.y += 0.005;
      }

      // Smooth inertia interpolation
      controlsRef.current.currentRotation.x +=
        (controlsRef.current.targetRotation.x - controlsRef.current.currentRotation.x) * 0.1;
      controlsRef.current.currentRotation.y +=
        (controlsRef.current.targetRotation.y - controlsRef.current.currentRotation.y) * 0.1;

      jarGroup.rotation.x = controlsRef.current.currentRotation.x;
      jarGroup.rotation.y = controlsRef.current.currentRotation.y;

      // Gentle floating
      jarGroup.position.y = Math.sin(elapsed * 1.5) * 0.06;

      // Camera distance zoom interpolation
      controlsRef.current.cameraDistance +=
        (controlsRef.current.targetCameraDistance - controlsRef.current.cameraDistance) * 0.1;
      camera.position.z = controlsRef.current.cameraDistance;

      particles.rotation.y = elapsed * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!container || !canvas) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);

      renderer.dispose();
      shadowGeo.dispose();
      shadowTex.dispose();
      particleGeo.dispose();
    };
  }, []);

  const handleResetView = () => {
    controlsRef.current.targetRotation = { x: 0.1, y: 0 };
    controlsRef.current.targetCameraDistance = 6.0;
    setZoomLevel(60);
  };

  const handleZoom = (delta: number) => {
    const newDist = Math.max(
      4.5,
      Math.min(9.0, controlsRef.current.targetCameraDistance + delta)
    );
    controlsRef.current.targetCameraDistance = newDist;
    setZoomLevel(Math.round(((9.0 - newDist) / 4.5) * 100));
  };

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[540px] sm:h-[620px] lg:h-[660px] flex items-center justify-center rounded-3xl bg-gradient-to-b from-[#FAF7EE] via-[#F4ECE1] to-[#FAF7EE] border border-ghee-gold/30 shadow-luxury overflow-hidden select-none"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Loading overlay if GLB is downloading */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#FAF7EE]/80 backdrop-blur-sm">
          <div className="w-10 h-10 border-2 border-ghee-600 border-t-transparent rounded-full animate-spin mb-3" />
          <span className="text-xs uppercase tracking-widest text-earth-900 font-semibold">
            Loading Actual 3D Jar...
          </span>
        </div>
      )}

      {/* Floating Interactive Badge (Top Left) */}
      <div className="absolute top-6 left-6 flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-ghee-gold/40 shadow-sm pointer-events-none">
        <Sparkles className="w-4 h-4 text-ghee-600 animate-pulse" />
        <span className="text-xs font-semibold text-earth-900 tracking-wide">
          Actual NV Ghee 3D Model
        </span>
      </div>

      {/* Floating Control Toolbar (Bottom Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-5 py-2.5 rounded-full bg-ivory-50/90 backdrop-blur-md border border-ghee-gold/40 shadow-xl">
        {/* Auto Rotate Toggle */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            autoRotate
              ? 'bg-earth-900 text-ivory-50'
              : 'bg-ivory-200 text-earth-900 hover:bg-ghee-300'
          }`}
          title={autoRotate ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{autoRotate ? 'Spinning' : 'Paused'}</span>
        </button>

        <div className="w-[1px] h-4 bg-ghee-gold/30" />

        {/* Zoom Out */}
        <button
          onClick={() => handleZoom(0.8)}
          className="p-1.5 rounded-full text-earth-800 hover:bg-ivory-200 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-[11px] font-mono text-earth-800/80 font-medium w-8 text-center">
          {zoomLevel}%
        </span>

        {/* Zoom In */}
        <button
          onClick={() => handleZoom(-0.8)}
          className="p-1.5 rounded-full text-earth-800 hover:bg-ivory-200 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-ghee-gold/30" />

        {/* Reset View */}
        <button
          onClick={handleResetView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-earth-800 hover:bg-ivory-200 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5 text-ghee-700" />
          <span>Reset</span>
        </button>
      </div>

      {/* Interaction Hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none text-[11px] font-medium text-earth-800/60 tracking-wider">
        <span>Click and drag to rotate 360° • Scroll to zoom</span>
      </div>
    </div>
  );
};
