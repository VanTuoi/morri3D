import React, { useState, useMemo, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import {
  Search,
  Clock,
  Printer,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  Sparkles,
  ShoppingBag,
  Layers,
  User,
  Calendar,
  X,
  Phone
} from 'lucide-react'
import type { Order } from '~/types'
import { STATUSES, formatCurrency, formatDate } from '~/types'
import { StatusBadge } from '~/components/ui/status-badge'

export const OrdersPage: React.FC = () => {
  const { searchQuery, setSearchQuery, filteredOrders, openOrderModal, theme } = useOutletContext<any>()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    return (localStorage.getItem('3dManager_orders_view') as 'list' | 'grid') || 'list'
  })

  useEffect(() => {
    localStorage.setItem('3dManager_orders_view', viewMode)
  }, [viewMode])

  const displayedOrders = useMemo(() => {
    if (statusFilter === 'ALL') return filteredOrders
    return filteredOrders.filter((o: Order) => o.status === statusFilter)
  }, [filteredOrders, statusFilter])

  const filterCounts = useMemo(() => {
    return {
      ALL: filteredOrders.length,
      [STATUSES.PENDING]: filteredOrders.filter((o: Order) => o.status === STATUSES.PENDING).length,
      [STATUSES.PRINTING]: filteredOrders.filter((o: Order) => o.status === STATUSES.PRINTING).length,
      [STATUSES.COMPLETED]: filteredOrders.filter((o: Order) => o.status === STATUSES.COMPLETED).length,
      [STATUSES.CANCELLED]: filteredOrders.filter((o: Order) => o.status === STATUSES.CANCELLED).length
    }
  }, [filteredOrders])

  const stats = useMemo(() => {
    const totalAmount = displayedOrders.reduce((sum: number, o: Order) => sum + (o.price || 0), 0)
    const totalQty = displayedOrders.reduce((sum: number, o: Order) => sum + (o.quantity || 1), 0)
    return { totalAmount, totalQty }
  }, [displayedOrders])

  const filterTabs = [
    { key: 'ALL', label: 'Tất cả', count: filterCounts.ALL, icon: Sparkles },
    {
      key: STATUSES.PENDING,
      label: 'Chờ in',
      count: filterCounts[STATUSES.PENDING] || 0,
      icon: Clock,
      color: 'text-blue-500'
    },
    {
      key: STATUSES.PRINTING,
      label: 'Đang in',
      count: filterCounts[STATUSES.PRINTING] || 0,
      icon: Printer,
      color: 'text-rose-500'
    },
    {
      key: STATUSES.COMPLETED,
      label: 'Hoàn thành',
      count: filterCounts[STATUSES.COMPLETED] || 0,
      icon: CheckCircle2,
      color: 'text-emerald-500'
    },
    {
      key: STATUSES.CANCELLED,
      label: 'Đã hủy',
      count: filterCounts[STATUSES.CANCELLED] || 0,
      icon: XCircle,
      color: 'text-red-500'
    }
  ]

  return (
    <div className='relative overflow-x-clip space-y-4 sm:space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none -z-10'>
        <div className='absolute -top-12 -left-10 w-72 h-72 bg-orange-500/10 dark:bg-orange-500/15 rounded-full filter blur-[80px]' />
        <div className='absolute top-36 -right-10 w-80 h-80 bg-amber-500/10 dark:bg-rose-500/15 rounded-full filter blur-[90px]' />
        <div className='absolute bottom-10 left-1/4 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full filter blur-[85px]' />
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-0.5'>
        <div>
          <div className='flex items-center gap-2.5 flex-wrap'>
            <h1 className='text-sm sm:text-base font-black tracking-tight flex items-center gap-2'>
              <ShoppingBag size={18} className='text-orange-500' />
              <span>Danh Sách Đơn Hàng</span>
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                isDark
                  ? 'bg-zinc-800/80 border-white/10 text-zinc-300'
                  : 'bg-orange-50 border-orange-200 text-orange-700'
              }`}
            >
              {displayedOrders.length} đơn • {formatCurrency(stats.totalAmount)}
            </span>
          </div>
          <p className='text-xs opacity-60 mt-0.5 hidden sm:block'>
            Quản lý tiến độ in, nguyên liệu và chi phí đơn hàng
          </p>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0 self-end sm:self-auto'>
          <div
            className={`h-9 p-1 rounded-xl border flex items-center gap-0.5 backdrop-blur-xl ${
              isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-white/80 border-zinc-200 shadow-sm'
            }`}
          >
            <button
              type='button'
              onClick={() => setViewMode('list')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-orange-500 text-white shadow-sm' : 'opacity-60 hover:opacity-100 text-inherit'
              }`}
              title='Xem dạng bảng'
            >
              <List size={15} />
            </button>
            <button
              type='button'
              onClick={() => setViewMode('grid')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-orange-500 text-white shadow-sm' : 'opacity-60 hover:opacity-100 text-inherit'
              }`}
              title='Xem dạng thẻ'
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between'>
        <div className='relative flex-1'>
          <Search size={15} className='absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40' />
          <input
            type='text'
            className={`w-full h-10 pl-9 pr-8 text-xs rounded-2xl border outline-none backdrop-blur-xl transition-all shadow-sm ${
              isDark
                ? 'bg-zinc-900/70 border-white/10 text-zinc-100 placeholder-zinc-500 focus:border-orange-500/60 focus:bg-zinc-900'
                : 'bg-white/85 border-white/80 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white shadow-orange-500/5'
            }`}
            placeholder='Tìm theo tên khách, mẫu in 3D, mã đơn hàng, số điện thoại...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type='button'
              onClick={() => setSearchQuery('')}
              className='absolute right-2.5 top-1/2 -translate-y-1/2 p-1 opacity-50 hover:opacity-100 rounded-md cursor-pointer'
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div
          className={`flex items-center p-1 rounded-2xl border backdrop-blur-xl overflow-x-auto scrollbar-hide flex-shrink-0 shadow-sm ${
            isDark
              ? 'bg-zinc-900/70 border-white/10 text-zinc-300'
              : 'bg-white/85 border-white/80 text-zinc-700 shadow-orange-500/5'
          }`}
        >
          {filterTabs.map((f) => {
            const Icon = f.icon
            const isActive = statusFilter === f.key

            return (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                    : 'opacity-65 hover:opacity-100 text-inherit hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={12} className={isActive ? 'text-white' : f.color || ''} />
                <span>{f.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'opacity-70 bg-black/5 dark:bg-white/10'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        /* Empty State with Frosted Glass */
        <div
          className={`py-16 px-4 rounded-2xl border backdrop-blur-2xl text-center space-y-3 ${
            isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-white/70 border-white/80 shadow-sm'
          }`}
        >
          <div className='w-14 h-14 mx-auto rounded-2xl bg-orange-500/15 border border-orange-500/20 text-orange-500 flex items-center justify-center shadow-inner'>
            <ShoppingBag size={26} strokeWidth={1.8} />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm font-bold'>Không tìm thấy đơn hàng nào</h3>
            <p className='text-xs opacity-60 max-w-sm mx-auto'>
              {searchQuery
                ? `Không có kết quả khớp với "${searchQuery}". Thử từ khóa khác hoặc xóa bộ lọc.`
                : 'Chưa có đơn hàng nào trong mục này. Bấm vào nút bên dưới để tạo đơn in 3D mới.'}
            </p>
          </div>
          <div className='pt-2'>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className='px-4 py-2 rounded-xl text-xs font-bold border border-zinc-300 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-all'
              >
                Xóa tìm kiếm
              </button>
            ) : (
              <button
                onClick={() => navigate('/add?tab=order')}
                className='px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 cursor-pointer hover:opacity-95 transition-all'
              >
                + Tạo đơn ngay
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid / Card View with Liquid Glass styling */
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
          {displayedOrders.map((order: Order) => (
            <div
              key={order.id}
              onClick={() => openOrderModal(order)}
              className={`group relative p-4 rounded-2xl border backdrop-blur-2xl shadow-lg transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 flex flex-col justify-between ${
                isDark
                  ? 'bg-zinc-900/65 border-white/10 text-zinc-100 shadow-black/40 hover:border-orange-500/40 hover:bg-zinc-900/85 hover:shadow-orange-500/10'
                  : 'bg-white/75 border-white/80 text-zinc-900 shadow-orange-500/5 hover:border-orange-300 hover:bg-white/95 hover:shadow-orange-500/15'
              }`}
            >
              <div className='absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:from-orange-500/20 transition-colors' />

              <div>
                <div className='flex items-center justify-between gap-2 mb-2.5'>
                  <div className='flex items-center gap-1.5'>
                    <span className='font-mono font-black text-orange-500 text-xs px-2 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20'>
                      #{order.id}
                    </span>
                    <span className='text-[10px] opacity-50 flex items-center gap-1'>
                      <Calendar size={11} />
                      {formatDate(order.date)}
                    </span>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <h3 className='font-black text-sm group-hover:text-orange-500 transition-colors line-clamp-1 mb-1.5'>
                  {order.itemName}
                </h3>

                <div className='flex flex-wrap gap-1 mb-3'>
                  {order.materials && order.materials.length > 0 ? (
                    order.materials.map((m: any, idx: number) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                          isDark
                            ? 'bg-zinc-800/70 border-white/5 text-zinc-300'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                        }`}
                      >
                        <Layers size={10} className='text-orange-400 opacity-80' />
                        <span>{m.type}</span>
                        <span className='opacity-60 font-normal'>({m.color})</span>
                      </span>
                    ))
                  ) : (
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                        isDark
                          ? 'bg-zinc-800/70 border-white/5 text-zinc-300'
                          : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                      }`}
                    >
                      <Layers size={10} className='text-orange-400 opacity-80' />
                      <span>{order.material || 'PLA'}</span>
                      <span className='opacity-60 font-normal'>({order.color || 'Mặc định'})</span>
                    </span>
                  )}
                </div>

                <div className='space-y-1 text-xs opacity-75'>
                  <div className='flex items-center gap-1.5 truncate'>
                    <User size={12} className='opacity-50 flex-shrink-0' />
                    <span className='font-semibold truncate'>{order.customerName}</span>
                    {order.phone && (
                      <span className='text-[10px] opacity-60 flex items-center gap-0.5'>
                        • <Phone size={9} /> {order.phone}
                      </span>
                    )}
                  </div>

                  {order.notes && (
                    <div className='text-[11px] text-orange-500/90 dark:text-orange-400 italic line-clamp-1 pt-0.5'>
                      📝 {order.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-3.5 pt-2.5 border-t border-inherit/40 flex items-center justify-between'>
                <span className='text-[11px] font-bold opacity-60'>
                  Số lượng: <span className='text-inherit font-black'>{order.quantity}</span>
                </span>
                <span className='font-black text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500'>
                  {formatCurrency(order.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table / List View with Liquid Glass Card */
        <div
          className={`rounded-2xl border backdrop-blur-2xl shadow-lg overflow-hidden transition-all ${
            isDark
              ? 'bg-zinc-900/65 border-white/10 shadow-black/40 divide-white/5'
              : 'bg-white/75 border-white/80 shadow-orange-500/5 divide-zinc-200/70'
          }`}
        >
          <div
            className={`hidden md:grid grid-cols-12 px-5 py-3 text-[11px] font-bold uppercase tracking-wider border-b ${
              isDark ? 'bg-zinc-950/40 border-white/10 text-zinc-400' : 'bg-zinc-50/80 border-zinc-200/80 text-zinc-500'
            }`}
          >
            <div className='col-span-2'>Mã & Ngày</div>
            <div className='col-span-4'>Mẫu In & Nhựa In</div>
            <div className='col-span-2'>Khách Hàng</div>
            <div className='col-span-2 text-right'>Giá Tiền</div>
            <div className='col-span-2 text-right'>Trạng Thái</div>
          </div>

          <div className='divide-y divide-inherit'>
            {displayedOrders.map((order: Order) => (
              <div
                key={order.id}
                onClick={() => openOrderModal(order)}
                className='group px-4 sm:px-5 py-3 md:grid md:grid-cols-12 md:items-center hover:bg-orange-500/[0.04] dark:hover:bg-orange-500/[0.06] transition-all cursor-pointer text-xs'
              >
                <div className='col-span-2 flex md:block items-center justify-between mb-1 md:mb-0'>
                  <div className='flex items-center gap-1.5'>
                    <span className='font-mono font-black text-orange-500 text-xs px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20'>
                      #{order.id}
                    </span>
                  </div>
                  <div className='text-[10px] sm:text-[11px] opacity-50 md:mt-1 flex items-center gap-1'>
                    <Calendar size={11} className='hidden md:inline' />
                    {formatDate(order.date)}
                  </div>
                </div>

                <div className='col-span-4 min-w-0 mb-1.5 md:mb-0 pr-2'>
                  <div className='font-black text-xs sm:text-sm truncate group-hover:text-orange-500 transition-colors'>
                    {order.itemName}
                  </div>
                  <div className='text-[10px] sm:text-[11px] opacity-65 truncate flex items-center gap-1.5 mt-0.5'>
                    <span className='truncate'>
                      {order.materials?.length
                        ? order.materials.map((m: any) => `${m.type} (${m.color})`).join(', ')
                        : `${order.material || 'PLA'} • ${order.color || 'Mặc định'}`}
                    </span>
                    <span>•</span>
                    <span className='font-bold flex-shrink-0'>SL: {order.quantity}</span>
                    {order.notes && (
                      <>
                        <span>•</span>
                        <span className='text-orange-500/90 dark:text-orange-400 italic truncate max-w-[140px]'>
                          📝 {order.notes}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className='col-span-2 text-xs opacity-80 truncate hidden md:block'>
                  <div className='font-semibold truncate'>{order.customerName}</div>
                  {order.phone && <div className='text-[10px] opacity-50 truncate'>{order.phone}</div>}
                </div>

                <div className='col-span-2 text-right font-black text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500'>
                  {formatCurrency(order.price)}
                </div>

                <div className='col-span-2 flex items-center justify-between md:justify-end gap-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-inherit/40'>
                  <span className='md:hidden text-[10px] opacity-60 flex items-center gap-1'>
                    <User size={10} />
                    {order.customerName}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage
