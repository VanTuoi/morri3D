import React, { useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Clock, Printer, Box, ArrowRight } from 'lucide-react';
import { STATUSES, formatCurrency, formatDate, Order } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';

export const DashboardPage: React.FC = () => {
  const { stats, orders, theme, openOrderModal } = useOutletContext<any>();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [orders]);

  const completedCount = orders.filter((o: Order) => o.status === STATUSES.COMPLETED).length;
  const completionRate = stats.totalOrders > 0 ? Math.round((completedCount / stats.totalOrders) * 100) : 0;

  return (
    <div className="space-y-3.5 sm:space-y-5 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Top Metrics Strip */}
      <div className={`rounded-xl sm:rounded-2xl border divide-y sm:divide-y-0 sm:divide-x grid grid-cols-2 sm:grid-cols-4 ${
        isDark ? 'bg-zinc-900/50 border-zinc-800 divide-zinc-800' : 'bg-white border-zinc-200 divide-zinc-200'
      }`}>
        <div className="p-3 sm:p-5">
          <div className="text-[10px] sm:text-[11px] font-medium opacity-60 uppercase tracking-wider">Doanh thu</div>
          <div className="text-lg sm:text-2xl font-black text-orange-500 mt-0.5 sm:mt-1">
            {formatCurrency(stats.revenue)}
          </div>
          <div className="text-[10px] sm:text-[11px] opacity-60 mt-0.5">{completionRate}% hoàn tất</div>
        </div>

        <div 
          onClick={() => navigate('/orders')}
          className="p-3 sm:p-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <div className="text-[10px] sm:text-[11px] font-medium opacity-60 uppercase tracking-wider flex items-center justify-between">
            <span>Chờ in</span>
            <Clock size={12} className="text-blue-400" />
          </div>
          <div className="text-lg sm:text-2xl font-black mt-0.5 sm:mt-1">{stats.pending}</div>
          <div className="text-[10px] sm:text-[11px] opacity-60 mt-0.5">Đơn đợi máy</div>
        </div>

        <div 
          onClick={() => navigate('/orders')}
          className="p-3 sm:p-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <div className="text-[10px] sm:text-[11px] font-medium opacity-60 uppercase tracking-wider flex items-center justify-between">
            <span>Đang in</span>
            <Printer size={12} className="text-rose-400" />
          </div>
          <div className="text-lg sm:text-2xl font-black mt-0.5 sm:mt-1">{stats.printing}</div>
          <div className="text-[10px] sm:text-[11px] opacity-60 mt-0.5">Đang chạy máy</div>
        </div>

        <div 
          onClick={() => navigate('/orders')}
          className="p-3 sm:p-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <div className="text-[10px] sm:text-[11px] font-medium opacity-60 uppercase tracking-wider flex items-center justify-between">
            <span>Tổng đơn</span>
            <Box size={12} className="text-purple-400" />
          </div>
          <div className="text-lg sm:text-2xl font-black mt-0.5 sm:mt-1">{stats.totalOrders}</div>
          <div className="text-[10px] sm:text-[11px] opacity-60 mt-0.5">{completedCount} đã giao</div>
        </div>
      </div>

      {/* Recent Orders Flat Table */}
      <div className={`rounded-xl sm:rounded-2xl border overflow-hidden ${
        isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3.5 border-b border-inherit flex items-center justify-between">
          <div className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
            <span>Đơn hàng mới tạo</span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}>
              {recentOrders.length}
            </span>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="text-[11px] sm:text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-xs opacity-60">Chưa có đơn hàng nào.</div>
        ) : (
          <div className="divide-y divide-inherit overflow-x-auto">
            {recentOrders.map(order => (
              <div
                key={order.id}
                onClick={() => openOrderModal(order)}
                className="px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono font-bold text-orange-500 flex-shrink-0 text-xs">
                    #{order.id}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs sm:text-sm truncate">{order.itemName}</div>
                    <div className="opacity-60 text-[10px] sm:text-[11px] truncate flex items-center gap-1 mt-0.5">
                      <span>{order.customerName}</span>
                      <span>•</span>
                      <span>{order.materials?.length ? order.materials.map((m: any) => m.type).join(', ') : order.material || 'PLA'}</span>
                      <span>•</span>
                      <span>SL: {order.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3.5 flex-shrink-0">
                  <div className="text-right">
                    <div className="font-bold text-xs sm:text-sm">{formatCurrency(order.price)}</div>
                    <div className="text-[9px] sm:text-[10px] opacity-60">{formatDate(order.date)}</div>
                  </div>
                  <StatusBadge status={order.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
