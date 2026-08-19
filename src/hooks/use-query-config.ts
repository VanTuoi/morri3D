import { isUndefined, omitBy } from 'lodash'

import type { CourseQueryParams } from '~/types'
import { useQueryParams } from './use-query-params'

export type QueryConfig = {
    [key in keyof CourseQueryParams]: string
}

export const useQueryConfig = () => {
    const queryParams: QueryConfig = useQueryParams()
    const queryConfig: QueryConfig = omitBy(
        {
            page: queryParams.page || '1',
            limit: queryParams.limit || '10',
            sort_by: queryParams.sort_by,
            name: queryParams.name,
            order: queryParams.order
        },
        isUndefined
    )
    return queryConfig
}
