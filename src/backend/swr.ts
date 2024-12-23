import { setTimeout as delay } from "timers/promises"

export type Fetcher<T> = (props: { prev?: T }) => Promise<T>

interface Resource<T> {
  data: T
  createdAt: number
  updatedAt: number
}

const cache = new WeakMap<Function, Resource<any>>()

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
  let inserting = false
  let updating = false

  const firstTime = () => !cache.has(fetcher)
  const getResource = () => cache.get(fetcher)
  const setResource = (value: Resource<T>) => cache.set(fetcher, value)

  const fetchData = async () => {
    const prev = getResource()?.data
    return await fetcher({ prev })
  }

  return async () => {
    const needValidate = () => Date.now() - getResource()!.createdAt > validateTime
    const ttlExpired = () => Date.now() - getResource()!.updatedAt > ttl

    if (firstTime() || needValidate()) {
      if (!inserting) {
        inserting = true

        try {
          setResource({
            data: await fetchData(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          })
        } finally {
          inserting = false
        }
      }

      while (inserting) await delay(50)
      return getResource()!.data
    }

    if (ttlExpired() && !updating) {
      updating = true

      call(async () => {
        Object.assign(getResource()!, {
          data: await fetchData(),
          updatedAt: Date.now(),
        })
      }).finally(() => {
        updating = false
      })
    }

    return getResource()!.data
  }
}

const call = <T>(fn: () => T) => fn()
