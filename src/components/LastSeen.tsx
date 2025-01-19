import './LastSeen.css'
import { DAY, HOUR, MINUTE, WEEK } from '#/backend/consts'
import type { LastSeenItem } from '#/backend/last-seen/types'
import shortText from '#/utils/short-text'
import A from './A'

interface Props {
  items: LastSeenItem[]
}

export default function LastSeen({ items }: Props) {
  const children = items.map(item => (
    <p class="last-seen-item">
      {applyTemplate(item)}
      <i>
        {'@ '}
        <A href={item.service.url}>{item.service.text}</A>
        {', '}
        <span title={formatDate(item.date)}>{humanize(item.date) ?? formatDate(item.date)}</span>
      </i>
    </p>
  ))

  if (children.length === 1) return children

  children[0] = (
    <summary>
      {children[0]}
      <span class="marker" />
    </summary>
  )

  return <details class="last-seen">{children}</details>
}

const applyTemplate = ({ content: { text, url }, template }: LastSeenItem) => {
  const content = <A href={url}>{shortText(text, 40)}</A>

  if (!template) return content

  const [begin, end = ''] = template.split('%s')
  return (
    <p>
      {begin}
      {content}
      {end}
    </p>
  )
}

const formatDate = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
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
