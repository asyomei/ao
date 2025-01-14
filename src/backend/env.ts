import 'dotenv/config'
import { z } from 'zod'
import { zodValidate } from './utils/zod'

const EnvSchema = z.object({
  UMAMI_KEY: z.string(),
  UMAMI_SITE_ID: z.string(),
  LASTFM_KEY: z.string(),
})

export default zodValidate(EnvSchema, process.env)
