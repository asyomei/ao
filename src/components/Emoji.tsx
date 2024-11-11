import { createSignal, type JSXElement } from "solid-js"

const EMOJIS = ["(◕‿◕✿)", "(✿◕‿◕)", "(◡‿◡✿)", "(✿◡‿◡)", "(✿◠‿◠)", "(◠‿◠✿)"]

export default function Emoji() {
  let emojis = shuffled(EMOJIS)
  const [emoji, setEmoji] = createSignal<JSXElement>(emojis.pop())

  function handleClick() {
    if (emojis.length === 0) emojis = shuffled(EMOJIS)
    setEmoji(emojis.pop())
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      class="w-full cursor-default select-none text-secondary outline-none delay-0 hover:text-accent hover:delay-200"
    >
      {emoji()}
    </button>
  )
}

function shuffled<T>(arr: T[]): T[] {
  const res: T[] = arr.slice()

  for (let i = arr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return res
}
