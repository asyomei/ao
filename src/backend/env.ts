import { cleanEnv, str } from "envalid"

export default cleanEnv(import.meta.env, {
  LASTFM_KEY: str(),
})
