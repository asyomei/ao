import { z } from 'zod'
import { HOUR } from '#/backend/consts'
import { swr, ttlValidator } from '#/backend/swr'
import { queryParams } from '#/backend/utils/query-params'
import { url } from '#/urls'
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
  feed: z.object({ post: BlueskyPost }).array().nonempty(),
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
    text: post.record.text.split('\n')[0] || '<no text>',
    createdAt: new Date(post.record.createdAt),
  }
}

async function bsky(): Promise<LastSeenItem | undefined> {
  const { postId, text, createdAt } = await fetchBluesky('asyomei.org')
  if (!postId) return

  return {
    service: {
      text: 'bluesky',
      url: url.my.profiles.bluesky,
    },
    content: {
      text,
      url: `${url.my.profiles.bluesky}/post/${postId}`,
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
