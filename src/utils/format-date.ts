export default function formatDate(date: Date, format: string) {
  const day = date.getUTCDate()
  const month = date.getUTCMonth() + 1
  const year = date.getUTCFullYear()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCMinutes()

  return format.replace(
    /%./g,
    fmt =>
      ({
        '%%': '%',
        '%d': String(day).padStart(2, '0'),
        '%m': String(month).padStart(2, '0'),
        '%Y': String(year),
        '%H': String(hours).padStart(2, '0'),
        '%M': String(minutes).padStart(2, '0'),
        '%s': String(seconds).padStart(2, '0'),
      })[fmt] ?? fmt,
  )
}
