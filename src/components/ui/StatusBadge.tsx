import React from 'react';
import { STATUSES, STATUS_COLORS } from '../../types';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  const colorClass = STATUS_COLORS[status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/20';

  return (
    <span className={`rounded-full font-semibold inline-flex items-center gap-1 shadow-sm ${sizeClasses} ${colorClass} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      {status}
    </span>
  );
};
