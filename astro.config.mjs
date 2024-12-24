// @ts-check
import node from "@astrojs/node"
import sitemap from "@astrojs/sitemap"
import solid from "@astrojs/solid-js"
import tailwind from "@astrojs/tailwind"
import compress from "@playform/compress"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  site: "https://asyomei.org",
  output: "server",
  adapter: node({ mode: "standalone" }),
  server: { host: import.meta.env.PROD },
  devToolbar: { enabled: false },
  vite: {
    define: {
      "import.meta.env.BUILD_DATE": JSON.stringify(getBuildDate()),
    },
  },
  integrations: [tailwind({ applyBaseStyles: false }), solid(), sitemap(), compress()],
})

export function getBuildDate() {
  const date = new Date().toISOString()
  return date.slice(0, date.indexOf("T"))
}
