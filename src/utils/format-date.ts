export default function formatDate(date: Date, format: "date" | "time" | "full" = "full") {
  const [fmtDate, time] = date.toISOString().split("T")
  const fmtTime = time.slice(0, -5) // .000Z

  switch (format) {
    case "date":
      return fmtDate
    case "time":
      return fmtTime
    case "full":
      return `${fmtDate} ${fmtTime}`
  }
}
