export function randomInt(begin: number, end: number) {
  return Math.floor(Math.random() * (end - begin + 1)) + begin
}

export function randomPick<T>(choices: T[]): T {
  const i = randomInt(0, choices.length - 1)
  return choices[i]!
}
