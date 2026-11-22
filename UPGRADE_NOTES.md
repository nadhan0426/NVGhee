# NV Ghee — Immersive 3D Upgrade

## What changed

- Added `src/components/ImmersiveExperienceSection.tsx`, a new full-screen, dark luxury 3D interlude between the ghee-making process and product collection.
- The new scene is generated in Three.js (golden liquid-inspired drop, metallic orbit rings, suspended droplets, pedestal, studio lighting) so it does not require a new downloaded model to render.
- Added cursor parallax, scroll-scrubbed rotation/camera movement, responsive camera framing, reduced-motion handling, and cleanup for animation/render resources.
- Connected the section to the existing `#products` collection anchor.
- Fixed the hero frame loader so frame 1 is retained in the frame cache and supplied a bundled `src/assets/hero.png` fallback when the external frame sequence is missing.
- Added `tsconfig.app.json`, which is referenced by the project's existing root TypeScript config but was missing from the uploaded archive.

## Preserved

Existing NV Ghee branding, navbar, loading screen, original cinematic hero and 3D jar mode, process story, product data/cards, cart drawer, brand story, and footer remain in place.

## Important asset note

The uploaded ZIP did **not** include `public/frames-webp/` or `public/frames/`, although the hero component references those paths. The hero now falls back to the bundled hero image when those sequences are unavailable. To restore the full 192-frame scroll film, add the original files at:

- `public/frames-webp/frame_000001.webp` through `frame_000192.webp`
- or PNG equivalents under `public/frames/frame_000001.png` through `frame_000192.png`

## Run locally

1. Extract the project.
2. Run `npm install`.
3. Run `npm run dev`.
4. For a production check, run `npm run build` and then `npm run preview`.

The 3D drop is a procedural visual, not a scanned food/liquid simulation or an external GLB asset. For a final production-grade brand experience, replace or complement it with a commissioned GLB model / baked liquid animation if you have approved NV Ghee product assets.
