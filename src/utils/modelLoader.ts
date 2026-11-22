import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

let sharedDracoLoader: DRACOLoader | null = null;
let sharedGltfLoader: GLTFLoader | null = null;

// Cache the loaded GLTF object so multiple components (Hero, Modal, etc.)
// do not re-download or re-parse the model.
let cachedGLTF: GLTF | null = null;
let loadPromise: Promise<THREE.Group> | null = null;

function getLoaders(): { gltfLoader: GLTFLoader; dracoLoader: DRACOLoader } {
  if (!sharedDracoLoader) {
    sharedDracoLoader = new DRACOLoader();
    sharedDracoLoader.setDecoderPath('/draco/');
    sharedDracoLoader.setDecoderConfig({ type: 'wasm' });
    sharedDracoLoader.preload();
  }

  if (!sharedGltfLoader) {
    sharedGltfLoader = new GLTFLoader();
    sharedGltfLoader.setDRACOLoader(sharedDracoLoader);
  }

  return { gltfLoader: sharedGltfLoader, dracoLoader: sharedDracoLoader };
}

// Model file paths in priority order:
// 1. Draco compressed model (~976 KB) - ultra fast
// 2. Standard non-Draco optimized model (~2.9 MB) - instant fallback
// 3. Alternative legacy path
const CANDIDATE_PATHS = [
  '/nv_ghee_jar.glb',
  '/nv_ghee_jar_std.glb',
  '/nv%20ghee%20jar%203d%20model.glb',
];

// Approximate byte sizes to compute real progress if server omits Content-Length
const KNOWN_SIZES: Record<string, number> = {
  '/nv_ghee_jar.glb': 1000243,
  '/nv_ghee_jar_std.glb': 3063808,
  '/nv%20ghee%20jar%203d%20model.glb': 1000243,
};

export interface LoadModelProgress {
  loaded: number;
  total: number;
  percentage: number;
  stage: 'downloading' | 'decoding' | 'ready';
}

/**
 * Loads and prepares the NV Ghee 3D model with Draco decoding,
 * memory caching, and fallback protection.
 */
export function loadGheeJarModel(
  onProgress?: (progress: LoadModelProgress) => void
): Promise<THREE.Group> {
  // Return cached clone immediately if already loaded
  if (cachedGLTF) {
    if (onProgress) {
      onProgress({ loaded: 100, total: 100, percentage: 100, stage: 'ready' });
    }
    return Promise.resolve(prepareModelInstance(cachedGLTF.scene.clone(true)));
  }

  // If a load is already in-flight, return the existing promise
  if (loadPromise) {
    return loadPromise.then(() => {
      if (cachedGLTF) {
        if (onProgress) {
          onProgress({ loaded: 100, total: 100, percentage: 100, stage: 'ready' });
        }
        return prepareModelInstance(cachedGLTF.scene.clone(true));
      }
      throw new Error('Failed to resolve cached model');
    });
  }

  const { gltfLoader } = getLoaders();

  loadPromise = new Promise<THREE.Group>((resolve, reject) => {
    let pathIndex = 0;

    const attemptLoad = () => {
      if (pathIndex >= CANDIDATE_PATHS.length) {
        loadPromise = null;
        reject(new Error('All 3D model asset candidate paths failed to load.'));
        return;
      }

      const currentPath = CANDIDATE_PATHS[pathIndex];
      const expectedSize = KNOWN_SIZES[currentPath] || 1000000;

      gltfLoader.load(
        currentPath,
        (gltf) => {
          cachedGLTF = gltf;
          loadPromise = null;

          if (onProgress) {
            onProgress({
              loaded: expectedSize,
              total: expectedSize,
              percentage: 100,
              stage: 'ready',
            });
          }

          resolve(prepareModelInstance(gltf.scene.clone(true)));
        },
        (xhr) => {
          const total = xhr.total > 0 ? xhr.total : expectedSize;
          const loaded = xhr.loaded;
          const rawPct = Math.min(100, Math.round((loaded / total) * 100));

          if (onProgress) {
            onProgress({
              loaded,
              total,
              percentage: rawPct >= 100 ? 98 : rawPct,
              stage: rawPct >= 100 ? 'decoding' : 'downloading',
            });
          }
        },
        (error) => {
          console.warn(`[modelLoader] Failed to load ${currentPath}, falling back...`, error);
          pathIndex++;
          attemptLoad();
        }
      );
    };

    attemptLoad();
  });

  return loadPromise;
}

/**
 * Normalizes model dimensions, centers pivot, and sets materials for optimal reflections.
 */
function prepareModelInstance(model: THREE.Group): THREE.Group {
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // Standardize model height to 1.0 unit
  const naturalHeight = size.y > 0 ? size.y : 1.0;
  const normFactor = 1.0 / naturalHeight;
  model.scale.set(normFactor, normFactor, normFactor);

  // Center model at local origin (0, 0, 0)
  model.position.set(
    -center.x * normFactor,
    -center.y * normFactor,
    -center.z * normFactor
  );

  // Optimize materials
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

  return model;
}

/**
 * Clear cached model (used for retry or full cleanup)
 */
export function clearModelCache(): void {
  cachedGLTF = null;
  loadPromise = null;
}
