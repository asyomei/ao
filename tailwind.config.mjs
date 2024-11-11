/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "var(--bg)",
        accent: "var(--bg-accent)",
      },
      colors: {
        accent: "var(--text-accent)",
        "accent-dim": "var(--text-accent-dim)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
      },
      screens: {
        sm: { max: "720px" },
      },
      fontFamily: {
        mono: ["Fira Mono", "monospace", "DejaVu Sans"],
      },
    },
  },
  plugins: [],
}
