import './Spoiler.scss'
import clsx from 'clsx'
import type { JSXElement } from 'solid-js'

interface Props {
  class?: string
  children: JSXElement[]
}

export default function Spoiler({ class: className, children }: Props) {
  className = clsx('spoiler', className)

  if (children.length <= 1) return <div class={className}>{children}</div>

  children[0] = (
    <summary>
      <div class="first">{children[0]}</div>
      <span class="marker" />
    </summary>
  )

  return <details class={className}>{children}</details>
}
