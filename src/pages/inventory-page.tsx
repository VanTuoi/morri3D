import React, { useMemo, useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { ChevronRight, Layers, AlertCircle, Plus, LayoutGrid, List } from 'lucide-react'
import type { Filament } from '~/types'

export const InventoryPage: React.FC = () => {
  const { filaments, theme, openFilamentModal } = useOutletContext<any>()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('3dManager_inventory_view') as 'grid' | 'list') || 'grid'
  })

  useEffect(() => {
    localStorage.setItem('3dManager_inventory_view', viewMode)
  }, [viewMode])

  const totalWeightKg = useMemo(() => {
    const sumGrams = filaments.reduce((acc: number, f: Filament) => {
      const w = f.weight ?? (f.percentage !== undefined ? f.percentage * 10 : 1000)
      return acc + w
    }, 0)
    return (sumGrams / 1000).toFixed(1)
  }, [filaments])

  const lowStockCount = useMemo(() => {
    return filaments.filter((f: Filament) => {
      const w = f.weight ?? (f.percentage !== undefined ? f.percentage * 10 : 1000)
      return w <= 200
    }).length
  }, [filaments])

  return (
    <div className='relative space-y-4 sm:space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto'>
      <div className='absolute -top-10 -left-10 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/15 rounded-full filter blur-[80px] pointer-events-none -z-10' />
      <div className='absolute top-36 -right-10 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full filter blur-[90px] pointer-events-none -z-10' />

      <div className='flex items-center justify-between gap-3 px-1'>
        <div>
          <div className='flex items-center gap-2.5 flex-wrap'>
            <h1 className='text-sm sm:text-base font-black tracking-tight'>Kho Nhựa In 3D</h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                isDark ? 'bg-zinc-800/80 border-white/10 text-zinc-300' : 'bg-teal-50 border-teal-200 text-teal-700'
              }`}
            >
              {filaments.length} cuộn • ~{totalWeightKg}kg
            </span>

            {lowStockCount > 0 && (
              <span className='text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-500/15 text-rose-500 border border-rose-500/20 flex items-center gap-1'>
                <AlertCircle size={12} />
                <span>{lowStockCount} sắp hết</span>
              </span>
            )}
          </div>
          <p className='text-xs opacity-60 mt-0.5 hidden sm:block'>Theo dõi cuộn nhựa và khối lượng filament còn lại</p>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0'>
          <div
            className={`h-9 p-1 rounded-xl border flex items-center gap-0.5 backdrop-blur-xl ${
              isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-white/80 border-zinc-200 shadow-sm'
            }`}
          >
            <button
              type='button'
              onClick={() => setViewMode('grid')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-teal-600 text-white shadow-sm' : 'opacity-60 hover:opacity-100 text-inherit'
              }`}
              title='Xem dạng thẻ'
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type='button'
              onClick={() => setViewMode('list')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-teal-600 text-white shadow-sm' : 'opacity-60 hover:opacity-100 text-inherit'
              }`}
              title='Xem dạng danh sách'
            >
              <List size={15} />
            </button>
          </div>

          <button
            onClick={() => navigate('/add?tab=filament')}
            className='h-9 inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-black text-xs px-3.5 sm:px-4 rounded-xl shadow-md shadow-teal-500/25 transition-all cursor-pointer select-none'
          >
            <Plus size={15} strokeWidth={2.6} className='flex-shrink-0' />
            <span>Nhập thêm</span>
          </button>
        </div>
      </div>

      {filaments.length === 0 ? (
        <div
          className={`rounded-2xl sm:rounded-3xl border backdrop-blur-2xl shadow-xl p-12 text-center ${
            isDark ? 'bg-zinc-900/60 border-white/10 text-zinc-100' : 'bg-white/80 border-white/80 text-zinc-900'
          }`}
        >
          <div className='w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 mx-auto flex items-center justify-center mb-3 border border-teal-500/20'>
            <Layers size={22} />
          </div>
          <div className='font-bold text-sm mb-1'>Kho nhựa đang trống</div>
          <div className='text-xs opacity-60 max-w-xs mx-auto mb-4'>
            Hãy nhập thông tin cuộn nhựa đầu tiên để bắt đầu tính toán định lượng in.
          </div>
          <button
            onClick={() => navigate('/add?tab=filament')}
            className='inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-95 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-teal-500/20 transition-all cursor-pointer'
          >
            <Plus size={14} />
            <span>Nhập kho nhựa mới</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* MODE 1: Grid Cards View (Gọn gàng & Trực quan) */
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5'>
          {filaments.map((item: Filament) => {
            const currentWeight = item.weight ?? (item.percentage !== undefined ? item.percentage * 10 : 1000)
            const percentage = Math.min(100, Math.max(0, Math.round((currentWeight / 1000) * 100)))
            const isLow = currentWeight <= 200

            return (
              <div
                key={item.id}
                onClick={() => openFilamentModal(item)}
                className={`relative p-3.5 sm:p-4 rounded-2xl border backdrop-blur-2xl transition-all duration-300 overflow-hidden group shadow-lg hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between ${
                  isDark
                    ? 'bg-zinc-900/65 border-white/10 text-zinc-100 shadow-black/40 hover:border-teal-500/40 hover:bg-zinc-900/80'
                    : 'bg-white/75 border-white/80 text-zinc-900 shadow-teal-500/5 hover:border-teal-300 hover:bg-white/90'
                }`}
              >
                <div
                  className='absolute top-0 right-0 w-20 h-20 rounded-bl-full pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity'
                  style={{ backgroundColor: item.colorHex }}
                />

                <div>
                  <div className='flex items-center justify-between gap-2 mb-3'>
                    <div className='relative'>
                      <div
                        className='w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white dark:border-zinc-800 shadow-md group-hover:scale-110 transition-transform'
                        style={{ backgroundColor: item.colorHex }}
                      />
                    </div>

                    <span className='font-mono font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300'>
                      {item.type}
                    </span>
                  </div>

                  <div className='mb-3'>
                    <div className='font-black text-xs sm:text-sm truncate group-hover:text-teal-500 transition-colors'>
                      {item.brand}
                    </div>
                    <div className='text-[10px] sm:text-[11px] opacity-60 truncate mt-0.5'>{item.colorName}</div>
                    {item.notes && (
                      <div className='text-[10px] text-teal-400/90 truncate mt-1 italic'>{item.notes}</div>
                    )}
                  </div>
                </div>

                <div className='pt-2 border-t border-inherit/40'>
                  <div className='flex items-center justify-between text-[10px] sm:text-[11px] font-bold mb-1.5'>
                    <span className={isLow ? 'text-rose-500' : 'opacity-80'}>{currentWeight}g</span>
                    <span className={`text-[10px] ${isLow ? 'text-rose-500' : 'opacity-60'}`}>{percentage}%</span>
                  </div>

                  <div
                    className={`h-2 w-full rounded-full overflow-hidden p-0.5 border ${
                      isDark ? 'bg-zinc-800/80 border-white/5' : 'bg-zinc-200/80 border-zinc-300/40'
                    }`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLow
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                          : percentage < 50
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                            : 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* MODE 2: Table List View */
        <div
          className={`rounded-2xl sm:rounded-3xl border backdrop-blur-2xl shadow-xl transition-all duration-300 overflow-hidden ${
            isDark
              ? 'bg-zinc-900/60 border-white/10 text-zinc-100 shadow-black/50'
              : 'bg-white/80 border-white/80 text-zinc-900 shadow-orange-500/5'
          }`}
        >
          <div
            className={`hidden md:grid grid-cols-12 px-6 py-3 text-[11px] font-bold uppercase tracking-wider border-b border-inherit/60 opacity-60 bg-black/[0.02] dark:bg-white/[0.02]`}
          >
            <div className='col-span-4'>Hãng & Màu sắc</div>
            <div className='col-span-3'>Loại Nhựa</div>
            <div className='col-span-4'>Dung lượng còn lại</div>
            <div className='col-span-1 text-right'>Chi tiết</div>
          </div>

          <div className='divide-y divide-inherit/40'>
            {filaments.map((item: Filament) => {
              const currentWeight = item.weight ?? (item.percentage !== undefined ? item.percentage * 10 : 1000)
              const percentage = Math.min(100, Math.max(0, Math.round((currentWeight / 1000) * 100)))
              const isLow = currentWeight <= 200

              return (
                <div
                  key={item.id}
                  onClick={() => openFilamentModal(item)}
                  className='px-4 sm:px-6 py-3 sm:py-3.5 md:grid md:grid-cols-12 md:items-center hover:bg-teal-500/[0.04] dark:hover:bg-white/[0.04] transition-all cursor-pointer text-xs group'
                >
                  <div className='col-span-4 flex items-center gap-3'>
                    <div className='relative flex-shrink-0'>
                      <div
                        className='w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/80 dark:border-white/20 shadow-md transition-transform group-hover:scale-110'
                        style={{ backgroundColor: item.colorHex }}
                      />
                    </div>
                    <div>
                      <div className='font-bold text-xs sm:text-sm group-hover:text-teal-500 transition-colors flex items-center gap-1.5'>
                        <span>{item.brand}</span>
                        {isLow && (
                          <span className='text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/20 font-bold'>
                            Sắp hết
                          </span>
                        )}
                      </div>
                      <div className='opacity-60 text-[11px] flex items-center gap-1.5'>
                        <span>{item.colorName}</span>
                        {item.notes && (
                          <span className='text-[10px] text-teal-400/90 italic truncate max-w-[150px]'>
                            • {item.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='col-span-3 opacity-80 text-xs hidden md:flex items-center gap-1.5'>
                    <span className='font-mono font-bold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[11px]'>
                      {item.type}
                    </span>
                  </div>

                  <div className='col-span-4 my-2 md:my-0'>
                    <div className='flex items-center justify-between text-[10px] sm:text-[11px] font-semibold mb-1'>
                      <span className='md:hidden font-mono font-bold px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10'>
                        {item.type}
                      </span>
                      <span className={`${isLow ? 'text-rose-500 font-bold' : 'opacity-80'}`}>
                        {currentWeight}g <span className='opacity-60 font-normal'>({percentage}%)</span>
                      </span>
                    </div>

                    <div
                      className={`h-2 w-full rounded-full overflow-hidden p-0.5 border ${
                        isDark ? 'bg-zinc-800/80 border-white/5' : 'bg-zinc-200/80 border-zinc-300/40'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isLow
                            ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                            : percentage < 50
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                              : 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className='col-span-1 text-right hidden md:flex justify-end opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-teal-400'>
                    <ChevronRight size={16} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryPage
