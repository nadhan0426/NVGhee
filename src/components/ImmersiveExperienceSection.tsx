import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Rotate3d, Sparkles, Play, Pause } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ImmersiveExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const isAutoRotatingRef = useRef(true);

  // Sync ref with state
  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // -------------------------------------------------------------
    // 1. SCENE, CAMERA, RENDERER
    // -------------------------------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.15, 8.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // -------------------------------------------------------------
    // 2. PROCEDURAL HIGH-END WARM STUDIO ENVIRONMENT (FOR REFLECTIONS)
    // -------------------------------------------------------------
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const envCtx = envCanvas.getContext('2d');
    if (envCtx) {
      // Base dark warm gradient
      const bgGrad = envCtx.createLinearGradient(0, 0, 0, 512);
      bgGrad.addColorStop(0, '#1c1208');
      bgGrad.addColorStop(0.5, '#0e0803');
      bgGrad.addColorStop(1, '#050301');
      envCtx.fillStyle = bgGrad;
      envCtx.fillRect(0, 0, 1024, 512);

      // Key light softbox matching background sunlight
      const keyGrad = envCtx.createRadialGradient(680, 120, 20, 680, 120, 240);
      keyGrad.addColorStop(0, 'rgba(255, 240, 190, 1)');
      keyGrad.addColorStop(0.3, 'rgba(255, 190, 60, 0.85)');
      keyGrad.addColorStop(0.7, 'rgba(210, 120, 15, 0.35)');
      keyGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      envCtx.fillStyle = keyGrad;
      envCtx.fillRect(400, 0, 580, 320);

      // Backlight rim softbox
      const rimGrad = envCtx.createRadialGradient(260, 90, 15, 260, 90, 200);
      rimGrad.addColorStop(0, 'rgba(255, 220, 130, 0.95)');
      rimGrad.addColorStop(0.4, 'rgba(255, 140, 30, 0.65)');
      rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      envCtx.fillStyle = rimGrad;
      envCtx.fillRect(80, 0, 380, 280);

      // Ground bounce (warm golden reflection off slate table)
      const groundGrad = envCtx.createRadialGradient(512, 450, 30, 512, 450, 380);
      groundGrad.addColorStop(0, 'rgba(230, 150, 30, 0.5)');
      groundGrad.addColorStop(0.6, 'rgba(120, 60, 10, 0.15)');
      groundGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      envCtx.fillStyle = groundGrad;
      envCtx.fillRect(150, 280, 724, 232);

      const envTexture = new THREE.CanvasTexture(envCanvas);
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = pmremGenerator.fromEquirectangular(envTexture).texture;
      envTexture.dispose();
    }

    // -------------------------------------------------------------
    // 3. CINEMATIC LIGHTING MATCHING THE BACKGROUND IMAGE
    // -------------------------------------------------------------
    // Soft warm ambient fill
    const ambientLight = new THREE.AmbientLight(0xfff3d8, 1.1);
    scene.add(ambientLight);

    // Warm hemisphere light (golden ceiling, deep earth bounce)
    const hemiLight = new THREE.HemisphereLight(0xffecc2, 0x2e1a05, 2.2);
    scene.add(hemiLight);

    // Directional Key Light aligned with the golden sun rays in the background photo
    const keyLight = new THREE.DirectionalLight(0xfffae5, 4.6);
    keyLight.position.set(2.5, 6.5, 4.0);
    scene.add(keyLight);

    // Intense amber rim light from behind (creates glowing liquid edges)
    const rimLight = new THREE.DirectionalLight(0xff9e15, 5.8);
    rimLight.position.set(-2.5, 4.5, -4.5);
    scene.add(rimLight);

    // Subtle front bounce fill
    const fillLight = new THREE.DirectionalLight(0xffd588, 1.4);
    fillLight.position.set(1.0, -1.0, 4.0);
    scene.add(fillLight);

    // -------------------------------------------------------------
    // 4. MAIN 3D OBJECT GROUP (Ghee Drop, Swirls, Pedestal)
    // -------------------------------------------------------------
    const productGroup = new THREE.Group();
    // Default desktop placement: rests right on the tabletop in the background light ray
    productGroup.position.set(0.95, -0.38, 0);
    scene.add(productGroup);

    // -------------------------------------------------------------
    // 5. MASTERPIECE SLENDER TEARDROP (MATCHING REFERENCE IMAGE)
    // -------------------------------------------------------------
    // Mathematically sculpted teardrop: tall, slender neck, pointed apex, round bulbous belly
    const dropPoints: THREE.Vector2[] = [];
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
      const u = i / segments; // 0 at top apex to 1 at bottom base
      // Height spans from +1.85 (pointed apex) to -1.05 (base)
      const y = 1.85 - u * 2.9;
      // Elegant slender teardrop profile:
      // Starts sharp at u=0, widens gradually down neck, peaks at u≈0.74, curves to pole
      const r = Math.sin(Math.pow(u, 0.72) * Math.PI) * (0.22 + 0.82 * u) * 1.05;
      dropPoints.push(new THREE.Vector2(Math.max(0.001, r), y));
    }
    const dropGeometry = new THREE.LatheGeometry(dropPoints, 80);
    dropGeometry.computeVertexNormals();

    // Crystal liquid amber material with authentic ghee refraction and transparency
    const dropMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffcb46),
      emissive: new THREE.Color(0x8a4200),
      emissiveIntensity: 0.24,
      roughness: 0.03, // crystal-clear liquid surface
      metalness: 0.05,
      transmission: 0.92, // genuine physical liquid transparency
      ior: 1.49, // clarified butter / amber refractive index
      thickness: 2.3, // internal light refraction depth
      attenuationColor: new THREE.Color(0xff8800),
      attenuationDistance: 1.1,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    });

    const dropMesh = new THREE.Mesh(dropGeometry, dropMaterial);
    dropMesh.position.set(0, 0.12, 0);
    productGroup.add(dropMesh);

    // Warm internal point light: creates radiant inner golden luminescence
    const corePointLight = new THREE.PointLight(0xffa815, 22, 5);
    corePointLight.position.set(0, 0.0, 0);
    productGroup.add(corePointLight);

    // -------------------------------------------------------------
    // 6. INTERNAL SPARKLING GOLDEN FLECK PARTICLES (SWARNA/CRYSTALLITES)
    // -------------------------------------------------------------
    // Strictly contained inside the teardrop interior volume (NO overlapping dots on text!)
    const internalParticleCount = 180;
    const internalGeo = new THREE.BufferGeometry();
    const internalPos = new Float32Array(internalParticleCount * 3);
    const internalOriginalY = new Float32Array(internalParticleCount);
    const internalPhases = new Float32Array(internalParticleCount);

    for (let i = 0; i < internalParticleCount; i++) {
      const u = 0.35 + Math.random() * 0.55;
      const y = 1.85 - u * 2.9;
      const maxR = Math.sin(Math.pow(u, 0.72) * Math.PI) * (0.22 + 0.82 * u) * 0.72;
      const r = Math.sqrt(Math.random()) * maxR;
      const theta = Math.random() * Math.PI * 2;

      internalPos[i * 3] = Math.cos(theta) * r;
      internalPos[i * 3 + 1] = y + 0.12;
      internalPos[i * 3 + 2] = Math.sin(theta) * r;

      internalOriginalY[i] = internalPos[i * 3 + 1];
      internalPhases[i] = Math.random() * Math.PI * 2;
    }
    internalGeo.setAttribute('position', new THREE.BufferAttribute(internalPos, 3));

    // Glowing particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 235, 1)');
      grad.addColorStop(0.3, 'rgba(255, 210, 75, 0.9)');
      grad.addColorStop(0.7, 'rgba(230, 140, 20, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const internalMat = new THREE.PointsMaterial({
      color: 0xfff4c2,
      size: 0.065,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const internalParticles = new THREE.Points(internalGeo, internalMat);
    productGroup.add(internalParticles);

    // -------------------------------------------------------------
    // 7. SWIRLING FLUID SPLASH RIBBONS & DROPLET SPRAY
    // -------------------------------------------------------------
    const splashMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffbf35),
      emissive: new THREE.Color(0x7a3900),
      emissiveIntensity: 0.28,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.82,
      ior: 1.48,
      thickness: 1.1,
      attenuationColor: new THREE.Color(0xff8800),
      attenuationDistance: 1.2,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });

    const splashGroup = new THREE.Group();
    productGroup.add(splashGroup);

    // Splash Curve 1: Spiraling from the base pool, curling around front-right and arching high
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.35, -1.15, 0.75),
      new THREE.Vector3(1.15, -0.75, 0.65),
      new THREE.Vector3(1.35, -0.15, 0.0),
      new THREE.Vector3(1.05, 0.65, -0.75),
      new THREE.Vector3(0.15, 1.25, -0.95),
      new THREE.Vector3(-0.75, 1.35, -0.35),
      new THREE.Vector3(-1.1, 0.95, 0.4),
      new THREE.Vector3(-0.6, 0.4, 1.1),
      new THREE.Vector3(0.38, 0.1, 1.25),
      new THREE.Vector3(1.15, -0.22, 0.85),
      new THREE.Vector3(1.45, -0.65, 0.25),
    ]);
    const tubeGeo1 = new THREE.TubeGeometry(curve1, 120, 0.055, 12, false);
    const splash1 = new THREE.Mesh(tubeGeo1, splashMaterial);
    splashGroup.add(splash1);

    // Splash Curve 2: Elegant secondary liquid wave swooping across the rear shoulder
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.5, -1.1, 0.65),
      new THREE.Vector3(-1.25, -0.55, 0.45),
      new THREE.Vector3(-1.38, 0.25, -0.25),
      new THREE.Vector3(-0.85, 0.95, -0.75),
      new THREE.Vector3(-0.1, 1.45, -0.65),
      new THREE.Vector3(0.75, 1.2, 0.1),
      new THREE.Vector3(1.1, 0.65, 0.75),
      new THREE.Vector3(0.8, 0.0, 1.15),
    ]);
    const tubeGeo2 = new THREE.TubeGeometry(curve2, 100, 0.042, 10, false);
    const splash2 = new THREE.Mesh(tubeGeo2, splashMaterial);
    splashGroup.add(splash2);

    // Droplets strictly along the splash ribbon trajectories (only 8 micro-beads close to the wave)
    const splashDropletGeo = new THREE.SphereGeometry(1, 16, 16);
    const splashDropletSpecs = [
      { pos: new THREE.Vector3(1.55, -0.72, 0.2), scale: 0.09 },
      { pos: new THREE.Vector3(1.42, 0.75, -0.85), scale: 0.075 },
      { pos: new THREE.Vector3(0.12, 1.48, -1.05), scale: 0.07 },
      { pos: new THREE.Vector3(-1.25, 1.05, 0.48), scale: 0.095 },
      { pos: new THREE.Vector3(-0.82, 0.32, 1.25), scale: 0.065 },
      { pos: new THREE.Vector3(0.95, -0.05, 1.3), scale: 0.085 },
      { pos: new THREE.Vector3(-1.5, 0.3, -0.35), scale: 0.075 },
      { pos: new THREE.Vector3(0.48, -1.05, 1.1), scale: 0.1 },
    ];

    splashDropletSpecs.forEach((spec) => {
      const dropBall = new THREE.Mesh(splashDropletGeo, splashMaterial);
      dropBall.position.copy(spec.pos);
      dropBall.scale.setScalar(spec.scale);
      splashGroup.add(dropBall);
    });

    // -------------------------------------------------------------
    // 8. CHISELED NATURAL DARK SLATE ROCK PEDESTAL (MATCHES TABLETOP)
    // -------------------------------------------------------------
    // Low, authentic dark rock slab matching the slate texture in the background photo
    const stoneGeo = new THREE.CylinderGeometry(1.35, 1.48, 0.28, 64, 6);
    const stonePos = stoneGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < stonePos.count; i++) {
      const x = stonePos.getX(i);
      const y = stonePos.getY(i);
      const z = stonePos.getZ(i);
      const angle = Math.atan2(z, x);
      const radius = Math.sqrt(x * x + z * z);
      // Rough chiseled stone edge displacement
      if (Math.abs(y) < 0.13) {
        const noise =
          Math.sin(angle * 8.0) * 0.035 +
          Math.cos(angle * 14.0) * 0.02 +
          Math.sin(y * 22.0) * 0.015;
        const newR = radius + noise;
        stonePos.setX(i, Math.cos(angle) * newR);
        stonePos.setZ(i, Math.sin(angle) * newR);
      }
    }
    stoneGeo.computeVertexNormals();

    // Dark charcoal volcanic slate material
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x161412,
      roughness: 0.94,
      metalness: 0.08,
    });
    const stoneMesh = new THREE.Mesh(stoneGeo, stoneMat);
    stoneMesh.position.set(0, -1.24, 0);
    productGroup.add(stoneMesh);

    // Glistening pool of melted golden ghee overflowing across top surface
    const poolGeo = new THREE.CylinderGeometry(1.26, 1.26, 0.035, 64);
    const poolMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf5a51c),
      emissive: new THREE.Color(0x8a4000),
      emissiveIntensity: 0.35,
      roughness: 0.02,
      metalness: 0.08,
      transmission: 0.72,
      ior: 1.48,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
    });
    const poolMesh = new THREE.Mesh(poolGeo, poolMat);
    poolMesh.position.set(0, -1.09, 0);
    productGroup.add(poolMesh);

    // Viscous melted ghee drips flowing down the front of the rock
    const dripGroup = new THREE.Group();
    productGroup.add(dripGroup);

    const dripCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.06, -1.09, 1.25),
      new THREE.Vector3(0.08, -1.18, 1.32),
      new THREE.Vector3(0.07, -1.32, 1.34),
      new THREE.Vector3(0.06, -1.45, 1.32),
    ]);
    const dripStreamGeo = new THREE.TubeGeometry(dripCurve, 24, 0.042, 12, false);
    const dripStreamMesh = new THREE.Mesh(dripStreamGeo, poolMat);
    dripGroup.add(dripStreamMesh);

    // Hanging liquid droplet bulb
    const dripBulbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.095, 20, 20), poolMat);
    dripBulbMesh.position.set(0.06, -1.48, 1.32);
    dripBulbMesh.scale.set(1.0, 1.3, 1.0);
    dripGroup.add(dripBulbMesh);

    // Secondary side drip
    const drip2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), poolMat);
    drip2.position.set(-0.35, -1.22, 1.28);
    drip2.scale.set(0.9, 1.2, 0.9);
    dripGroup.add(drip2);

    // Soft dark contact shadow beneath the pedestal grounding it to the slate table
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const sGrad = shadowCtx.createRadialGradient(64, 64, 15, 64, 64, 64);
      sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.45)');
      sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      shadowCtx.fillStyle = sGrad;
      shadowCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 3.6),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.39, 0);
    productGroup.add(shadowPlane);

    // -------------------------------------------------------------
    // 9. INTERACTION: AUTO-ROTATE, DRAG TO ROTATE, SCROLL
    // -------------------------------------------------------------
    let targetX = 0;
    let targetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let frameId = 0;
    const clock = new THREE.Clock();

    // Auto-rotate & Drag state
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let manualRotX = 0;
    let manualRotY = 0;
    let manualVelocityX = 0;
    let manualVelocityY = 0;

    const onPointerDown = (event: PointerEvent) => {
      isDragging = true;
      previousMouseX = event.clientX;
      previousMouseY = event.clientY;
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * -0.3;

      if (isDragging) {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;
        manualVelocityX = deltaX * 0.006;
        manualVelocityY = deltaY * 0.006;
        manualRotY += manualVelocityX;
        manualRotX += manualVelocityY;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    section.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // Responsive Canvas Resizing & Camera Setup
    const resize = () => {
      const width = Math.max(1, section.clientWidth);
      const height = Math.max(1, section.clientHeight);
      camera.aspect = width / height;

      if (width < 640) {
        // Mobile layout: drop centered and zoomed back
        camera.position.z = 10.8;
        productGroup.position.set(0, -0.45, 0);
      } else if (width < 1024) {
        // Tablet layout
        camera.position.z = 9.6;
        productGroup.position.set(0.5, -0.4, 0);
      } else {
        // Desktop layout: sits in the golden sun ray between text and spoon
        camera.position.z = 8.8;
        productGroup.position.set(0.95, -0.38, 0);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);
    resize();

    // GSAP ScrollTrigger synchronization
    let scrollRotationY = 0;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        scrollRotationY = self.progress * Math.PI * 0.65;
      },
    });

    // Content fade-in animations
    const context = gsap.context(() => {
      if (copyRef.current) {
        gsap.fromTo(
          copyRef.current.children,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 70%', once: true },
          }
        );
      }
      if (hintRef.current) {
        gsap.fromTo(
          hintRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: 0.35,
            scrollTrigger: { trigger: section, start: 'top 65%', once: true },
          }
        );
      }
    }, section);

    // -------------------------------------------------------------
    // 10. MAIN ANIMATION LOOP (AUTO-ROTATE & SILKY PHYSICS)
    // -------------------------------------------------------------
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth pointer parallax
      pointerX += (targetX - pointerX) * 0.04;
      pointerY += (targetY - pointerY) * 0.04;

      // CONTINUOUS AUTO-ROTATE: When not dragging, rotate gracefully
      const AUTO_ROTATE_SPEED = 0.0075;
      if (!isDragging && isAutoRotatingRef.current && !reducedMotion) {
        manualRotY += AUTO_ROTATE_SPEED;
      }

      // Drag inertia decay
      if (!isDragging) {
        manualVelocityX *= 0.92;
        manualVelocityY *= 0.92;
        manualRotY += manualVelocityX;
        manualRotX += manualVelocityY;
      }

      // Combine user drag + auto-rotation + subtle scroll rotation + pointer tilt
      const idleFloatY = reducedMotion ? 0 : Math.sin(elapsed * 0.9) * 0.035;

      productGroup.rotation.x = pointerY + manualRotX * 0.5;
      productGroup.rotation.y = manualRotY + scrollRotationY;
      productGroup.rotation.z = pointerX * 0.15;
      productGroup.position.y = (productGroup.position.y || -0.38) * 0.96 + (-0.38 + idleFloatY) * 0.04;

      // Animate fluid splash ribbons & internal sparkles
      if (!reducedMotion) {
        splashGroup.rotation.y = elapsed * 0.12;

        // Sparkle and drift internal golden flecks
        const pArr = internalGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < internalParticleCount; i++) {
          const idx = i * 3 + 1;
          pArr[idx] = internalOriginalY[i] + Math.sin(elapsed * 1.4 + internalPhases[i]) * 0.03;
        }
        internalGeo.attributes.position.needsUpdate = true;
      }

      camera.lookAt(productGroup.position.x * 0.45, -0.2, 0);
      renderer.render(scene, camera);
    };
    animate();

    // -------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------
    return () => {
      window.cancelAnimationFrame(frameId);
      section.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      resizeObserver.disconnect();
      trigger.kill();
      context.revert();
      pmremGenerator.dispose();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((mat) => mat.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="the-golden-drop"
      className="relative isolate min-h-[96svh] overflow-hidden bg-[#0c0a07] text-[#fbf4e5]"
      aria-label="Interactive 3D Golden Ghee Drop Experience"
    >
      {/* 1. CINEMATIC BACKGROUND ARTWORK (Hammered brass urli on left, wooden spoon on right, dark slate table) */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: "url('/images/ghee_3d_backdrop.jpg')",
          filter: 'brightness(0.92) contrast(1.08)',
        }}
      />

      {/* 2. ATMOSPHERIC BACKLIGHTING & RADIAL GOLDEN HALO */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 62% 48%, rgba(255, 175, 45, 0.32) 0%, rgba(200, 110, 15, 0.18) 30%, rgba(12, 10, 7, 0.45) 62%, rgba(12, 10, 7, 0.92) 88%)',
        }}
      />

      {/* 3. TEXT READABILITY VIGNETTE ON LEFT (Ensures crisp contrast for editorial copy) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-full max-w-2xl bg-gradient-to-r from-[#0c0a07]/95 via-[#0c0a07]/80 to-transparent lg:max-w-3xl" />

      {/* 4. THREE.JS 3D INTERACTIVE CANVAS */}
      <canvas
        ref={canvasRef}
        aria-label="Interactive 3D golden liquid ghee drop with auto-rotation"
        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* 5. EDITORIAL CONTENT OVERLAY (CLEAN, NO OVERLAPPING DOTS) */}
      <div className="relative mx-auto grid min-h-[96svh] max-w-7xl items-center gap-8 px-6 py-20 sm:px-10 lg:grid-cols-[1fr_1.1fr] lg:px-16">
        {/* Left Column: Storytelling & CTAs */}
        <div ref={copyRef} className="relative z-10 max-w-xl py-12 lg:py-20">
          {/* Artisan Badge */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#d6ad5c]/35 bg-[#1e170c]/70 px-4 py-1.5 backdrop-blur-md">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[#e2b765]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C12.8 4.2 14.5 5.8 17 6.2C15.2 7.8 14.6 10.2 15.5 12.5C13.2 12.1 11.2 13.2 10.2 15.2C9.5 13 7.5 11.8 5.2 12.2C6.2 10 5.8 7.5 4 6C6.5 5.8 8.2 4.2 9 2C10 3.8 11 4.5 12 2Z" />
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#e8c070]">
              The art of slow craft
            </span>
          </div>

          {/* Poetic Subtitle */}
          <p className="mb-4 font-serif text-base italic tracking-wide text-[#e8d6b4] sm:text-lg">
            From the purity of nature to the warmth of your table.
          </p>

          {/* Headline */}
          <h2 className="font-serif text-5xl font-light leading-[1.04] tracking-[-0.035em] text-[#fbf5e8] sm:text-6xl lg:text-7xl">
            A little drop.
            <br />
            <span className="bg-gradient-to-r from-[#ffe49e] via-[#e5b353] to-[#c98e29] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(229,179,83,0.35)]">
              A deeper ritual.
            </span>
          </h2>

          {/* Body Paragraph */}
          <p className="mt-7 max-w-md text-sm leading-relaxed text-[#ded4bf]/90 sm:text-base">
            Discover the golden character of traditionally prepared ghee through a living,
            three-dimensional experience inspired by patience, purity and craft.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#products"
              className="group inline-flex items-center gap-3 rounded-full border border-[#d6ad5c]/70 bg-[#d6ad5c]/15 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#fff0cc] shadow-[0_4px_24px_rgba(214,173,92,0.22)] backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-[#f0cb78] hover:bg-[#d6ad5c]/25 hover:shadow-[0_8px_32px_rgba(214,173,92,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0cb78]"
            >
              <span>Explore the collection</span>
              <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>

            <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#c9b793]/75 sm:inline-flex">
              <Sparkles className="h-3.5 w-3.5 text-[#d6ad5c]" />
              <span>Pure Vedic A2</span>
            </div>
          </div>
        </div>

        {/* Right Area: Interactive Auto-Rotate Control Badge */}
        <div className="pointer-events-none relative flex h-full w-full items-end justify-center pb-8 lg:justify-end lg:pb-16">
          <div
            ref={hintRef}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-[#e5b353]/40 bg-[#17120a]/80 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f4e6c5] shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all"
          >
            <button
              type="button"
              onClick={() => setIsAutoRotating((prev) => !prev)}
              aria-label={isAutoRotating ? 'Pause 3D auto rotation' : 'Start 3D auto rotation'}
              className="flex items-center gap-1.5 text-[#e5b353] hover:text-[#ffd97d] transition-colors focus:outline-none"
            >
              {isAutoRotating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isAutoRotating ? 'Auto Rotating' : 'Paused'}</span>
            </button>
            <span className="text-[#e5b353]/40">·</span>
            <span className="flex items-center gap-1.5 text-white/70">
              <Rotate3d className="h-3.5 w-3.5 text-[#e5b353]" />
              <span>Drag to spin</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0c0a07] to-transparent" />
    </section>
  );
}
