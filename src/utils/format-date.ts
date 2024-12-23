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
        "%%": "%",
        "%d": String(day),
        "%m": String(month),
        "%Y": String(year),
        "%H": String(hours),
        "%M": String(minutes),
        "%s": String(seconds),
      })[fmt] ?? fmt,
  )
}
