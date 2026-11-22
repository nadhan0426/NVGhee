import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three') || id.includes('node_modules/three-stdlib')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap-vendor';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/lenis')) {
            return 'ui-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
