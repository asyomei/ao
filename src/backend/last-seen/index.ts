import bsky from './bsky'
import lastfm from './lastfm'
import type { LastSeenItem } from './types'

export async function fetchLastSeenItems(): Promise<LastSeenItem[]> {
  const items: LastSeenItem[] = []
  const add = (item: LastSeenItem | undefined) => {
    if (item) items.push(item)
  }

  const fetches = [lastfm(), bsky()]

  await Promise.all(fetches.map(x => x.then(add, console.error)))
  return items.sort((a, b) => time(b) - time(a))
}

const time = (x: LastSeenItem) => x.date.getTime()
