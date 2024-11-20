import type { ParentProps } from "solid-js"

export default function CopyableText({ copyText, children }: ParentProps<{ copyText: string }>) {
  async function handleClick() {
    await navigator.clipboard.writeText(copyText)
    alert("Текст скопирован")
  }

  return (
    <button
      type="button"
      class="cursor-default text-accent"
      title="Скопировать"
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
