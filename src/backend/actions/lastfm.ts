import { z } from "zod"
import { HOUR, MINUTE } from "../consts"
import env from "../env"
import useSWR from "../swr"
import { fetchGET } from "../utils/fetch"

const API_URL = "https://ws.audioscrobbler.com/2.0/"
const USER = "asyomei"
const API_KEY = env.LASTFM_KEY

const TrackSchema = z.object({
  artist: z.object({ "#text": z.string() }),
  album: z.object({ "#text": z.string().optional() }),
  name: z.string(),
  url: z.string().url(),
  date: z.object({ uts: z.coerce.number() }).optional(),
  "@attr": z.object({ nowplaying: z.literal("true") }).optional(),
})

const ResponseSchema = z.object({
  recenttracks: z.object({
    track: TrackSchema.array(),
  }),
})

interface Track {
  artist: string
  album?: string
  title: string
  playing: boolean
  url: string
  date: Date
}

async function fetchTrackInfo(prev?: Track) {
  const resp = await fetchGET(API_URL, {
    schema: ResponseSchema,
    params: {
      api_key: API_KEY,
      method: "user.getrecenttracks",
      user: USER,
      format: "json",
      limit: 1,
      from: prev?.date ? prev.date.getTime() / 1000 : undefined,
    },
  })

  const track = resp.recenttracks.track[0]
  return {
    artist: track.artist["#text"],
    album: track.album["#text"],
    title: track.name,
    playing: track["@attr"]?.nowplaying === "true",
    url: track.url,
    date: track.date?.uts ? new Date(track.date.uts * 1000) : new Date(),
  }
}

export const lastfmAction = useSWR({
  ttlMs: 5 * MINUTE,
  validateMs: 1 * HOUR,
  fetcher: fetchTrackInfo,
})
