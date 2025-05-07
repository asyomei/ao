import { defineConfig, presetMini, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetMini({ preflight: 'on-demand' }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  shortcuts: {
    table: 'grid grid-cols-[1fr_2fr] sm:grid-cols-[1fr_4fr]',
  },
  theme: {
    backgroundColor: {
      base: 'var(--bg)',
    },
    colors: {
      accent: 'var(--text-accent)',
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
    },
  },
})
