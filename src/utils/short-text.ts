export default function shortText(text: string, length: number) {
  if (text.length <= length) return text
  return text.slice(0, length) + '…'
}
