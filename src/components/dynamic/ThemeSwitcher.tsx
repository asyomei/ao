import clsx from "clsx"
import { createSignal, type JSXElement, type Signal } from "solid-js"
import type { Theme } from "../../utils/color-theme"

export default function ThemeSwitcher({ light, browser, dark }: any) {
  const current = localStorage.getItem("color-theme") ?? "browser"
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
    if (theme() === newTheme) return

    setTheme(newTheme)
    localStorage.setItem("color-theme", newTheme)
    // updateTheme was added in RawThemeSwitcher
    ;(window as any).updateTheme()
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
