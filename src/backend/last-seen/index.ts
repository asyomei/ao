import lastfm from './lastfm'
import type { LastSeenItem } from './types'

export async function fetchLastSeenItems(): Promise<LastSeenItem[]> {
  const items: LastSeenItem[] = []
  const add = (item: LastSeenItem | undefined) => {
    if (item) items.push(item)
  }

  const fetches = [lastfm()]

  await Promise.all(fetches.map(x => x.then(add, console.error)))
  return items
}
