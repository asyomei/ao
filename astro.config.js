import node from '@astrojs/node'
import { defineConfig } from 'astro/config'
import unocss from 'unocss/astro'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  site: 'https://asyomei.org',
  build: { inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
  integrations: [
    unocss({ injectReset: true }),
  ],
  vite: {
    define: {
      'import.meta.env.BUILD_DATE': JSON.stringify(getBuildDate()),
    },
  },
})

function getBuildDate() {
  const now = new Date().toISOString()
  return now.slice(0, now.indexOf('T'))
}
