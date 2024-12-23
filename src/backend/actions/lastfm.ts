import { array, literal, object, optional, pipe, string, url } from "valibot"
import env from "../env"
import useSWR, { type Fetcher } from "../swr"
import fetchGET from "../utils/fetch-get"
import { HOUR, MINUTE } from "./consts"

const API_URL = "https://ws.audioscrobbler.com/2.0/"
const USER = "asyomei"
const API_KEY = env.LASTFM_KEY

const TrackSchema = object({
  artist: object({ "#text": string() }),
  album: object({ "#text": optional(string()) }),
  name: string(),
  url: pipe(string(), url()),
  date: optional(object({ uts: string() })),
  "@attr": optional(object({ nowplaying: literal("true") })),
})

const ResponseSchema = object({
  recenttracks: object({
    track: array(TrackSchema),
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

const fetchTrackInfo: Fetcher<Track> = async ({ prev }) => {
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
    date: track.date?.uts ? new Date(+track.date.uts * 1000) : new Date(),
  }
}

export default useSWR({
  ttlMs: 5 * MINUTE,
  validateMs: 1 * HOUR,
  fetcher: fetchTrackInfo,
})
