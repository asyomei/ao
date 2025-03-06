export function get(obj: Record<string, any>, keys: string[]): any {
  let value: any = obj

  for (const key of keys) {
    value = value[key]
  }

  return value
}
