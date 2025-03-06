import { z } from 'zod'
import { HOUR } from '#/backend/consts'
import { swr, ttlValidator } from '#/backend/swr'
import { url } from '#/urls'
import type { LastSeenItem } from './types'

const ResponseSchema = z
  .object({
    type: z.string(),
    payload: z.any(),
    repo: z.object({ name: z.string(), url: z.string() }),
    created_at: z.string(),
  })
  .array()
  .nonempty()

const API_URL = 'https://api.github.com/users/asyomei/events/public?per_page=1'

async function fetchGithubEvent() {
  const resp = await fetch(API_URL, {
    headers: {
      'user-agent': 'asyomei.org/1.0',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  return ResponseSchema.parse(await resp.json())[0]
}

async function github(): Promise<LastSeenItem | undefined> {
  const { type, payload, repo, created_at } = await fetchGithubEvent()

  const getDescription: (() => string) | undefined = {
    Create: () => `${payload.ref_type} created`,
    Delete: () => `${payload.ref_type} deleted`,
    Fork: () => 'forked',
    Gollum: () => 'wiki updated',
    IssueComment: () => `issue comment ${payload.action}`,
    Issues: () => `issue ${payload.action}`,
    Public: () => 'made public',
    PullRequest: () => `pr ${payload.action}`,
    Push: () => `pushed ${payload.distinct_size} commit${payload.distinct_size === 1 ? '' : 's'}`,
    Release: () => `release ${payload.action}`,
    Watch: () => 'starred',
  }[type.replace('Event', '')]

  if (!getDescription) return

  return {
    service: {
      text: 'github',
      url: url.my.profiles.github,
    },
    content: {
      text: repo.name,
      url: `https://github.com/${repo.name}`,
    },
    date: new Date(created_at),
    suffix: `: ${getDescription()}`,
  }
}

export default swr({
  fetcher: github,
  validate: ttlValidator({
    update: 1 * HOUR,
    refetch: 4 * HOUR,
  }),
})
