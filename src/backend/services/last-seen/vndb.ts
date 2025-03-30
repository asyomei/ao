import { z } from 'zod'
import { HOUR } from '#/backend/consts'
import { swr, ttlValidator } from '#/backend/swr'
import { url } from '#/urls'
import type { LastSeenItem } from './types'

const API_URL = 'https://api.vndb.org/kana/ulist'
const USER_ID = 'u266442'

const Title = z.object({
  id: z.string(),
  lastmod: z.number(),
  vn: z.object({
    title: z.string(),
  }),
  labels: z
    .object({
      label: z.string(),
    })
    .array(),
})

const ResponseSchema = z.object({
  results: z.array(Title).nonempty(),
})

async function fetchVndb() {
  const resp = await fetch(API_URL, {
    method: 'post',
    headers: {
      'user-agent': 'asyomei.org/1.0',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      user: USER_ID,
      fields: 'id, lastmod, vn.title, labels.label',
      sort: 'lastmod',
      reverse: true,
      results: 5,
    }),
  })
  const data = ResponseSchema.parse(await resp.json())

  return data.results.map(info => ({
    url: `https://vndb.org/${info.id}`,
    name: info.vn.title,
    updatedAt: info.lastmod * 1000,
    statusList: info.labels[0]?.label,
  }))
}

async function vndb(): Promise<LastSeenItem | undefined> {
  const results = await fetchVndb()

  for (const info of results) {
    if (!info.statusList) continue

    return {
      service: {
        text: 'vndb',
        url: url.my.profiles.vndb,
      },
      content: {
        text: info.name,
        url: info.url,
      },
      date: new Date(info.updatedAt),
      suffix: `: ${getStatus(info.statusList)}`,
    }
  }
}

function getStatus(list: string) {
  list = list.toLowerCase()
  return list === 'wishlist' ? 'added' : list
}

export default swr({
  fetcher: vndb,
  validate: ttlValidator({
    update: 3 * HOUR,
    refetch: 8 * HOUR,
  }),
})
