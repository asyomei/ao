import { z } from 'zod'
import { me } from '#/urls'
import { HOUR, MINUTE } from '../consts'
import { LASTFM_KEY } from '../env'
import { swr, ttlValidator } from '../swr'
import { queryParams } from '../utils/query-params'
import type { LastSeenItem } from './types'

export interface Track {
  artist: string
  title: string
  playing: boolean
  date: Date
  url: string
}

const API_URL = 'https://ws.audioscrobbler.com/2.0/'

const LastfmTrack = z.object({
  artist: z.object({ mbid: z.string(), '#text': z.string() }),
  name: z.string(),
  url: z.string(),
  date: z.object({ uts: z.string() }).optional(),
  '@attr': z
    .object({ nowplaying: z.literal('true') })
    .partial()
    .optional(),
})

const ResponseSchema = z.object({
  recenttracks: z.object({
    track: z.array(LastfmTrack),
  }),
})

async function fetchLastfm(apiKey: string, user: string): Promise<Track> {
  const params = queryParams({
    user,
    api_key: apiKey,
    method: 'user.getrecenttracks',
    format: 'json',
    limit: 1,
  })
  const resp = await fetch(API_URL + params, {
    headers: {
      'user-agent': 'asyomei.org/1.0',
      'content-type': 'application/json',
    },
  })
  const data = ResponseSchema.parse(await resp.json())

  const track = data.recenttracks.track[0]
  return {
    artist: track.artist['#text'],
    title: track.name,
    url: track.url,
    playing: track['@attr']?.nowplaying === 'true',
    date: track.date ? new Date(+track.date.uts * 1000) : new Date(),
  }
}

async function lastfm(): Promise<LastSeenItem | undefined> {
  if (!LASTFM_KEY) return

  const lastfm = await fetchLastfm(LASTFM_KEY, 'asyomei')
  return {
    service: {
      text: 'lastfm',
      url: me.lastfm,
    },
    content: {
      text: `${lastfm.title} - ${lastfm.artist}`,
      url: lastfm.url,
    },
    date: lastfm.date,
  }
}

export default swr({
  fetcher: lastfm,
  validate: ttlValidator({
    update: 5 * MINUTE,
    refetch: 1 * HOUR,
  }),
})
