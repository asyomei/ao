import type { z } from 'zod'
import { fromError } from 'zod-validation-error'

export function zodValidate<T extends z.Schema>(schema: T, value: unknown): z.TypeOf<T> {
  const { data, error } = schema.safeParse(value)
  if (error) throw fromError(error)
  return data
}
