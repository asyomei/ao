export function pick<T>(items: T[]): T {
  return items[Math.random() * items.length | 0]
}
