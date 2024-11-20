import clsx from "clsx"
import { splitProps, type ComponentProps } from "solid-js"

export default function Link(props: ComponentProps<"a">) {
  let [{ target, class: className }, rest] = splitProps(props, ["target", "class"])
  if (!target && !rest.href?.startsWith("/")) {
    target = "_blank"
  }

  return <a {...rest} target={target} class={clsx("underline underline-offset-2", className)} />
}
