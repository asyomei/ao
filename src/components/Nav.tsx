export const LINKS = [{ to: "/", name: "main" }]

export default function Nav({ pathname }: { pathname: string }) {
  const navLinks = LINKS.map(link => <NavLink pathname={pathname} {...link} />)
  return <nav>{join(<span class="select-none px-2 text-secondary">/</span>, navLinks)}</nav>
}

function NavLink({ pathname, to, name }: { pathname: string; to: string; name: string }) {
  const isActive = trimSlashes(to) === trimSlashes(pathname)

  if (isActive) {
    return <span class="font-bold">{name}</span>
  }

  return (
    <a href={to} class="text-accent">
      {name}
    </a>
  )
}

function trimSlashes(s: string) {
  return s.replace(/^\/|\/$/g, "")
}

function join<T1, T2>(del: T2, arr: T1[]): (T1 | T2)[] {
  return arr.flatMap(it => [it, del]).slice(0, -1)
}
