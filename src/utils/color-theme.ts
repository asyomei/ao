export type Theme = "dark" | "light" | "browser"
export const THEME_KEY = "color-theme"

// hack: override global color variables via body variables
export const LIGHT_CSS = generateThemeCss("light")
export const DARK_CSS = generateThemeCss("dark")

function generateThemeCss(theme: "dark" | "light") {
  const buf = ["body{"]

  const keys = ["bg", "bg-mantle", "text-accent", "text-primary", "text-secondary"]
  for (const key of keys) {
    buf.push(`--${key}:var(--${theme}-${key});`)
  }

  buf.push("}")
  return buf.join("")
}
