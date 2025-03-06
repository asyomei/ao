import { z } from 'zod'
import { HOUR } from '#/backend/consts'
import { swr, ttlValidator } from '#/backend/swr'
import { queryParams } from '#/backend/utils/query-params'
import { url } from '#/urls'
import type { LastSeenItem } from './types'

type ShikiInfo = z.output<typeof ShikiInfo>
const ShikiInfo = z.object({
  created_at: z.string(),
  description: z.string(),
  target: z.object({
    name: z.string(),
    url: z.string(),
  }),
})

const ResponseSchema = z.array(ShikiInfo)

const USER_ID = 1461317
const API_URL = `https://shikimori.one/api/users/${USER_ID}/history`

async function fetchShikiHistory(limit: number) {
  const params = queryParams({ limit })
  const resp = await fetch(API_URL + params, {
    headers: {
      'user-agent': 'asyomei.org/1.0',
      'content-type': 'application/json',
    },
  })
  return ResponseSchema.parse(await resp.json())
}

async function shiki(): Promise<LastSeenItem | undefined> {
  const history = await fetchShikiHistory(10)

  for (const info of history) {
    const description = parseDescription(info.description)
    if (!description) continue

    return {
      service: {
        text: 'shikimori',
        url: url.my.profiles.shikimori,
      },
      content: {
        text: info.target.name,
        url: `https://shikimori.one${info.target.url}`,
      },
      date: new Date(info.created_at),
      suffix: `: ${description}`,
    }
  }
}

function parseDescription(shikiDesc: string) {
  shikiDesc = shikiDesc.toLowerCase()

  const desc = {
    'добавлено в список': 'added',
    смотрю: 'watching',
    читаю: 'reading',
    пересматриваю: 'watching',
    перечитываю: 'reading',
    просмотрено: 'watched',
    прочитано: 'read',
  }[shikiDesc]
  if (desc) return desc

  if (shikiDesc.startsWith('просмотрено и оцен')) return 'watched'
  if (shikiDesc.startsWith('прочитано и оцен')) return 'read'

  if (shikiDesc.startsWith('просмотрен')) return 'watching'
  if (shikiDesc.startsWith('прочитан')) return 'reading'
}

export default swr({
  fetcher: shiki,
  validate: ttlValidator({
    update: 3 * HOUR,
    refetch: 8 * HOUR,
  }),
})
