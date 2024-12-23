import { parse, type InferOutput, type ObjectSchema } from "valibot"
import compact from "./compact"
import mapValue from "./map-value"

interface Props<S extends ObjectSchema<any, any>> {
  params: Record<string, any>
  schema: S
}

export default async function fetchGET<S extends ObjectSchema<any, any>>(
  url: string,
  { params, schema }: Props<S>,
): Promise<InferOutput<S>> {
  const searchParams = mapValue(compact(params), String)
  const queryString = new URLSearchParams(searchParams).toString()

  const resp = await fetch(`${url}?${queryString}`)
  return parse(schema, await resp.json())
}
