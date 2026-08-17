import type { QueryConfig } from '~/hooks'

export const createSearchString = (config: QueryConfig) => {
  const params = new URLSearchParams(config)
  return `?${params.toString()}`
}
