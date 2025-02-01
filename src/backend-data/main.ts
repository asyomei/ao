import { fetchJpwotd } from '#/backend/services/jpwotd'
import { fetchLastSeenItems } from '#/backend/services/last-seen'

export async function fetchMainData() {
  const [lastSeenItems, jpwotd] = await Promise.all([fetchLastSeenItems(), fetchJpwotd()])
  return { lastSeenItems, jpwotd }
}
