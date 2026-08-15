import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Filament } from '../types';

export const InventoryPage: React.FC = () => {
  const { filaments, theme, openFilamentModal } = useOutletContext<any>();
  const isDark = theme === 'dark';

  const totalWeightKg = useMemo(() => {
    const sumGrams = filaments.reduce((acc: number, f: Filament) => {
      const w = f.weight ?? (f.percentage !== undefined ? f.percentage * 10 : 1000);
      return acc + w;
    }, 0);
    return (sumGrams / 1000).toFixed(1);
  }, [filaments]);

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Top Inventory Status Strip */}
      <div className="flex items-center justify-between px-0.5">
        <div>
          <h2 className="text-xs sm:text-sm font-bold">Danh mục Nhựa In 3D</h2>
          <p className="text-[10px] sm:text-xs opacity-60">Theo dõi cuộn nhựa và khối lượng còn lại</p>
        </div>
        <div className={`text-[11px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border font-bold ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'
        }`}>
          {filaments.length} Cuộn (~{totalWeightKg}kg)
        </div>
      </div>

      {/* Flat Filament Table / List */}
      <div className={`rounded-xl sm:rounded-2xl border overflow-hidden ${
        isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <div className={`hidden md:grid grid-cols-12 px-5 py-2 text-[11px] font-bold uppercase tracking-wider border-b border-inherit opacity-50 ${
          isDark ? 'bg-zinc-900/80' : 'bg-zinc-50'
        }`}>
          <div className="col-span-4">Hãng & Màu sắc</div>
          <div className="col-span-3">Loại Nhựa</div>
          <div className="col-span-4">Dung lượng còn lại</div>
          <div className="col-span-1 text-right">Chi tiết</div>
        </div>

        {filaments.length === 0 ? (
          <div className="text-center py-8 text-xs opacity-60">Chưa có cuộn nhựa nào trong kho.</div>
        ) : (
          <div className="divide-y divide-inherit">
            {filaments.map((item: Filament) => {
              const currentWeight = item.weight ?? (item.percentage !== undefined ? item.percentage * 10 : 1000);
              const percentage = Math.min(100, Math.max(0, Math.round((currentWeight / 1000) * 100)));

              return (
                <div
                  key={item.id}
                  onClick={() => openFilamentModal(item)}
                  className="px-3.5 sm:px-5 py-2.5 sm:py-3 md:grid md:grid-cols-12 md:items-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-xs"
                >
                  {/* Brand & Color Dot */}
                  <div className="col-span-4 flex items-center gap-2.5">
                    <div 
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white/30 flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: item.colorHex }}
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm">{item.brand}</span>
                      <span className="opacity-60 text-[11px] ml-1">{item.colorName}</span>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="col-span-3 opacity-80 text-xs hidden md:block">
                    {item.type}
                  </div>

                  {/* Gauge Bar */}
                  <div className="col-span-4 my-1.5 md:my-0">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold mb-0.5 opacity-75">
                      <span className="md:hidden">{item.type}</span>
                      <span>{currentWeight}g ({percentage}%)</span>
                    </div>
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Action */}
                  <div className="col-span-1 text-right hidden md:flex justify-end opacity-40 hover:opacity-100">
                    <ChevronRight size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
