// @ts-check

import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'
import compress from '@playform/compress'
import { defineConfig, passthroughImageService } from 'astro/config'

export default defineConfig({
  site: 'https://asyomei.org',
  base: '/',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { host: import.meta.env.PROD },
  vite: {
    ssr: import.meta.env.PROD ? { noExternal: true } : undefined,
    define: {
      'import.meta.env.BUILD_DATE': JSON.stringify(getBuildDate()),
    },
  },
  image: { service: passthroughImageService() },
  devToolbar: { enabled: false },
  integrations: [sitemap(), compress()],
})

function getBuildDate() {
  const date = new Date().toISOString()
  return date.slice(0, date.indexOf('T'))
}
