import React from 'react'
import { STATUSES } from '~/types'
import { Badge } from './badge'

interface StatusBadgeProps {
    status: string
    size?: 'sm' | 'default'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusVariant = (s: string) => {
        switch (s) {
            case STATUSES.PENDING:
                return 'pending'
            case STATUSES.PRINTING:
                return 'printing'
            case STATUSES.COMPLETED:
                return 'completed'
            case STATUSES.CANCELLED:
                return 'cancelled'
            default:
                return 'outline'
        }
    }

    return <Badge variant={getStatusVariant(status) as any}>{status}</Badge>
}
