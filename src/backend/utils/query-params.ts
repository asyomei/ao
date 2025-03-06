export function queryParams(params: Record<string, any>) {
  const modParams: Record<string, string> = {}
  for (const key in params) {
    if (params[key]) {
      modParams[key] = String(params[key])
    }
  }

  const searchParams = new URLSearchParams(modParams)
  return `?${searchParams}`
}
