import { setTimeout as delay } from "timers/promises"

export type Fetcher<T> = (props: { prev?: T }) => Promise<T>

interface Props<T> {
  ttlMs: number
  validateMs: number
  fetcher: Fetcher<T>
}

export default function useSWR<T>({
  ttlMs: ttl,
  validateMs: validateTime,
  fetcher,
}: Props<T>): () => Promise<T> {
  let data: T | undefined
  let updatedAt = 0

  let updating = false
  const finishUpdate = () => (updating = false)

  const firstTime = () => data === undefined

  const fetchData = () => fetcher({ prev: data })
  const updateData = (newData: T) => {
    data = newData
    updatedAt = Date.now()
  }

  const needValidate = () => Date.now() - updatedAt > validateTime
  const ttlExpired = () => Date.now() - updatedAt > ttl

  const update = async ({ wait }: { wait: boolean }) => {
    if (!updating) {
      updating = true

      const promise = fetchData().then(updateData).finally(finishUpdate)
      if (wait) await promise

      return data!
    }

    if (wait) while (updating) await delay(50)
    return data!
  }

  return async () => {
    if (firstTime() || needValidate()) {
      return await update({ wait: true })
    }

    if (ttlExpired()) {
      return await update({ wait: false })
    }

    return data!
  }
}
