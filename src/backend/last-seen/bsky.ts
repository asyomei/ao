import { z } from 'zod'
import { me } from '#/urls'
import shortText from '#/utils/short-text'
import { HOUR } from '../consts'
import { swr, ttlValidator } from '../swr'
import { queryParams } from '../utils/query-params'
import type { LastSeenItem } from './types'

const API_URL = 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed'

const BlueskyPost = z.object({
  uri: z.string(),
  record: z.object({
    text: z.string(),
    createdAt: z.string(),
  }),
})

const ResponseSchema = z.object({
  feed: z.object({ post: BlueskyPost }).array(),
})

const URI_REGEX = /\/app\.bsky\.feed\.post\/([a-zA-Z0-9]+)$/

async function fetchBluesky(user: string) {
  const params = queryParams({
    actor: user,
    filter: 'posts_and_author_threads',
    limit: 1,
  })
  const resp = await fetch(API_URL + params, {
    headers: {
      'user-agent': 'asyomei.org/1.0',
      'content-type': 'application/json',
    },
  })
  const data = ResponseSchema.parse(await resp.json())

  const post = data.feed[0].post
  const id = post.uri.match(URI_REGEX)?.[1]

  return {
    postId: id,
    text: post.record.text || '<no text>',
    createdAt: new Date(post.record.createdAt),
  }
}

async function bsky(): Promise<LastSeenItem | undefined> {
  const { postId, text, createdAt } = await fetchBluesky('asyomei.org')
  if (!postId) return

  return {
    service: {
      text: 'bsky',
      url: me.bluesky,
    },
    content: {
      text,
      url: `${me.bluesky}/post/${postId}`,
    },
    date: createdAt,
  }
}

export default swr({
  fetcher: bsky,
  validate: ttlValidator({
    update: 3 * HOUR,
    refetch: 8 * HOUR,
  }),
})
