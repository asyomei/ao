import type { ComponentProps } from 'solid-js'

export default function A(props: ComponentProps<'a'>) {
  if (!('target' in props) && props.href && !props.href.startsWith('/')) {
    props.target = '_blank'
  }

  return <a {...props} />
}
