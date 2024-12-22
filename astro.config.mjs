// @ts-check
import node from "@astrojs/node"
import sitemap from "@astrojs/sitemap"
import solid from "@astrojs/solid-js"
import tailwind from "@astrojs/tailwind"
import { defineConfig, passthroughImageService } from "astro/config"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  server: { host: import.meta.env.PROD },
  site: "https://asyomei.org",
  scopedStyleStrategy: "where",
  integrations: [tailwind({ applyBaseStyles: false }), solid(), sitemap()],
  devToolbar: { enabled: false },
  image: { service: passthroughImageService() },
  vite: {
    ssr: import.meta.env.PROD ? { noExternal: true } : undefined,
    define: {
      "import.meta.env.BUILD_DATE": JSON.stringify(getBuildDate()),
    },
  },
})

export function getBuildDate() {
  const date = new Date().toISOString()
  return date.slice(0, date.indexOf("T"))
}
