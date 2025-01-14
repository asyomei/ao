import { isbot } from 'isbot'
import { z } from 'zod'
import { HOUR, MINUTE } from './consts'
import env from './env'
import useSWR from './swr'
import { fetchGET, fetchPOST } from './utils/fetch'

const KEY = env.UMAMI_KEY
const SITE_ID = env.UMAMI_SITE_ID
const START_AT = new Date('2024-12-25T07:30:00.000Z').getTime()

const ResponseSchema = z.object({
  visitors: z.object({
    value: z.number(),
  }),
})

async function fetchVisitorsCount(_prev: any, url: string) {
  const resp = await fetchGET(`https://api.umami.is/v1/websites/${SITE_ID}/stats`, {
    schema: ResponseSchema,
    headers: {
      'x-umami-api-key': KEY,
    },
    params: {
      url,
      startAt: START_AT,
      endAt: Date.now(),
    },
  })

  return resp.visitors.value
}

export const getVisitorsCount = useSWR({
  ttlMs: 10 * MINUTE,
  validateMs: 24 * HOUR,
  fetcher: fetchVisitorsCount,
  key: String,
})

export async function logVisitor(req: Request) {
  if (import.meta.env.DEV) return
  if (isbot(req.headers.get('User-Agent'))) return

  const acceptLng = req.headers.get('Accept-Language') || ''
  const language = acceptLng.split(';')[0].split(',')[0]

  return await fetchPOST('https://cloud.umami.is/api/send', {
    headers: {
      'User-Agent': req.headers.get('User-Agent') || '',
      'X-Forwarded-For': req.headers.get('X-Forwarded-For')?.split(',')[0] || '',
    },
    body: {
      type: 'event',
      payload: {
        language,
        website: env.UMAMI_SITE_ID,
        hostname: req.headers.get('Host') || '',
        referrer: req.headers.get('Referer') || '',
        screen: '',
        title: 'asyomei',
        url: new URL(req.url).pathname,
      },
    },
  })
}
