import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number | string;
  badge?: string;
  theme?: 'dark' | 'light';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  badge,
  theme = 'dark',
  onClick
}) => {
  return (
    <Card 
      theme={theme} 
      hoverable={!!onClick} 
      onClick={onClick}
      className="flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className={`p-2.5 sm:p-3 rounded-2xl ${iconBg} ${iconColor} border border-current/15`}>
          {icon}
        </div>
        {badge && (
          <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${
            theme === 'light' ? 'bg-black/5 text-gray-700' : 'bg-white/10 text-gray-300'
          }`}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-black tracking-tight">{value}</div>
        <div className={`text-xs sm:text-sm font-medium mt-0.5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          {label}
        </div>
      </div>
    </Card>
  );
};
