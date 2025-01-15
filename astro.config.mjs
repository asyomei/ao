// @ts-check
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'
import solid from '@astrojs/solid-js'
import compress from '@playform/compress'
import { defineConfig, passthroughImageService } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://asyomei.org',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { host: import.meta.env.PROD },
  scopedStyleStrategy: 'class',
  vite: {
    ssr: import.meta.env.PROD ? { noExternal: true } : undefined,
    define: {
      'import.meta.env.BUILD_DATE': JSON.stringify(getBuildDate()),
    },
  },
  image: { service: passthroughImageService() },
  devToolbar: { enabled: false },
  integrations: [solid(), sitemap(), compress()],
})

export function getBuildDate() {
  const date = new Date().toISOString()
  return date.slice(0, date.indexOf('T'))
}
