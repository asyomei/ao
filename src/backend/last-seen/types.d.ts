export interface LastSeenItem {
  service: { text: string; url: string }
  content: { text: string; url: string }
  date: Date
  suffix?: string
}
