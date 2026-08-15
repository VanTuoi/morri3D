import React from 'react';
import { Card } from './Card';
import { Filament } from '../../types';
import { Weight } from 'lucide-react';

interface FilamentCardProps {
  filament: Filament;
  theme?: 'dark' | 'light';
  onClick: () => void;
}

export const FilamentCard: React.FC<FilamentCardProps> = ({
  filament,
  theme = 'dark',
  onClick
}) => {
  const currentWeight = filament.weight ?? (filament.percentage !== undefined ? filament.percentage * 10 : 1000);
  const percentage = Math.min(100, Math.max(0, Math.round((currentWeight / 1000) * 100)));

  return (
    <Card
      theme={theme}
      hoverable
      onClick={onClick}
      className="flex flex-col justify-between group"
    >
      <div className="flex items-center gap-3 mb-3">
        {/* Color Swatch Avatar */}
        <div 
          className={`w-11 h-11 rounded-2xl border-2 ${
            theme === 'light' ? 'border-gray-200 shadow-sm' : 'border-white/20 shadow-md'
          } flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform`}
          style={{ backgroundColor: filament.colorHex }}
        >
          <div className="w-4 h-4 rounded-full border border-white/70 shadow-inner" style={{ backgroundColor: filament.colorHex }}></div>
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-sm sm:text-base truncate group-hover:text-purple-400 transition-colors">
            {filament.brand}
          </h4>
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} truncate`}>
            {filament.type} • {filament.colorName}
          </div>
        </div>
      </div>

      {/* Remaining Gauge */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-xs font-semibold">
          <span className="opacity-60 text-[11px]">Còn lại</span>
          <span className="text-purple-500 dark:text-purple-300 font-bold">{currentWeight}g ({percentage}%)</span>
        </div>
        <div className={`h-2 w-full ${theme === 'light' ? 'bg-gray-100' : 'bg-black/40'} rounded-full overflow-hidden border border-black/5 dark:border-white/5`}>
          <div 
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};
