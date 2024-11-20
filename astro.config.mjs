// @ts-check
import node from "@astrojs/node"
import solid from "@astrojs/solid-js"
import tailwind from "@astrojs/tailwind"
import icon from "astro-icon"
import { defineConfig } from "astro/config"

import sitemap from "@astrojs/sitemap"

// @ts-ignore
const isProd = process.env.NODE_ENV === "production"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  server: { host: isProd },
  site: "https://asyomei.org",
  scopedStyleStrategy: "where",
  integrations: [
    icon({ include: { pixelarticons: ["home", "code", "github-2", "sun-alt", "cloud", "moon"] } }),
    tailwind({ applyBaseStyles: false }),
    solid(),
    sitemap(),
  ],
  devToolbar: { enabled: false },
  vite: {
    ssr: isProd ? { noExternal: true } : undefined,
    define: {
      "import.meta.env.VITE_BUILD_DATE": JSON.stringify(getBuildDate()),
    },
  },
})

export function getBuildDate() {
  const date = new Date().toISOString()
  return date.slice(0, date.indexOf("T"))
}
