import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Printer, 
  CheckCircle, 
  Box, 
  Search, 
  PlusCircle, 
  Palette, 
  Database, 
  X,
  TrendingUp,
  User,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
  Edit2
} from 'lucide-react';
import { Order, Filament, STATUSES, BASIC_COLORS, formatCurrency, formatDate } from '../types';
import { StatusBadge } from './ui/StatusBadge';

/* ==============================================================================
 * DASHBOARD TAB (Minimalist Strip & High-Density Table)
 * ============================================================================== */
interface DashboardTabProps {
  stats: { totalOrders: number; revenue: number; printing: number; pending: number };
  orders: Order[];
  theme: 'dark' | 'light';
  onNavigateTab?: (tab: 'orders' | 'inventory' | 'add') => void;
  onOpenOrderModal?: (order: Order) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ 
  stats, 
  orders, 
  theme,
  onNavigateTab,
  onOpenOrderModal
}) => {
  const isDark = theme === 'dark';

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [orders]);

  const completedCount = orders.filter(o => o.status === STATUSES.COMPLETED).length;
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
          onClick={onNavigateTab ? () => onNavigateTab('orders') : undefined}
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
          onClick={onNavigateTab ? () => onNavigateTab('orders') : undefined}
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
          onClick={onNavigateTab ? () => onNavigateTab('orders') : undefined}
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
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-[11px] sm:text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-xs opacity-60">Chưa có đơn hàng nào.</div>
        ) : (
          <div className="divide-y divide-inherit overflow-x-auto">
            {recentOrders.map(order => (
              <div
                key={order.id}
                onClick={() => onOpenOrderModal && onOpenOrderModal(order)}
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

/* ==============================================================================
 * ORDERS TAB (Flat Data Table / List)
 * ============================================================================== */
interface OrdersTabProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filteredOrders: Order[];
  theme: 'dark' | 'light';
  onOpenOrderModal: (order: Order) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  searchQuery,
  onSearchChange,
  filteredOrders,
  theme,
  onOpenOrderModal
}) => {
  const isDark = theme === 'dark';
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const displayedOrders = useMemo(() => {
    if (statusFilter === 'ALL') return filteredOrders;
    return filteredOrders.filter(o => o.status === statusFilter);
  }, [filteredOrders, statusFilter]);

  const filterCounts = useMemo(() => {
    return {
      ALL: filteredOrders.length,
      [STATUSES.PENDING]: filteredOrders.filter(o => o.status === STATUSES.PENDING).length,
      [STATUSES.PRINTING]: filteredOrders.filter(o => o.status === STATUSES.PRINTING).length,
      [STATUSES.COMPLETED]: filteredOrders.filter(o => o.status === STATUSES.COMPLETED).length,
    };
  }, [filteredOrders]);

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            type="text"
            className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl border outline-none transition-all ${
              isDark 
                ? 'bg-zinc-900/60 border-zinc-800 text-white placeholder-zinc-500 focus:border-orange-500' 
                : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-orange-500'
            }`}
            placeholder="Tìm tên khách, mẫu in, mã đơn..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className={`flex items-center p-0.5 sm:p-1 rounded-xl border overflow-x-auto scrollbar-hide flex-shrink-0 ${
          isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
        }`}>
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
                  ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-950 shadow-sm'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <span>{f.label}</span>
              <span className="text-[9px] opacity-75 font-normal">({f.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Table View (Linear style) */}
      <div className={`rounded-xl sm:rounded-2xl border overflow-hidden ${
        isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        {/* Table Header (Desktop only) */}
        <div className={`hidden md:grid grid-cols-12 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b border-inherit opacity-50 ${
          isDark ? 'bg-zinc-900/80' : 'bg-zinc-50'
        }`}>
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
                onClick={() => onOpenOrderModal(order)}
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

/* ==============================================================================
 * INVENTORY TAB (Flat High-Density Table)
 * ============================================================================== */
interface InventoryTabProps {
  filaments: Filament[];
  theme: 'dark' | 'light';
  onOpenFilamentModal: (filament: Filament) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  filaments,
  theme,
  onOpenFilamentModal
}) => {
  const isDark = theme === 'dark';

  const totalWeightKg = useMemo(() => {
    const sumGrams = filaments.reduce((acc, f) => {
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
            {filaments.map(item => {
              const currentWeight = item.weight ?? (item.percentage !== undefined ? item.percentage * 10 : 1000);
              const percentage = Math.min(100, Math.max(0, Math.round((currentWeight / 1000) * 100)));

              return (
                <div
                  key={item.id}
                  onClick={() => onOpenFilamentModal(item)}
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

/* ==============================================================================
 * ADD TAB (Unified Flat Form)
 * ============================================================================== */
interface AddTabProps {
  addMode: 'order' | 'filament';
  setAddMode: (mode: 'order' | 'filament') => void;
  newOrder: any;
  setNewOrder: React.Dispatch<React.SetStateAction<any>>;
  onAddOrder: (e: React.FormEvent) => void;
  onAddOrderMaterial: () => void;
  onUpdateOrderMaterial: (index: number, field: string, val: string) => void;
  onRemoveOrderMaterial: (index: number) => void;
  newFilament: any;
  setNewFilament: React.Dispatch<React.SetStateAction<any>>;
  pendingVariations: any[];
  onAddVariation: () => void;
  onRemoveVariation: (id: string) => void;
  onAddFilament: (e: React.FormEvent) => void;
  filaments: Filament[];
  theme: 'dark' | 'light';
}

export const AddTab: React.FC<AddTabProps> = ({
  addMode,
  setAddMode,
  newOrder,
  setNewOrder,
  onAddOrder,
  onAddOrderMaterial,
  onUpdateOrderMaterial,
  onRemoveOrderMaterial,
  newFilament,
  setNewFilament,
  pendingVariations,
  onAddVariation,
  onRemoveVariation,
  onAddFilament,
  filaments,
  theme
}) => {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-3.5 sm:space-y-5 animate-in fade-in duration-200 max-w-2xl mx-auto">
      {/* Mode Switcher */}
      <div className={`p-1 rounded-xl border flex max-w-xs mx-auto ${
        isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
      }`}>
        <button 
          onClick={() => setAddMode('order')} 
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            addMode === 'order' 
              ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-950 shadow-sm') 
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          Tạo đơn hàng
        </button>
        <button 
          onClick={() => setAddMode('filament')} 
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            addMode === 'filament' 
              ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-950 shadow-sm') 
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          Nhập kho nhựa
        </button>
      </div>

      {/* Unified Single Flat Form Container */}
      <div className={`rounded-xl sm:rounded-2xl border p-3.5 sm:p-6 ${
        isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        {addMode === 'order' ? (
          <form onSubmit={onAddOrder} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Tên khách hàng *</label>
                <input 
                  required 
                  type="text" 
                  className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border outline-none ${
                    isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                  }`}
                  value={newOrder.customerName} 
                  onChange={e => setNewOrder({ ...newOrder, customerName: e.target.value })} 
                  placeholder="VD: Anh Minh..." 
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Số điện thoại *</label>
                <input 
                  required 
                  type="tel" 
                  className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border outline-none ${
                    isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                  }`}
                  value={newOrder.phone} 
                  onChange={e => setNewOrder({ ...newOrder, phone: e.target.value })} 
                  placeholder="0901234567..." 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Địa chỉ giao hàng</label>
              <input 
                type="text" 
                className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border outline-none ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                }`}
                value={newOrder.address} 
                onChange={e => setNewOrder({ ...newOrder, address: e.target.value })} 
                placeholder="Địa chỉ giao hàng..." 
              />
            </div>

            <div className="pt-2 border-t border-inherit">
              <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Tên sản phẩm (Mẫu in 3D) *</label>
              <input 
                required 
                type="text" 
                className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border outline-none ${
                  isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                }`}
                value={newOrder.itemName} 
                onChange={e => setNewOrder({ ...newOrder, itemName: e.target.value })} 
                placeholder="VD: Mô hình Iron Man..." 
              />
            </div>

            {/* Materials List */}
            <div className="space-y-2 pt-1">
              <label className="block text-[11px] sm:text-xs font-semibold opacity-70">Lựa chọn nhựa in</label>
              {newOrder.materials.map((mat: any, index: number) => (
                <div key={index} className="flex gap-1.5 sm:gap-2 items-center">
                  <select 
                    className={`flex-1 p-2 text-xs rounded-xl border outline-none ${
                      isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                    }`}
                    value={mat.inventoryId} 
                    onChange={e => onUpdateOrderMaterial(index, 'inventoryId', e.target.value)}
                  >
                    <option value="">-- Tự nhập thủ công --</option>
                    {filaments.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.brand} {f.type} - {f.colorName} ({f.weight ?? 1000}g)
                      </option>
                    ))}
                  </select>

                  {!mat.inventoryId && (
                    <>
                      <input 
                        type="text" 
                        required 
                        className={`w-20 sm:w-24 p-2 text-xs rounded-xl border outline-none ${
                          isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                        }`}
                        value={mat.type} 
                        onChange={e => onUpdateOrderMaterial(index, 'type', e.target.value)} 
                        placeholder="Loại nhựa" 
                      />
                      <input 
                        type="text" 
                        required 
                        className={`w-20 sm:w-24 p-2 text-xs rounded-xl border outline-none ${
                          isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                        }`}
                        value={mat.color} 
                        onChange={e => onUpdateOrderMaterial(index, 'color', e.target.value)} 
                        placeholder="Màu" 
                      />
                    </>
                  )}

                  {newOrder.materials.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => onRemoveOrderMaterial(index)} 
                      className="p-1.5 opacity-50 hover:opacity-100 text-red-400 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={onAddOrderMaterial} 
                className="text-[11px] sm:text-xs font-semibold text-orange-500 hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
              >
                <PlusCircle size={12} />
                <span>Thêm loại nhựa khác</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-inherit">
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Số lượng *</label>
                <input 
                  required 
                  type="number" 
                  min="1" 
                  className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border font-bold outline-none ${
                    isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                  }`}
                  value={newOrder.quantity} 
                  onChange={e => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) || 1 })} 
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Thành tiền (VNĐ) *</label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border font-bold outline-none ${
                    isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                  }`}
                  value={newOrder.price} 
                  onChange={e => setNewOrder({ ...newOrder, price: e.target.value })} 
                  placeholder="0" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold py-2.5 sm:py-3 rounded-xl shadow-sm transition-all cursor-pointer text-xs sm:text-sm mt-3"
            >
              Tạo Đơn Hàng
            </button>
          </form>
        ) : (
          /* Add Filament Form */
          <form onSubmit={onAddFilament} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Hãng sản xuất</label>
                <select
                  className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border outline-none ${
                    isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                  }`}
                  value={newFilament.brand}
                  onChange={e => setNewFilament({ ...newFilament, brand: e.target.value })}
                >
                  <option value="Bambu Lab">Bambu Lab</option>
                  <option value="Tinmorry">Tinmorry</option>
                  <option value="eSun">eSun</option>
                  <option value="Sunlu">Sunlu</option>
                  <option value="Stem">Stem</option>
                  <option value="Khác">Khác...</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Loại nhựa</label>
                <select
                  className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border outline-none ${
                    isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                  }`}
                  value={newFilament.type}
                  onChange={e => setNewFilament({ ...newFilament, type: e.target.value })}
                >
                  <option value="PLA Matte">PLA Matte</option>
                  <option value="PLA Basic">PLA Basic</option>
                  <option value="PLA Silk">PLA Silk</option>
                  <option value="PLA Lite">PLA Lite</option>
                  <option value="PETG Matte">PETG Matte</option>
                  <option value="PETG Basic">PETG Basic</option>
                  <option value="ABS">ABS</option>
                  <option value="TPU 95A">TPU 95A</option>
                </select>
              </div>
            </div>

            {/* Color Swatch Selection */}
            <div className="pt-2 border-t border-inherit space-y-2">
              <label className="block text-[11px] sm:text-xs font-semibold opacity-70">Chọn màu sắc</label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {BASIC_COLORS.map(color => (
                  <button
                    type="button"
                    key={color.hex}
                    onClick={() => setNewFilament({ ...newFilament, colorHex: color.hex, colorName: color.name })}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border transition-all cursor-pointer ${
                      newFilament.colorHex === color.hex ? 'ring-2 ring-orange-500 scale-110' : 'opacity-80 hover:opacity-100 border-white/20'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1.5">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Tên màu thương mại</label>
                  <input 
                    type="text" 
                    required
                    className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border outline-none ${
                      isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                    }`}
                    value={newFilament.colorName}
                    onChange={e => setNewFilament({ ...newFilament, colorName: e.target.value })}
                    placeholder="VD: Đỏ Ruby..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Số lượng cuộn</label>
                  <select
                    className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border outline-none ${
                      isDark ? 'bg-zinc-900/60 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200'
                    }`}
                    value={newFilament.quantity}
                    onChange={e => setNewFilament({ ...newFilament, quantity: parseInt(e.target.value) || 1 })}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i + 1} cuộn</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="button" 
                onClick={onAddVariation}
                className="text-[11px] sm:text-xs font-semibold text-purple-500 hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
              >
                <PlusCircle size={12} />
                <span>Thêm màu này vào danh sách</span>
              </button>
            </div>

            {pendingVariations.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-inherit">
                <div className="text-[11px] font-semibold opacity-70">
                  Sẽ nhập ({pendingVariations.reduce((acc, curr) => acc + curr.quantity, 0)} cuộn):
                </div>
                {pendingVariations.map(v => (
                  <div key={v.id} className="flex justify-between items-center text-xs p-1.5 px-2.5 rounded-lg bg-black/5 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: v.colorHex }} />
                      <span className="font-semibold">{v.colorName}</span>
                      <span className="opacity-60 text-[11px]">x{v.quantity}</span>
                    </div>
                    <button type="button" onClick={() => onRemoveVariation(v.id)} className="text-red-400 cursor-pointer">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold py-2.5 sm:py-3 rounded-xl shadow-sm transition-all cursor-pointer text-xs sm:text-sm mt-3"
            >
              Nhập {pendingVariations.length > 0 ? `${pendingVariations.reduce((acc, curr) => acc + curr.quantity, 0)} cuộn ` : ''}Vào Kho
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
