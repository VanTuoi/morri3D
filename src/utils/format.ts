import type { QueryConfig } from '~/hooks'

/**
 *
 * @param config
 * @returns
 */
export const createSearchString = (config: QueryConfig) => {
  const params = new URLSearchParams(config)
  return `?${params.toString()}`
}
