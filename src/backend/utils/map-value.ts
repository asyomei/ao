export default function mapValue<K extends string, T, R>(
  obj: Record<K, T>,
  mapFn: (value: T, key: K) => R,
): Record<K, R> {
  const res = {} as Record<K, R>

  for (const key in obj) {
    res[key] = mapFn(obj[key], key)
  }

  return res
}
