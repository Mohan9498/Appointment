import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteImagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/

export default defineConfig({
  plugins: [
    react(),

    viteImagemin({
      // ✅ WebP conversion
      webp: {
        quality: 80,
      },

      // ✅ PNG optimization
      optipng: {
        optimizationLevel: 5,
      },

      // ✅ JPEG optimization
      mozjpeg: {
        quality: 80,
      },

      // ✅ SVG optimization
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
        ],
      },
    }),
  ],

  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
})