import "@fontsource/dejavu-sans"
import clsx from "clsx"
import { createSignal } from "solid-js"
import shuffled from "../../utils/shuffled"

const EMOJIS = ["(◕‿◕✿)", "(✿◕‿◕)", "(◡‿◡✿)", "(✿◡‿◡)", "(◠‿◠✿)", "(✿◠‿◠)"]

export default function Emoji({ class: className }: { class?: string }) {
  let emojis = shuffled(EMOJIS)
  const [emoji, setEmoji] = createSignal(emojis.pop())

  function handleClick() {
    if (emojis.length === 0) emojis = shuffled(EMOJIS)
    setEmoji(emojis.pop())
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      class={clsx("cursor-default font-dejavu outline-none", className)}
    >
      {emoji()}
    </button>
  )
}
