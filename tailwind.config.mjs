/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "var(--bg)",
        mantle: "var(--bg-mantle)",
      },
      colors: {
        accent: "var(--text-accent)",
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
      },
      screens: {
        sm: { max: "720px" },
      },
      fontFamily: {
        base: ["Roboto", "Helvetica", "Arial", "sans-serif"],
        mono: ["Fira Mono", "monospace"],
        dejavu: ["DejaVu Sans", "monospace"],
      },
    },
  },
  plugins: [],
}
