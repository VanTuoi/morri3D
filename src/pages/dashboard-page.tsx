import React, { useMemo } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { Clock, Printer, Box, ArrowRight, DollarSign, Plus, Layers } from 'lucide-react'
import type { Order, Filament } from '~/types'
import { STATUSES, formatCurrency, formatDate } from '~/types'
import { StatusBadge } from '~/components/ui/status-badge'
import { PromoBanner } from '~/components/ui'

export const DashboardPage: React.FC = () => {
    const { stats, orders = [], filaments = [], theme, openOrderModal } = useOutletContext<any>()
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

    const recentOrders = useMemo(() => {
        return [...orders]
            .sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 6)
    }, [orders])

    const completedCount = orders.filter((o: Order) => o.status === STATUSES.COMPLETED).length

    return (
        <div className='relative overflow-x-clip space-y-4 sm:space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto'>
            <div className='absolute inset-0 overflow-hidden pointer-events-none -z-10'>
                <div className='absolute -top-12 -left-10 w-72 h-72 bg-orange-500/10 dark:bg-orange-500/15 rounded-full filter blur-[80px]' />
                <div className='absolute top-40 -right-10 w-80 h-80 bg-rose-500/10 dark:bg-rose-500/15 rounded-full filter blur-[90px]' />
                <div className='absolute bottom-10 left-1/3 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/10 rounded-full filter blur-[80px]' />
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4'>
                <div
                    className={`relative p-3.5 sm:p-5 rounded-2xl border backdrop-blur-2xl transition-all duration-300 overflow-hidden group shadow-lg ${
                        isDark
                            ? 'bg-zinc-900/65 border-white/10 text-zinc-100 shadow-black/40 hover:border-orange-500/40 hover:bg-zinc-900/80'
                            : 'bg-white/75 border-white/80 text-zinc-900 shadow-orange-500/5 hover:border-orange-300 hover:bg-white/90'
                    }`}
                >
                    <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/15 to-transparent rounded-bl-full pointer-events-none' />
                    <div className='flex items-center justify-between'>
                        <span className='text-[10px] sm:text-[11px] font-bold uppercase tracking-wider opacity-60'>
                            Doanh thu
                        </span>
                        <div className='w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center border border-orange-500/20 shadow-sm'>
                            <DollarSign size={18} className='sm:w-5 sm:h-5' strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className='text-xl sm:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 mt-1 sm:mt-2'>
                        {formatCurrency(stats?.revenue || 0)}
                    </div>
                    <div className='text-[10px] sm:text-[11px] opacity-60 mt-1 font-medium'>
                        {completedCount} đơn hoàn tất
                    </div>
                </div>

                <div
                    onClick={() => navigate('/orders')}
                    className={`relative p-3.5 sm:p-5 rounded-2xl border backdrop-blur-2xl transition-all duration-300 overflow-hidden group shadow-lg cursor-pointer hover:-translate-y-0.5 ${
                        isDark
                            ? 'bg-zinc-900/65 border-white/10 text-zinc-100 shadow-black/40 hover:border-purple-500/40 hover:bg-zinc-900/80'
                            : 'bg-white/75 border-white/80 text-zinc-900 shadow-purple-500/5 hover:border-purple-300 hover:bg-white/90'
                    }`}
                >
                    <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/15 to-transparent rounded-bl-full pointer-events-none' />
                    <div className='flex items-center justify-between'>
                        <span className='text-[10px] sm:text-[11px] font-bold uppercase tracking-wider opacity-60'>
                            Tổng đơn
                        </span>
                        <div className='w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/20 shadow-sm'>
                            <Box size={18} className='sm:w-5 sm:h-5' strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className='text-xl sm:text-2xl lg:text-3xl font-black mt-1 sm:mt-2 text-purple-400'>
                        {stats?.totalOrders || orders.length}
                    </div>
                    <div className='text-[10px] sm:text-[11px] opacity-60 mt-1 font-medium'>
                        {completedCount} đơn đã giao
                    </div>
                </div>

                <div
                    onClick={() => navigate('/orders')}
                    className={`relative p-3.5 sm:p-5 rounded-2xl border backdrop-blur-2xl transition-all duration-300 overflow-hidden group shadow-lg cursor-pointer hover:-translate-y-0.5 ${
                        isDark
                            ? 'bg-zinc-900/65 border-white/10 text-zinc-100 shadow-black/40 hover:border-blue-500/40 hover:bg-zinc-900/80'
                            : 'bg-white/75 border-white/80 text-zinc-900 shadow-blue-500/5 hover:border-blue-300 hover:bg-white/90'
                    }`}
                >
                    <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/15 to-transparent rounded-bl-full pointer-events-none' />
                    <div className='flex items-center justify-between'>
                        <span className='text-[10px] sm:text-[11px] font-bold uppercase tracking-wider opacity-60'>
                            Chờ in
                        </span>
                        <div className='w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-sm'>
                            <Clock size={18} className='sm:w-5 sm:h-5' strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className='text-xl sm:text-2xl lg:text-3xl font-black mt-1 sm:mt-2 text-blue-400'>
                        {stats?.pending || 0}
                    </div>
                    <div className='text-[10px] sm:text-[11px] opacity-60 mt-1 font-medium'>Đơn đang đợi máy in</div>
                </div>

                <div
                    onClick={() => navigate('/orders')}
                    className={`relative p-3.5 sm:p-5 rounded-2xl border backdrop-blur-2xl transition-all duration-300 overflow-hidden group shadow-lg cursor-pointer hover:-translate-y-0.5 ${
                        isDark
                            ? 'bg-zinc-900/65 border-white/10 text-zinc-100 shadow-black/40 hover:border-rose-500/40 hover:bg-zinc-900/80'
                            : 'bg-white/75 border-white/80 text-zinc-900 shadow-rose-500/5 hover:border-rose-300 hover:bg-white/90'
                    }`}
                >
                    <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-500/15 to-transparent rounded-bl-full pointer-events-none' />
                    <div className='flex items-center justify-between'>
                        <span className='text-[10px] sm:text-[11px] font-bold uppercase tracking-wider opacity-60'>
                            Đang in
                        </span>
                        <div className='w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-sm'>
                            <Printer size={18} className='sm:w-5 sm:h-5' strokeWidth={2.5} />
                        </div>
                    </div>
                    <div className='text-xl sm:text-2xl lg:text-3xl font-black mt-1 sm:mt-2 text-rose-400'>
                        {stats?.printing || 0}
                    </div>
                    <div className='text-[10px] sm:text-[11px] opacity-60 mt-1 font-medium'>Đang chạy in 3D</div>
                </div>
            </div>

            <div
                className={`rounded-2xl sm:rounded-3xl border backdrop-blur-2xl shadow-xl transition-all duration-300 overflow-hidden ${
                    isDark
                        ? 'bg-zinc-900/60 border-white/10 text-zinc-100 shadow-black/50'
                        : 'bg-white/80 border-white/80 text-zinc-900 shadow-orange-500/5'
                }`}
            >
                <div className='px-4 sm:px-6 py-3.5 sm:py-4 border-b border-inherit/60 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]'>
                    <div className='font-bold text-xs sm:text-sm flex items-center gap-2'>
                        <div className='w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' />
                        <span>Đơn hàng mới tạo gần đây</span>
                        <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                isDark
                                    ? 'bg-zinc-800/80 border-white/10 text-zinc-300'
                                    : 'bg-orange-50 border-orange-200 text-orange-600'
                            }`}
                        >
                            {recentOrders.length}
                        </span>
                    </div>

                    <button
                        onClick={() => navigate('/orders')}
                        className='group text-[11px] sm:text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1.5 transition-colors cursor-pointer'
                    >
                        <span>Xem toàn bộ đơn</span>
                        <ArrowRight size={13} className='group-hover:translate-x-1 transition-transform' />
                    </button>
                </div>

                {recentOrders.length === 0 ? (
                    <div className='text-center py-12 px-4'>
                        <div className='w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 mx-auto flex items-center justify-center mb-3 border border-orange-500/20'>
                            <Box size={22} />
                        </div>
                        <div className='font-bold text-sm mb-1'>Chưa có đơn hàng nào</div>
                        <div className='text-xs opacity-60 max-w-xs mx-auto mb-4'>
                            Tạo đơn in 3D đầu tiên để bắt đầu theo dõi tiến độ và doanh thu.
                        </div>
                        <button
                            onClick={() => navigate('/add?tab=order')}
                            className='inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all cursor-pointer'
                        >
                            <Plus size={14} />
                            <span>Tạo đơn in ngay</span>
                        </button>
                    </div>
                ) : (
                    <div className='divide-y divide-inherit/40'>
                        {recentOrders.map((order: Order) => {
                            const mats =
                                order.materials && order.materials.length > 0
                                    ? order.materials
                                    : [{ type: order.material || 'PLA', color: order.color || 'Mặc định' }]

                            const hexList = mats.map((m: any) => getFilamentColor(m)).filter(Boolean)

                            return (
                                <div
                                    key={order.id}
                                    onClick={() => openOrderModal(order)}
                                    className='px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-orange-500/[0.04] dark:hover:bg-white/[0.04] transition-all cursor-pointer text-xs group'
                                >
                                    <div className='flex items-center gap-3 min-w-0'>
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
                                                <div className='font-bold text-xs sm:text-sm truncate group-hover:text-orange-500 transition-colors'>
                                                    {order.itemName}
                                                </div>
                                                <span className='font-mono font-bold text-[10px] text-zinc-400 dark:text-zinc-500'>
                                                    #{order.id}
                                                </span>
                                            </div>

                                            <div className='opacity-70 text-[10px] sm:text-[11px] truncate flex items-center gap-1.5 mt-0.5'>
                                                <span className='font-semibold text-zinc-800 dark:text-zinc-200'>
                                                    {order.customerName}
                                                </span>
                                                <span>•</span>
                                                <span className='truncate font-semibold text-orange-600 dark:text-orange-400'>
                                                    {mats
                                                        .map((m: any) => (m.color ? `${m.type} (${m.color})` : m.type))
                                                        .join(', ')}
                                                </span>
                                                <span>•</span>
                                                <span className='flex-shrink-0 opacity-80'>SL: {order.quantity}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2.5 sm:gap-4 flex-shrink-0'>
                                        <div className='text-right'>
                                            <div className='font-black text-xs sm:text-sm text-orange-500 sm:text-inherit'>
                                                {formatCurrency(order.price)}
                                            </div>
                                            <div className='text-[9px] sm:text-[10px] opacity-60'>
                                                {formatDate(order.date)}
                                            </div>
                                        </div>
                                        <StatusBadge status={order.status} size='sm' />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <PromoBanner theme={theme} />
        </div>
    )
}

export default DashboardPage
