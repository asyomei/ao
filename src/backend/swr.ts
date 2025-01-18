import { setTimeout as delay } from 'node:timers/promises'

type ValidateType = 'refetch' | 'update' | 'keep'

interface Props<T> {
  fetcher: () => Promise<T>
  validate: (args: { current: T | undefined; elapsedMs: number }) => ValidateType
}

export function swr<T>({ fetcher, validate }: Props<T>) {
  const data = {} as { value?: T; setAt: number }
  let updating = false

  const refetch = async () => {
    if (updating) return
    updating = true

    try {
      // 3 times
      data.value = await fetcher()
        .catch(() => delay(200).then(fetcher))
        .catch(() => delay(300).then(fetcher))
    } catch (e) {
      console.error(e)
      data.value = undefined
    } finally {
      data.setAt = Date.now()
      updating = false
    }
  }

  return async () => {
    if (updating) return data.value

    if (!('value' in data)) {
      await refetch()
      return data.value
    }

    const type = validate({ current: data.value, elapsedMs: Date.now() - data.setAt })
    switch (type) {
      case 'refetch':
        await refetch()
        return data.value
      case 'update':
        void refetch()
        return data.value
      case 'keep':
        return data.value
    }
  }
}

export function ttlValidator(timeTo: {
  refetch: number
  update: number
}): (args: { elapsedMs: number }) => ValidateType {
  return ({ elapsedMs }) => {
    if (elapsedMs > timeTo.refetch) return 'refetch'
    if (elapsedMs > timeTo.update) return 'update'
    return 'keep'
  }
}
