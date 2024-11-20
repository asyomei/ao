import clsx from "clsx"
import { createSignal, type JSXElement, type Signal } from "solid-js"
import { DARK_CSS, LIGHT_CSS, THEME_KEY, type Theme } from "../../utils/color-theme"

let styleNode: HTMLElement

export default function ThemeSwitcher({ light, browser, dark }: any) {
  styleNode ??= document.getElementById("theme-style")!

  const current = localStorage.getItem(THEME_KEY) ?? "browser"
  const themeSignal = createSignal(current as Theme)

  return (
    <div class="flex flex-col gap-4">
      <ThemeButton element={light} newTheme="light" themeSignal={themeSignal} />
      <ThemeButton element={browser} newTheme="browser" themeSignal={themeSignal} />
      <ThemeButton element={dark} newTheme="dark" themeSignal={themeSignal} />
    </div>
  )
}

function ThemeButton({
  element,
  newTheme,
  themeSignal: [theme, setTheme],
}: {
  element: JSXElement
  newTheme: Theme
  themeSignal: Signal<Theme>
}) {
  function handleClick() {
    localStorage.setItem(THEME_KEY, newTheme)
    setTheme(newTheme)
    styleNode.innerText = newTheme === "dark" ? DARK_CSS : newTheme === "light" ? LIGHT_CSS : ""
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      class={clsx("outline-none", theme() === newTheme && "text-accent")}
    >
      {element}
    </button>
  )
}
