// @ts-check
import node from "@astrojs/node"
import solid from "@astrojs/solid-js"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

// @ts-expect-error
const isProd = process.env.NODE_ENV === "production"

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  server: { host: true },

  integrations: [solid(), tailwind()],

  vite: {
    ssr: isProd ? { noExternal: true } : undefined,
    esbuild: { jsx: "automatic" },
    define: {
      "import.meta.env.VITE_BUILD_DATE": JSON.stringify(getBuildDate()),
    },
  },

  devToolbar: { enabled: false },
})

export function getBuildDate() {
  const date = new Date().toISOString()
  return date.slice(0, date.indexOf("T"))
}
