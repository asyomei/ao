import "dotenv/config"
import { cleanEnv, str } from "envalid"

export default cleanEnv(process.env, {
  LASTFM_KEY: str(),
})
