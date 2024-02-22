import { defineConfig } from 'astro/config'
import unocss from 'unocss/astro'
import solidJs from '@astrojs/solid-js'
import node from '@astrojs/node'
import cloudflare from '@astrojs/cloudflare'
import AstroPWA from '@vite-pwa/astro'
import disableBlocks from './plugins/disableBlocks'

const envAdapter = () => {
  switch (process.env.OUTPUT) {
    case 'cloudflare': return cloudflare()
    default: return node({ mode: 'standalone' })
  }
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    unocss(),
    solidJs(),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      manifest: {
        name: 'Anse',
        short_name: 'Anse',
        description: 'Anse is a fully optimized UI for AI Chats.',
        theme_color: '#101010',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'logo.svg',
            sizes: '32x32',
            type: 'image/svg',
            purpose: 'any maskable',
          },
        ],
      },
      client: {
        installPrompt: true,
        periodicSyncForUpdates: 20,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  output: 'server',
  adapter: envAdapter(),
  server: {
    host: '0.0.0.0',
  },
  vite: {
    plugins: [
      process.env.OUTPUT === 'cloudflare' && disableBlocks(),
      process.env.OUTPUT === 'vercel' && disableBlocks(),
      process.env.OUTPUT === 'netlify' && disableBlocks(),
    ],
  },
})
