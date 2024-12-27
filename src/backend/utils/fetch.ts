import type { z } from "zod"
import compact from "./compact"
import mapValue from "./map-value"
import { zodValidate } from "./zod"

interface GetProps<S extends z.Schema> {
  headers?: HeadersInit
  params: Record<string, any>
  schema: S
}

export async function fetchGET<S extends z.Schema>(
  url: string,
  { headers, params, schema }: GetProps<S>,
): Promise<z.infer<S>> {
  const searchParams = mapValue(compact(params), String)
  const queryString = new URLSearchParams(searchParams).toString()

  const resp = await fetch(`${url}?${queryString}`, { headers })
  return zodValidate(schema, await resp.json())
}
