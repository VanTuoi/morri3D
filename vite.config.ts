import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json'

function localApiDevPlugin(gasUrl?: string, apiKey?: string): Plugin {
  return {
    name: 'local-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/data')) {
          return next()
        }

        const targetGasUrl = gasUrl || process.env.GAS_URL || process.env.VITE_GAS_URL
        if (!targetGasUrl) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: 'Thiếu cấu hình GAS_URL trong file .env' }))
          return
        }

        try {
          if (req.method === 'GET') {
            const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
            const action = urlObj.searchParams.get('action') || 'getAll'
            const email = urlObj.searchParams.get('email') || ''

            const targetUrl = new URL(targetGasUrl)
            targetUrl.searchParams.set('action', action)
            if (email) targetUrl.searchParams.set('email', email)
            if (apiKey) targetUrl.searchParams.set('apiKey', apiKey)

            const response = await fetch(targetUrl.toString(), {
              method: 'GET',
              redirect: 'follow'
            })
            const data = await response.json()
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => {
              body += chunk.toString()
            })
            req.on('end', async () => {
              try {
                const parsedBody = body ? JSON.parse(body) : {}
                const payload = {
                  ...parsedBody,
                  ...(apiKey ? { apiKey } : {})
                }
                const response = await fetch(targetGasUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'text/plain' },
                  body: JSON.stringify(payload),
                  redirect: 'follow'
                })
                const data = await response.json()
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              } catch (postErr: any) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: false, error: postErr.message }))
              }
            })
            return
          }

          next()
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: err.message }))
        }
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const buildTimestamp = Date.now().toString()
  const gasUrl = env.GAS_URL || env.VITE_GAS_URL
  const apiKey = env.API_SECRET_KEY || ''

  return {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
      'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTimestamp)
    },
    plugins: [
      react(),
      tailwindcss(),
      localApiDevPlugin(gasUrl, apiKey),
      VitePWA({
        selfDestroying: true,
        includeAssets: ['logo.png', 'favicon.svg', 'icons.svg'],
        manifest: {
          name: 'Morri 3D Printing Manager',
          short_name: 'Morri 3D',
          description: 'Hệ thống quản lý đơn hàng và kho in 3D Morri',
          theme_color: '#09090b',
          background_color: '#09090b',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
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
