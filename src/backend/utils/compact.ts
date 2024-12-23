export default function compact<K extends string, V>(obj: Record<K, V | undefined>): Record<K, V> {
  const res = {} as Record<K, V>

  for (const key in obj) {
    if (obj[key] !== undefined) res[key] = obj[key] as V
  }

  return res
}
