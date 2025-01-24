import './LastSeen.css'
import { DAY, HOUR, MINUTE, WEEK } from '#/backend/consts'
import type { LastSeenItem } from '#/backend/last-seen/types'
import A from './A'

interface Props {
  items: LastSeenItem[]
}

export default function LastSeen({ items }: Props) {
  const children = items.map(({ content, service, date, suffix }) => (
    <p class="item">
      <span class="content">
        <A href={content.url} class="link" title={content.text}>
          {content.text}
        </A>
        {suffix && <span class="suffix">{suffix}</span>}
      </span>
      <span class="service">
        @ <A href={service.url}>{service.text}</A>,{' '}
        <span title={formatDate(date)}>{humanize(date) ?? formatDate(date)}</span>
      </span>
    </p>
  ))

  return <div class="last-seen">{children}</div>
}

const formatDate = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')

  const year = pad(date.getUTCFullYear())
  const month = pad(date.getUTCMonth() + 1)
  const day = pad(date.getUTCDate())
  const hours = pad(date.getUTCHours())
  const minutes = pad(date.getUTCMinutes())
  const seconds = pad(date.getUTCSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} utc`
}

const humanize = (date: Date) => {
  const elapsed = Date.now() - date.getTime()

  if (elapsed < MINUTE) return 'now'

  if (elapsed < HOUR) {
    const minutes = Math.floor(elapsed / MINUTE)
    return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`
  }

  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR)
    return hours === 1 ? 'a hour ago' : `${hours} hours ago`
  }

  if (elapsed < 2 * DAY) return 'yesterday'

  if (elapsed < WEEK) {
    const days = Math.floor(elapsed / DAY)
    return `${days} days ago`
  }

  if (elapsed < 4 * WEEK) {
    const weeks = Math.floor(elapsed / WEEK)
    return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`
  }
}
