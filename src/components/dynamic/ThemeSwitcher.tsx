import clsx from "clsx"
import { createSignal, type Signal } from "solid-js"
import type { Theme } from "../../utils/color-theme"
import iconPixelSun from "../../icons/pixel-sun.svg?raw"
import iconPixelMoon from "../../icons/pixel-moon.svg?raw"
import iconPixelCloud from "../../icons/pixel-cloud.svg?raw"

export default function ThemeSwitcher() {
  const current = localStorage.getItem("color-theme") ?? "browser"
  const themeSignal = createSignal(current as Theme)

  return (
    <div class="flex gap-4">
      <ThemeButton
        newTheme="light"
        icon={iconPixelSun}
        title="Светлая тема"
        themeSignal={themeSignal}
      />
      <ThemeButton
        newTheme="browser"
        icon={iconPixelCloud}
        title="Тема браузера"
        themeSignal={themeSignal}
      />
      <ThemeButton
        newTheme="dark"
        icon={iconPixelMoon}
        title="Тёмная тема"
        themeSignal={themeSignal}
      />
    </div>
  )
}

function ThemeButton({
  icon,
  title,
  newTheme,
  themeSignal: [theme, setTheme],
}: {
  icon: string
  title: string
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
      title={title}
      innerHTML={icon}
    />
  )
}
