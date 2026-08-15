import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const buildTimestamp = Date.now().toString()

  return {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
      'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTimestamp)
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        injectRegister: 'auto',
        registerType: 'autoUpdate',
        filename: 'sw.js',
        workbox: {
          globPatterns: ['**/*.{js,css,ico,png,svg,woff2,webm,html}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'navigation-cache',
                networkTimeoutSeconds: 10
              }
            }
          ]
        },
        devOptions: {
          enabled: false
        },
        includeAssets: ['logo.png', 'favicon.svg', 'icons.svg'],
        manifest: {
          name: 'Morri 3D Printing Manager',
          short_name: 'Morri 3D',
          description: 'Hệ thống quản lý đơn hàng và kho in 3D Morri',
          theme_color: '#09090b',
          background_color: '#09090b',
          display: 'standalone',
          orientation: 'portrait',
          start_url: `/?v=${pkg.version}`,
          icons: [
            {
              src: '/logo.png',
              sizes: '192x192 512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        '@': path.resolve(__dirname, './src')
      }
    },
    css: {
      devSourcemap: true
    },
    server: {
      port: 3000,
      allowedHosts: env.VITE_ALLOWED_HOSTS ? env.VITE_ALLOWED_HOSTS.split(',') : []
    }
  }
})
