import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search } from 'lucide-react';
import { STATUSES, formatCurrency, formatDate, Order } from '../types';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';

export const OrdersPage: React.FC = () => {
  const { searchQuery, setSearchQuery, filteredOrders, openOrderModal } = useOutletContext<any>();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const displayedOrders = useMemo(() => {
    if (statusFilter === 'ALL') return filteredOrders;
    return filteredOrders.filter((o: Order) => o.status === statusFilter);
  }, [filteredOrders, statusFilter]);

  const filterCounts = useMemo(() => {
    return {
      ALL: filteredOrders.length,
      [STATUSES.PENDING]: filteredOrders.filter((o: Order) => o.status === STATUSES.PENDING).length,
      [STATUSES.PRINTING]: filteredOrders.filter((o: Order) => o.status === STATUSES.PRINTING).length,
      [STATUSES.COMPLETED]: filteredOrders.filter((o: Order) => o.status === STATUSES.COMPLETED).length,
    };
  }, [filteredOrders]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case STATUSES.PENDING:
        return 'pending';
      case STATUSES.PRINTING:
        return 'printing';
      case STATUSES.COMPLETED:
        return 'completed';
      case STATUSES.CANCELLED:
        return 'cancelled';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <Input
            className="pl-8"
            placeholder="Tìm tên khách, mẫu in, mã đơn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-0.5 sm:p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 overflow-x-auto scrollbar-hide flex-shrink-0">
          {[
            { key: 'ALL', label: 'Tất cả', count: filterCounts.ALL },
            { key: STATUSES.PENDING, label: 'Chờ in', count: filterCounts[STATUSES.PENDING] || 0 },
            { key: STATUSES.PRINTING, label: 'Đang in', count: filterCounts[STATUSES.PRINTING] || 0 },
            { key: STATUSES.COMPLETED, label: 'Hoàn thành', count: filterCounts[STATUSES.COMPLETED] || 0 },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                statusFilter === f.key
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <span>{f.label}</span>
              <span className="text-[9px] opacity-75 font-normal">({f.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List Card / Table View */}
      <Card className="overflow-hidden">
        {/* Table Header (Desktop only) */}
        <div className="hidden md:grid grid-cols-12 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b border-inherit bg-zinc-50 dark:bg-zinc-900/80 opacity-50">
          <div className="col-span-2">Mã & Ngày</div>
          <div className="col-span-4">Mẫu In & Vật liệu</div>
          <div className="col-span-2">Khách hàng</div>
          <div className="col-span-2 text-right">Giá tiền</div>
          <div className="col-span-2 text-right">Trạng thái</div>
        </div>

        {displayedOrders.length === 0 ? (
          <div className="text-center py-10 text-xs opacity-60">Không tìm thấy đơn hàng nào.</div>
        ) : (
          <div className="divide-y divide-inherit">
            {displayedOrders.map(order => (
              <div
                key={order.id}
                onClick={() => openOrderModal(order)}
                className="px-3.5 sm:px-5 py-2.5 sm:py-3 md:grid md:grid-cols-12 md:items-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-xs"
              >
                {/* ID & Date */}
                <div className="col-span-2 flex md:block items-center justify-between mb-0.5 md:mb-0">
                  <span className="font-mono font-bold text-orange-500 text-xs">
                    #{order.id}
                  </span>
                  <div className="text-[10px] sm:text-[11px] opacity-50 md:mt-0.5">{formatDate(order.date)}</div>
                </div>

                {/* Item & Materials */}
                <div className="col-span-4 min-w-0 mb-1 md:mb-0">
                  <div className="font-bold text-xs sm:text-sm truncate">{order.itemName}</div>
                  <div className="text-[10px] sm:text-[11px] opacity-60 truncate">
                    {order.materials?.length
                      ? order.materials.map((m: any) => `${m.type} (${m.color})`).join(', ')
                      : `${order.material || 'PLA'} • ${order.color || 'Mặc định'}`}
                    <span className="mx-1">•</span> SL: {order.quantity}
                  </div>
                </div>

                {/* Customer */}
                <div className="col-span-2 text-xs opacity-80 truncate hidden md:block">
                  {order.customerName}
                </div>

                {/* Price */}
                <div className="col-span-2 text-right font-bold text-xs sm:text-sm text-orange-500">
                  {formatCurrency(order.price)}
                </div>

                {/* Status Badge */}
                <div className="col-span-2 flex items-center justify-between md:justify-end gap-2 mt-1.5 md:mt-0 pt-1.5 md:pt-0 border-t md:border-t-0 border-inherit">
                  <span className="md:hidden text-[10px] opacity-60">{order.customerName}</span>
                  <Badge variant={getStatusVariant(order.status) as any}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
