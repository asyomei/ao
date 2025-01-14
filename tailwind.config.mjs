// @ts-check

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    backgroundColor: {
      base: 'var(--bg-base)',
    },
    colors: {
      primary: 'var(--text-primary)',
      accent: 'var(--text-accent)',
      secondary: 'var(--text-secondary)',
    },
    fontFamily: {
      mono: 'monospace, ui-monospace',
    },
    fontSize: {
      md: '14px',
      sm: '11px',
    },
    lineHeight: {
      DEFAULT: '17px',
    },
    gridTemplateColumns: {
      table: '100px 1fr',
      'md-table': '120px 1fr',
    },
    screens: {
      sm: { max: '510px' },
    },
  },
  plugins: [],
}
