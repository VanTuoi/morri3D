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
  Phone,
  Filter,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal,
  Plus,
  ChevronRight
} from 'lucide-react'
import type { Order, Filament, OrderMaterial } from '~/types'
import { STATUSES, formatCurrency, formatDate } from '~/types'
import { StatusBadge } from '~/components/ui/status-badge'

type StatusFilterType = 'ALL' | string
type PriceFilterType = 'ALL' | 'UNDER_100K' | '100K_500K' | 'OVER_500K'
type SortByType = 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc' | 'customer-asc' | 'qty-desc'

export const OrdersPage: React.FC = () => {
  const { orders = [], filaments = [], openOrderModal, theme } = useOutletContext<any>()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const getFilamentColor = (m?: { inventoryId?: string; type?: string; color?: string }) => {
    if (!m) return ''
    const fil = filaments.find(
      (f: Filament) =>
        (m.inventoryId && f.id === m.inventoryId) ||
        (f.colorName && m.color && f.colorName.toLowerCase() === m.color.toLowerCase())
    )
    return fil?.colorHex || ''
  }

  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    return (localStorage.getItem('3dManager_orders_view') as 'list' | 'grid') || 'list'
  })

  useEffect(() => {
    localStorage.setItem('3dManager_orders_view', viewMode)
  }, [viewMode])

  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('ALL')
  const [materialFilter, setMaterialFilter] = useState<string>('ALL')
  const [priceFilter, setPriceFilter] = useState<PriceFilterType>('ALL')
  const [sortBy, setSortBy] = useState<SortByType>('date-desc')

  const uniqueMaterials = useMemo(() => {
    const set = new Set<string>()
    orders.forEach((o: Order) => {
      if (o.materials && o.materials.length > 0) {
        o.materials.forEach((m: OrderMaterial) => {
          if (m.type) set.add(m.type.trim())
        })
      } else if (o.material) {
        set.add(o.material.trim())
      }
    })
    return Array.from(set).filter(Boolean).sort()
  }, [orders])

  const statusCounts: Record<string, number> = useMemo(() => {
    return {
      ALL: orders.length,
      [STATUSES.PENDING]: orders.filter((o: Order) => o.status === STATUSES.PENDING).length,
      [STATUSES.PRINTING]: orders.filter((o: Order) => o.status === STATUSES.PRINTING).length,
      [STATUSES.COMPLETED]: orders.filter((o: Order) => o.status === STATUSES.COMPLETED).length,
      [STATUSES.CANCELLED]: orders.filter((o: Order) => o.status === STATUSES.CANCELLED).length
    }
  }, [orders])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (statusFilter !== 'ALL') count++
    if (materialFilter !== 'ALL') count++
    if (priceFilter !== 'ALL') count++
    if (sortBy !== 'date-desc') count++
    return count
  }, [statusFilter, materialFilter, priceFilter, sortBy])

  const isFiltered = useMemo(() => {
    return searchQuery.trim() !== '' || activeFilterCount > 0
  }, [searchQuery, activeFilterCount])

  const handleResetFilters = () => {
    setSearchQuery('')
    setStatusFilter('ALL')
    setMaterialFilter('ALL')
    setPriceFilter('ALL')
    setSortBy('date-desc')
  }

  const displayedOrders = useMemo(() => {
    let list = [...orders]

    if (statusFilter !== 'ALL') {
      list = list.filter((o: Order) => o.status === statusFilter)
    }

    if (materialFilter !== 'ALL') {
      list = list.filter((o: Order) => {
        if (o.materials && o.materials.length > 0) {
          return o.materials.some((m: OrderMaterial) => (m.type || '').includes(materialFilter))
        }
        return (o.material || '').includes(materialFilter)
      })
    }

    if (priceFilter === 'UNDER_100K') {
      list = list.filter((o: Order) => (o.price || 0) < 100000)
    } else if (priceFilter === '100K_500K') {
      list = list.filter((o: Order) => (o.price || 0) >= 100000 && (o.price || 0) <= 500000)
    } else if (priceFilter === 'OVER_500K') {
      list = list.filter((o: Order) => (o.price || 0) > 500000)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter((o: Order) => {
        const id = (o.id || '').toLowerCase()
        const customer = (o.customerName || '').toLowerCase()
        const phone = (o.phone || '').toLowerCase()
        const item = (o.itemName || '').toLowerCase()
        const notes = (o.notes || '').toLowerCase()
        const address = (o.address || '').toLowerCase()

        let materialText = (o.material || '').toLowerCase()
        if (o.materials && o.materials.length > 0) {
          materialText = o.materials
            .map((m: OrderMaterial) => `${m.type} ${m.color}`)
            .join(' ')
            .toLowerCase()
        }

        return (
          id.includes(q) ||
          `#${id}`.includes(q) ||
          customer.includes(q) ||
          phone.includes(q) ||
          item.includes(q) ||
          notes.includes(q) ||
          address.includes(q) ||
          materialText.includes(q)
        )
      })
    }

    list.sort((a: Order, b: Order) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
      }
      if (sortBy === 'date-asc') {
        return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
      }
      if (sortBy === 'price-desc') {
        return (b.price || 0) - (a.price || 0)
      }
      if (sortBy === 'price-asc') {
        return (a.price || 0) - (b.price || 0)
      }
      if (sortBy === 'customer-asc') {
        return (a.customerName || '').localeCompare(b.customerName || '')
      }
      if (sortBy === 'qty-desc') {
        return (b.quantity || 1) - (a.quantity || 1)
      }
      return 0
    })

    return list
  }, [orders, statusFilter, materialFilter, priceFilter, searchQuery, sortBy])

  const stats = useMemo(() => {
    const totalAmount = displayedOrders.reduce((sum: number, o: Order) => sum + (o.price || 0), 0)
    const totalQty = displayedOrders.reduce((sum: number, o: Order) => sum + (o.quantity || 1), 0)
    return { totalAmount, totalQty }
  }, [displayedOrders])

  const totalAllRevenue = useMemo(() => {
    return orders.reduce((sum: number, o: Order) => sum + (o.price || 0), 0)
  }, [orders])

  const filterTabs = [
    { key: 'ALL', label: 'Tất cả', count: statusCounts.ALL || 0, icon: Sparkles },
    {
      key: STATUSES.PENDING,
      label: 'Chờ in',
      count: statusCounts[STATUSES.PENDING] || 0,
      icon: Clock,
      color: 'text-blue-500'
    },
    {
      key: STATUSES.PRINTING,
      label: 'Đang in',
      count: statusCounts[STATUSES.PRINTING] || 0,
      icon: Printer,
      color: 'text-rose-500'
    },
    {
      key: STATUSES.COMPLETED,
      label: 'Hoàn thành',
      count: statusCounts[STATUSES.COMPLETED] || 0,
      icon: CheckCircle2,
      color: 'text-emerald-500'
    },
    {
      key: STATUSES.CANCELLED,
      label: 'Đã hủy',
      count: statusCounts[STATUSES.CANCELLED] || 0,
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
          <div className='flex items-center gap-2 flex-wrap'>
            <h1 className='text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5'>
              <ShoppingBag size={18} className='text-orange-500' />
              <span>Danh Sách Đơn Hàng</span>
            </h1>

            <button
              type='button'
              onClick={handleResetFilters}
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border transition-all cursor-pointer ${
                statusFilter === 'ALL' && !isFiltered
                  ? isDark
                    ? 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-sm'
                    : 'bg-orange-100 text-orange-800 border-orange-300 shadow-sm'
                  : isDark
                    ? 'bg-zinc-800/80 border-white/10 text-zinc-400 hover:text-zinc-200'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
              }`}
              title='Xem tất cả đơn hàng'
            >
              {isFiltered
                ? `${displayedOrders.length}/${orders.length} đơn • ${formatCurrency(stats.totalAmount)}`
                : `${orders.length} đơn • ${formatCurrency(totalAllRevenue)}`}
            </button>

            {statusCounts[STATUSES.PENDING] > 0 && (
              <button
                type='button'
                onClick={() => setStatusFilter((prev) => (prev === STATUSES.PENDING ? 'ALL' : STATUSES.PENDING))}
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                  statusFilter === STATUSES.PENDING
                    ? 'bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-500/30 scale-105'
                    : 'bg-blue-500/15 text-blue-500 border-blue-500/30 hover:bg-blue-500/25'
                }`}
                title='Lọc nhanh đơn đang chờ in'
              >
                <Clock size={12} className={statusFilter === STATUSES.PENDING ? 'animate-pulse' : ''} />
                <span>{statusCounts[STATUSES.PENDING]} chờ in</span>
              </button>
            )}

            {statusCounts[STATUSES.PRINTING] > 0 && (
              <button
                type='button'
                onClick={() => setStatusFilter((prev) => (prev === STATUSES.PRINTING ? 'ALL' : STATUSES.PRINTING))}
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                  statusFilter === STATUSES.PRINTING
                    ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/30 scale-105'
                    : 'bg-rose-500/15 text-rose-500 border-rose-500/30 hover:bg-rose-500/25'
                }`}
                title='Lọc nhanh đơn đang in'
              >
                <Printer size={12} className={statusFilter === STATUSES.PRINTING ? 'animate-bounce' : ''} />
                <span>{statusCounts[STATUSES.PRINTING]} đang in</span>
              </button>
            )}
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
              title='Xem dạng danh sách'
            >
              <List size={15} />
            </button>
            <button
              type='button'
              onClick={() => setViewMode('grid')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-orange-500 text-white shadow-sm' : 'opacity-60 hover:opacity-100 text-inherit'
              }`}
              title='Xem dạng thẻ lưới'
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          <button
            onClick={() => navigate('/add?tab=order')}
            className='h-9 inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-black text-xs px-3.5 sm:px-4 rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer select-none'
          >
            <Plus size={15} strokeWidth={2.6} className='flex-shrink-0' />
            <span>Tạo đơn</span>
          </button>
        </div>
      </div>

      {orders.length > 0 && (
        <div className='space-y-2.5'>
          <div className='flex gap-2 items-center'>
            <div className='relative flex-1'>
              <Search size={15} className='absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40' />
              <input
                type='text'
                className={`w-full h-10 pl-9 pr-8 text-xs rounded-2xl border outline-none backdrop-blur-xl transition-all shadow-sm ${
                  isDark
                    ? 'bg-zinc-900/70 border-white/10 text-zinc-100 placeholder-zinc-500 focus:border-orange-500/60 focus:bg-zinc-900'
                    : 'bg-white/85 border-white/80 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:bg-white shadow-orange-500/5'
                }`}
                placeholder='Tìm theo tên khách, mẫu in 3D, mã đơn hàng, số điện thoại, nhựa in...'
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

            <button
              type='button'
              onClick={() => setShowFilters((prev) => !prev)}
              className={`h-10 px-3 sm:px-3.5 rounded-2xl border flex items-center gap-1.5 font-bold text-xs transition-all cursor-pointer select-none flex-shrink-0 shadow-xs ${
                showFilters || activeFilterCount > 0
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                  : isDark
                    ? 'bg-zinc-900/70 border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
                    : 'bg-white/85 border-white/80 text-zinc-700 hover:bg-white shadow-orange-500/5'
              }`}
              title={showFilters ? 'Ẩn bộ lọc chi tiết' : 'Hiện bộ lọc chi tiết'}
            >
              <SlidersHorizontal size={14} className={showFilters ? 'rotate-180 transition-transform' : ''} />
              <span className='hidden sm:inline'>{showFilters ? 'Ẩn bộ lọc' : 'Bộ lọc'}</span>
              {activeFilterCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-black rounded-full shadow-xs ${
                    showFilters || activeFilterCount > 0
                      ? 'bg-white text-orange-600 dark:bg-zinc-900 dark:text-orange-400'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div
              className={`p-3 rounded-2xl border backdrop-blur-2xl shadow-sm space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
                isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-white/80 border-white/80'
              }`}
            >
              <div className='flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-0.5'>
                {filterTabs.map((f) => {
                  const Icon = f.icon
                  const isActive = statusFilter === f.key

                  return (
                    <button
                      key={f.key}
                      type='button'
                      onClick={() => setStatusFilter(f.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                          : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
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

              <div className='flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-inherit/40'>
                <div className='flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-semibold flex-shrink-0'>
                  <Filter size={12} />
                  <span>Chi tiết:</span>
                </div>

                {uniqueMaterials.length > 0 && (
                  <select
                    value={materialFilter}
                    onChange={(e) => setMaterialFilter(e.target.value)}
                    className={`h-8 px-2.5 rounded-xl border text-xs outline-none transition-all cursor-pointer ${
                      materialFilter !== 'ALL'
                        ? 'bg-orange-500/15 border-orange-500 text-orange-600 dark:text-orange-300 font-bold'
                        : isDark
                          ? 'bg-zinc-800/80 border-white/10 text-zinc-200'
                          : 'bg-white border-zinc-200 text-zinc-800 shadow-xs'
                    }`}
                  >
                    <option value='ALL'>Tất cả nhựa ({uniqueMaterials.length})</option>
                    {uniqueMaterials.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as PriceFilterType)}
                  className={`h-8 px-2.5 rounded-xl border text-xs outline-none transition-all cursor-pointer ${
                    priceFilter !== 'ALL'
                      ? 'bg-orange-500/15 border-orange-500 text-orange-600 dark:text-orange-300 font-bold'
                      : isDark
                        ? 'bg-zinc-800/80 border-white/10 text-zinc-200'
                        : 'bg-white border-zinc-200 text-zinc-800 shadow-xs'
                  }`}
                >
                  <option value='ALL'>Tất cả mức giá</option>
                  <option value='UNDER_100K'>Dưới 100.000 đ</option>
                  <option value='100K_500K'>100.000 đ - 500.000 đ</option>
                  <option value='OVER_500K'>Trên 500.000 đ</option>
                </select>

                <div className='flex items-center gap-1 ml-auto'>
                  <ArrowUpDown size={13} className='text-zinc-400 flex-shrink-0 hidden sm:block' />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortByType)}
                    className={`h-8 px-2.5 rounded-xl border text-xs outline-none transition-all cursor-pointer ${
                      isDark
                        ? 'bg-zinc-800/80 border-white/10 text-zinc-200'
                        : 'bg-white border-zinc-200 text-zinc-800 shadow-xs'
                    }`}
                  >
                    <option value='date-desc'>Ngày: Mới nhất trước</option>
                    <option value='date-asc'>Ngày: Cũ nhất trước</option>
                    <option value='price-desc'>Giá tiền: Cao nhất trước</option>
                    <option value='price-asc'>Giá tiền: Thấp nhất trước</option>
                    <option value='qty-desc'>Số lượng: Nhiều nhất trước</option>
                    <option value='customer-asc'>Khách hàng: A → Z</option>
                  </select>
                </div>

                {isFiltered && (
                  <button
                    type='button'
                    onClick={handleResetFilters}
                    className='h-8 px-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold flex items-center gap-1 transition-all cursor-pointer'
                    title='Xóa tất cả bộ lọc'
                  >
                    <RotateCcw size={12} />
                    <span>Xóa lọc</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {!showFilters && activeFilterCount > 0 && (
            <div className='flex items-center gap-1.5 flex-wrap text-xs px-1 animate-in fade-in'>
              <span className='opacity-60 text-[11px] font-medium'>Đang lọc:</span>
              {statusFilter !== 'ALL' && (
                <span className='px-2 py-0.5 rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-300 border border-orange-500/30 text-[11px] font-bold'>
                  Trạng thái: {filterTabs.find((t) => t.key === statusFilter)?.label || statusFilter}
                </span>
              )}
              {materialFilter !== 'ALL' && (
                <span className='px-2 py-0.5 rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-300 border border-orange-500/30 text-[11px] font-bold'>
                  Nhựa: {materialFilter}
                </span>
              )}
              {priceFilter !== 'ALL' && (
                <span className='px-2 py-0.5 rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-300 border border-orange-500/30 text-[11px] font-bold'>
                  {priceFilter === 'UNDER_100K'
                    ? '< 100.000 đ'
                    : priceFilter === '100K_500K'
                      ? '100k - 500k'
                      : '> 500.000 đ'}
                </span>
              )}
              {sortBy !== 'date-desc' && (
                <span className='px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-[11px] font-semibold opacity-75'>
                  {sortBy === 'date-asc'
                    ? 'Cũ nhất'
                    : sortBy === 'price-desc'
                      ? 'Giá cao'
                      : sortBy === 'price-asc'
                        ? 'Giá thấp'
                        : sortBy === 'qty-desc'
                          ? 'SL nhiều'
                          : 'Tên A-Z'}
                </span>
              )}
              <button
                type='button'
                onClick={handleResetFilters}
                className='text-[11px] text-rose-500 hover:underline font-bold ml-1 cursor-pointer'
              >
                Xóa lọc
              </button>
            </div>
          )}
        </div>
      )}

      {orders.length === 0 ? (
        <div
          className={`py-16 px-4 rounded-2xl border backdrop-blur-2xl text-center space-y-3 ${
            isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-white/70 border-white/80 shadow-sm'
          }`}
        >
          <div className='w-14 h-14 mx-auto rounded-2xl bg-orange-500/15 border border-orange-500/20 text-orange-500 flex items-center justify-center shadow-inner'>
            <ShoppingBag size={26} strokeWidth={1.8} />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm font-bold'>Chưa có đơn hàng nào</h3>
            <p className='text-xs opacity-60 max-w-sm mx-auto'>Bấm vào nút bên dưới để tạo đơn in 3D đầu tiên.</p>
          </div>
          <div className='pt-2'>
            <button
              onClick={() => navigate('/add?tab=order')}
              className='px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 cursor-pointer hover:opacity-95 transition-all'
            >
              + Tạo đơn ngay
            </button>
          </div>
        </div>
      ) : displayedOrders.length === 0 ? (
        <div
          className={`py-14 px-4 rounded-2xl border backdrop-blur-2xl text-center space-y-3 ${
            isDark ? 'bg-zinc-900/50 border-white/10' : 'bg-white/70 border-white/80 shadow-sm'
          }`}
        >
          <div className='w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-inner'>
            <Search size={22} strokeWidth={2} />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm font-bold'>Không tìm thấy đơn hàng nào</h3>
            <p className='text-xs opacity-60 max-w-sm mx-auto'>
              Không có đơn hàng nào khớp với từ khóa tìm kiếm hoặc điều kiện lọc hiện tại.
            </p>
          </div>
          <div className='pt-2'>
            <button
              type='button'
              onClick={handleResetFilters}
              className='inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-orange-500/20 transition-all cursor-pointer'
            >
              <RotateCcw size={13} />
              <span>Đặt lại bộ lọc</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
          {displayedOrders.map((order: Order) => {
            const mats =
              order.materials && order.materials.length > 0
                ? order.materials
                : [{ type: order.material || 'PLA', color: order.color || 'Mặc định' }]
            const hexList = mats.map((m: any) => getFilamentColor(m)).filter(Boolean)
            const firstHex = hexList[0] || ''

            return (
              <div
                key={order.id}
                onClick={() => openOrderModal(order)}
                className={`group relative p-4 rounded-2xl border backdrop-blur-2xl shadow-lg transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 flex flex-col justify-between ${
                  isDark
                    ? 'bg-zinc-900/65 border-white/10 text-zinc-100 shadow-black/40 hover:border-orange-500/40 hover:bg-zinc-900/85 hover:shadow-orange-500/10'
                    : 'bg-white/75 border-white/80 text-zinc-900 shadow-orange-500/5 hover:border-orange-300 hover:bg-white/95 hover:shadow-orange-500/15'
                }`}
              >
                <div
                  className='absolute top-0 right-0 w-24 h-24 rounded-bl-full pointer-events-none opacity-15 group-hover:opacity-30 transition-opacity'
                  style={{ backgroundColor: firstHex || '#f97316' }}
                />

                <div>
                  <div className='flex items-center justify-between gap-2 mb-2.5'>
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center -space-x-1.5 flex-shrink-0'>
                        {hexList.length > 0 ? (
                          hexList.map((hex: string, i: number) => (
                            <div
                              key={i}
                              className='w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white dark:border-zinc-800 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0'
                              style={{ backgroundColor: hex, zIndex: 10 - i }}
                              title={`Nhựa: ${mats[i]?.type || ''} • Màu: ${mats[i]?.color || ''}`}
                            />
                          ))
                        ) : (
                          <div className='w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white dark:border-zinc-800 bg-orange-500/20 text-orange-500 shadow-md flex items-center justify-center'>
                            <Layers size={12} />
                          </div>
                        )}
                      </div>

                      <div className='flex items-center gap-1.5'>
                        <span className='font-mono font-black text-orange-500 text-xs px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20'>
                          #{order.id}
                        </span>
                        <span className='text-[10px] opacity-50 flex items-center gap-1'>
                          <Calendar size={10} />
                          {formatDate(order.date)}
                        </span>
                      </div>
                    </div>

                    <StatusBadge status={order.status} size='sm' />
                  </div>

                  <h3 className='font-black text-sm group-hover:text-orange-500 transition-colors line-clamp-1 mb-1.5'>
                    {order.itemName}
                  </h3>

                  <div className='flex flex-wrap gap-1 mb-2.5'>
                    {mats.map((m: any, idx: number) => {
                      const hex = getFilamentColor(m)
                      return (
                        <span
                          key={idx}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${
                            isDark
                              ? 'bg-zinc-800/70 border-white/5 text-zinc-300'
                              : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                          }`}
                        >
                          {hex ? (
                            <span
                              className='w-2 h-2 rounded-full border border-black/20 dark:border-white/20 shadow-xs flex-shrink-0'
                              style={{ backgroundColor: hex }}
                            />
                          ) : (
                            <Layers size={10} className='text-orange-400 opacity-80 flex-shrink-0' />
                          )}
                          <span>{m.type}</span>
                          <span className='opacity-60 font-normal'>({m.color || 'Mặc định'})</span>
                        </span>
                      )
                    })}
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

                <div className='mt-3 pt-2 border-t border-inherit/40 flex items-center justify-between'>
                  <span className='text-[11px] font-bold opacity-60'>
                    Số lượng: <span className='text-inherit font-black'>{order.quantity}</span>
                  </span>
                  <span className='font-black text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500'>
                    {formatCurrency(order.price)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div
          className={`rounded-2xl sm:rounded-3xl border backdrop-blur-2xl shadow-xl transition-all duration-300 overflow-hidden ${
            isDark
              ? 'bg-zinc-900/60 border-white/10 text-zinc-100 shadow-black/50'
              : 'bg-white/80 border-white/80 text-zinc-900 shadow-orange-500/5'
          }`}
        >
          <div
            className={`hidden md:grid grid-cols-12 px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider border-b border-inherit/60 opacity-60 bg-black/[0.02] dark:bg-white/[0.02]`}
          >
            <div className='col-span-5'>Mẫu In & Nhựa In</div>
            <div className='col-span-3'>Khách Hàng</div>
            <div className='col-span-2 text-right'>Số Lượng & Giá</div>
            <div className='col-span-2 text-right'>Trạng Thái</div>
          </div>

          <div className='divide-y divide-inherit/40'>
            {displayedOrders.map((order: Order) => {
              const mats =
                order.materials && order.materials.length > 0
                  ? order.materials
                  : [{ type: order.material || 'PLA', color: order.color || 'Mặc định' }]
              const hexList = mats.map((m: any) => getFilamentColor(m)).filter(Boolean)

              return (
                <div
                  key={order.id}
                  onClick={() => openOrderModal(order)}
                  className='px-4 sm:px-6 py-3 sm:py-3.5 md:grid md:grid-cols-12 md:items-center hover:bg-orange-500/[0.04] dark:hover:bg-white/[0.04] transition-all cursor-pointer text-xs group'
                >
                  <div className='col-span-5 flex items-center gap-3 min-w-0 pr-2'>
                    <div className='flex items-center -space-x-2 flex-shrink-0'>
                      {hexList.length > 0 ? (
                        hexList.map((hex: string, i: number) => (
                          <div
                            key={i}
                            className='w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-zinc-800 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0'
                            style={{ backgroundColor: hex, zIndex: 10 - i }}
                            title={`Nhựa: ${mats[i]?.type || ''} • Màu: ${mats[i]?.color || ''}`}
                          />
                        ))
                      ) : (
                        <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-orange-500/20 text-orange-500 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform'>
                          <Layers size={14} />
                        </div>
                      )}
                    </div>

                    <div className='min-w-0'>
                      <div className='flex items-center gap-1.5'>
                        <div className='font-black text-xs sm:text-sm truncate group-hover:text-orange-500 transition-colors'>
                          {order.itemName}
                        </div>
                        <span className='font-mono font-bold text-[10px] text-zinc-400 dark:text-zinc-500 flex-shrink-0'>
                          #{order.id}
                        </span>
                      </div>

                      <div className='opacity-70 text-[10px] sm:text-[11px] truncate flex items-center gap-1.5 mt-0.5'>
                        <span className='truncate font-semibold text-orange-600 dark:text-orange-400'>
                          {mats.map((m: any) => (m.color ? `${m.type} (${m.color})` : m.type)).join(', ')}
                        </span>
                        {order.notes && (
                          <span className='italic opacity-75 truncate max-w-[120px] hidden sm:inline'>
                            • 📝 {order.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='col-span-3 text-xs opacity-80 truncate hidden md:block'>
                    <div className='font-semibold truncate text-zinc-800 dark:text-zinc-200 flex items-center gap-1'>
                      <User size={12} className='opacity-50 flex-shrink-0' />
                      <span className='truncate'>{order.customerName}</span>
                    </div>
                    <div className='text-[10px] opacity-60 truncate mt-0.5 flex items-center gap-1.5'>
                      {order.phone && (
                        <span className='flex items-center gap-0.5'>
                          <Phone size={9} /> {order.phone}
                        </span>
                      )}
                      <span>•</span>
                      <span>{formatDate(order.date)}</span>
                    </div>
                  </div>

                  <div className='col-span-2 text-right hidden md:block'>
                    <div className='font-black text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500'>
                      {formatCurrency(order.price)}
                    </div>
                    <div className='text-[10px] opacity-60'>SL: {order.quantity}</div>
                  </div>

                  <div className='col-span-2 flex items-center justify-between md:justify-end gap-2 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-inherit/40'>
                    <div className='md:hidden flex items-center justify-between w-full'>
                      <div className='text-[10px] opacity-70 flex items-center gap-1.5'>
                        <User size={10} />
                        <span>{order.customerName}</span>
                        <span>•</span>
                        <span className='font-black text-orange-500'>{formatCurrency(order.price)}</span>
                      </div>
                      <StatusBadge status={order.status} size='sm' />
                    </div>

                    <div className='hidden md:flex items-center gap-2'>
                      <StatusBadge status={order.status} size='sm' />
                      <div className='opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-orange-400'>
                        <ChevronRight size={15} />
                      </div>
                    </div>
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

export default OrdersPage
