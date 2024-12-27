import { setTimeout as delay } from "timers/promises"

type Props<T, A extends any[]> = {
  ttlMs: number
  validateMs: number
  fetcher: (prev: T | undefined, ...args: A) => Promise<T>
} & (A["length"] extends 0 ? { key?: undefined } : { key: (...args: A) => string })

export default function useSWR<T, A extends any[]>({
  ttlMs: ttl,
  validateMs: validateTime,
  fetcher,
  key: genKey = () => "",
}: Props<T, A>): (...args: A) => Promise<T> {
  const dict: Record<string, { data: T; setAt: number }> = {}

  let updating = false
  const setUpdating = () => !updating && (updating = true)
  const finishUpdate = () => (updating = false)

  const firstTime = (key: string) => !dict[key]

  const fetchData = (key: string, args: A) => fetcher(dict[key]?.data, ...args)
  const setData = (key: string) => (data: T) => (dict[key] = { data, setAt: Date.now() })
  const updateData = (key: string, args: A) =>
    fetchData(key, args).then(setData(key)).finally(finishUpdate)

  const needValidate = (key: string) => Date.now() - dict[key].setAt > validateTime
  const ttlExpired = (key: string) => Date.now() - dict[key].setAt > ttl

  const updateInBackground = (key: string, args: A) => {
    if (setUpdating()) updateData(key, args)
    return dict[key].data
  }

  const updateAndWait = async (key: string, args: A) => {
    if (setUpdating()) await updateData(key, args)
    while (updating) await delay(50)
    return dict[key].data
  }

  return async (...args) => {
    const key = genKey(...args)

    if (firstTime(key) || needValidate(key)) {
      return await updateAndWait(key, args)
    }

    if (ttlExpired(key)) {
      return updateInBackground(key, args)
    }

    return dict[key].data
  }
}
