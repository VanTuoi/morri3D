import React from 'react';
import { 
  Clock, 
  Printer, 
  CheckCircle, 
  Box, 
  Search, 
  Weight, 
  PlusCircle, 
  Palette, 
  Database, 
  X 
} from 'lucide-react';
import { Order, Filament, STATUSES, STATUS_COLORS, BASIC_COLORS, formatCurrency, formatDate } from '../types';

interface DashboardTabProps {
  stats: { totalOrders: number; revenue: number; printing: number; pending: number };
  orders: Order[];
  theme: 'dark' | 'light';
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ stats, orders, theme }) => (
  <div className="p-4 space-y-6 animate-in fade-in duration-500">
    <div className={`relative overflow-hidden ${theme === 'light' ? 'bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200 text-gray-900 border-white/60 shadow-[0_8px_32px_rgba(251,146,60,0.15)]' : 'bg-gradient-to-br from-rose-500/80 via-orange-400/80 to-amber-300/80 text-gray-900 border-white/40 shadow-[0_8px_32px_rgba(251,146,60,0.3)]'} rounded-[2rem] p-6 backdrop-blur-xl border`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-2xl -mr-10 -mt-10"></div>
      <h2 className="text-gray-900/80 text-sm font-semibold mb-1 uppercase tracking-wider">Doanh thu hoàn thành</h2>
      <div className="text-4xl font-black tracking-tight">{formatCurrency(stats.revenue)}</div>
      <div className="mt-6 flex items-center text-xs font-medium bg-white/40 backdrop-blur-md w-fit px-4 py-2 rounded-full shadow-sm border border-white/25">
        <Clock size={14} className="mr-2" />
        <span>Cập nhật hôm nay</span>
      </div>
    </div>

    <h3 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'} text-lg ml-2`}>Thống kê máy in</h3>
    
    <div className="grid grid-cols-2 gap-4">
      <div className={`${theme === 'light' ? 'bg-white/80 border-gray-200 shadow-md text-gray-800' : 'bg-white/5 border-white/10 shadow-lg text-gray-50'} backdrop-blur-xl p-5 rounded-[1.5rem] flex flex-col items-center justify-center relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-500 dark:text-blue-300 mb-3 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <Clock size={24} />
        </div>
        <span className="text-3xl font-bold">{stats.pending}</span>
        <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm font-medium mt-1`}>Chờ in</span>
      </div>
      
      <div className={`${theme === 'light' ? 'bg-white/80 border-gray-200 shadow-md text-gray-800' : 'bg-white/5 border-white/10 shadow-lg text-gray-50'} backdrop-blur-xl p-5 rounded-[1.5rem] flex flex-col items-center justify-center relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="bg-rose-500/20 p-3 rounded-2xl text-rose-500 dark:text-rose-300 mb-3 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          <Printer size={24} />
        </div>
        <span className="text-3xl font-bold">{stats.printing}</span>
        <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm font-medium mt-1`}>Đang in</span>
      </div>
      
      <div className={`${theme === 'light' ? 'bg-white/80 border-gray-200 shadow-md text-gray-800' : 'bg-white/5 border-white/10 shadow-lg text-gray-50'} backdrop-blur-xl p-5 rounded-[1.5rem] flex flex-col items-center justify-center relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-500 dark:text-emerald-300 mb-3 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <CheckCircle size={24} />
        </div>
        <span className="text-3xl font-bold">{orders.filter(o => o.status === STATUSES.COMPLETED).length}</span>
        <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm font-medium mt-1`}>Hoàn thành</span>
      </div>
      
      <div className={`${theme === 'light' ? 'bg-white/80 border-gray-200 shadow-md text-gray-800' : 'bg-white/5 border-white/10 shadow-lg text-gray-50'} backdrop-blur-xl p-5 rounded-[1.5rem] flex flex-col items-center justify-center relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="bg-purple-500/20 p-3 rounded-2xl text-purple-500 dark:text-purple-300 mb-3 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <Box size={24} />
        </div>
        <span className="text-3xl font-bold">{stats.totalOrders}</span>
        <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm font-medium mt-1`}>Tổng đơn</span>
      </div>
    </div>
  </div>
);

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
}) => (
  <div className="p-4 h-full flex flex-col animate-in fade-in duration-500">
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search size={18} className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'} />
      </div>
      <input
        type="text"
        className={`block w-full pl-11 pr-4 py-3.5 border ${theme === 'light' ? 'border-gray-200 bg-white/80 text-gray-900 placeholder-gray-400 focus:ring-rose-400' : 'border-white/10 bg-white/5 text-white placeholder-gray-400 focus:ring-rose-400/50'} rounded-2xl leading-5 backdrop-blur-lg focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm shadow-lg transition-all`}
        placeholder="Tìm tên khách, mã đơn..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    <div className="flex-1 overflow-y-auto space-y-4 pb-24 scrollbar-hide">
      {filteredOrders.length === 0 ? (
        <div className={`text-center ${theme === 'light' ? 'text-gray-500 bg-white/70 border-gray-200' : 'text-gray-400 bg-white/5 border-white/5'} mt-10 p-6 backdrop-blur-md rounded-2xl border`}>Không tìm thấy đơn hàng nào.</div>
      ) : (
        filteredOrders.map(order => (
          <div 
            key={order.id} 
            onClick={() => onOpenOrderModal(order)}
            className={`${theme === 'light' ? 'bg-white/80 border-gray-200 hover:bg-white text-gray-900' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-100'} backdrop-blur-xl p-5 rounded-[1.5rem] shadow-lg active:scale-[0.98] transition-all cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-600 dark:from-rose-300 dark:to-amber-200 tracking-wider">#{order.id}</span>
                  <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(order.date)}</span>
                </div>
                <h4 className="font-bold mt-1 text-lg">{order.itemName}</h4>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium shadow-sm ${STATUS_COLORS[order.status] || 'bg-gray-500/20 text-gray-300'}`}>
                {order.status}
              </span>
            </div>
            
            <div className={`text-sm mb-3 flex items-center flex-wrap gap-1 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-700' : 'bg-black/20 border-white/5 text-gray-300'} w-fit px-3 py-1.5 rounded-lg border`}>
              <Box size={14} className={`mr-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} /> 
              {order.materials && order.materials.length > 0 
                ? order.materials.map((m: any) => `${m.type} (${m.color})`).join(', ')
                : `${order.material || 'PLA'} • ${order.color || 'Mặc định'}`}
              <span className={`mx-2 font-black ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>•</span> SL: {order.quantity}
            </div>
            
            <div className={`flex justify-between items-end border-t ${theme === 'light' ? 'border-gray-100' : 'border-white/10'} pt-4 mt-2`}>
              <div className="text-sm">
                <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-xs block mb-0.5`}>Khách hàng</span>
                <span className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{order.customerName}</span>
              </div>
              <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-600 dark:from-rose-300 dark:via-orange-200 dark:to-amber-200 text-lg">
                {formatCurrency(order.price)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

interface InventoryTabProps {
  filaments: Filament[];
  theme: 'dark' | 'light';
  onOpenFilamentModal: (filament: Filament) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  filaments,
  theme,
  onOpenFilamentModal
}) => (
  <div className="p-4 h-full flex flex-col animate-in fade-in duration-500">
    <h2 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme === 'light' ? 'from-purple-600 via-pink-600 to-rose-600' : 'from-purple-300 via-pink-200 to-rose-200'} mb-6 px-2`}>Kho Nhựa</h2>
    
    <div className="flex-1 overflow-y-auto space-y-4 pb-24 scrollbar-hide">
      {filaments.length === 0 ? (
        <div className={`text-center ${theme === 'light' ? 'text-gray-500 bg-white/70 border-gray-200' : 'text-gray-400 bg-white/5 border-white/5'} mt-10 p-6 backdrop-blur-md rounded-2xl border`}>Chưa có cuộn nhựa nào trong kho.</div>
      ) : (
        filaments.map(item => {
          const currentWeight = item.weight ?? (item.percentage !== undefined ? item.percentage * 10 : 1000);
          return (
            <div 
              key={item.id} 
              onClick={() => onOpenFilamentModal(item)}
              className={`${theme === 'light' ? 'bg-white/80 border-gray-200 hover:bg-white text-gray-900' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-100'} backdrop-blur-xl p-4 rounded-[1.5rem] shadow-lg flex items-center gap-4 transition-all cursor-pointer group`}
            >
              <div className={`w-12 h-12 rounded-full border-2 ${theme === 'light' ? 'border-gray-200' : 'border-white/20'} shadow-inner flex-shrink-0 flex items-center justify-center`}
                   style={{ backgroundColor: item.colorHex }}>
                <div className="w-4 h-4 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: item.colorHex }}></div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold">{item.brand} • {item.type}</h4>
                <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-0.5`}>Màu: {item.colorName}</div>
              </div>
              
              <div className={`relative overflow-hidden ${theme === 'light' ? 'text-purple-700 bg-purple-50 border-purple-200' : 'text-purple-100 bg-black/40 border-purple-500/30'} px-3.5 py-2 rounded-xl text-sm font-bold border flex items-center gap-1.5 shadow-sm`}>
                <div 
                  className={`absolute bottom-0 left-0 right-0 ${theme === 'light' ? 'bg-purple-300/40' : 'bg-purple-500/40'} transition-all duration-500 ease-out z-0`} 
                  style={{ height: `${(currentWeight / 1000) * 100}%` }}
                ></div>
                <div className="relative z-10 flex items-center gap-1.5">
                   <Weight size={14} /> {currentWeight}g
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);

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
}) => (
  <div className="p-4 pb-28 animate-in fade-in duration-500">
    <div className={`flex p-1.5 ${theme === 'light' ? 'bg-gray-200/70 border-gray-300' : 'bg-white/5 border-white/10'} backdrop-blur-md rounded-2xl mb-6 shadow-inner border`}>
      <button 
        onClick={() => setAddMode('order')} 
        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${addMode === 'order' ? (theme === 'light' ? 'bg-white text-orange-600 shadow-md border border-orange-200' : 'bg-gradient-to-r from-rose-400/20 to-orange-400/20 text-orange-200 shadow-[0_0_15px_rgba(251,146,60,0.2)] border border-orange-400/30') : (theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-gray-200')}`}
      >
        Tạo Đơn Hàng
      </button>
      <button 
        onClick={() => setAddMode('filament')} 
        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${addMode === 'filament' ? (theme === 'light' ? 'bg-white text-purple-600 shadow-md border border-purple-200' : 'bg-gradient-to-r from-purple-400/20 to-pink-400/20 text-purple-200 shadow-[0_0_15px_rgba(192,132,252,0.2)] border border-purple-400/30') : (theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-gray-200')}`}
      >
        Nhập Kho Nhựa
      </button>
    </div>

    {addMode === 'order' ? (
      <form onSubmit={onAddOrder} className="space-y-5 animate-in slide-in-from-left-4">
        <div className={`${theme === 'light' ? 'bg-white/80 border-gray-200 text-gray-900 shadow-md' : 'bg-white/5 border-white/10 text-gray-100 shadow-lg'} backdrop-blur-xl p-5 rounded-[1.5rem] space-y-4 border`}>
          <h3 className={`font-semibold ${theme === 'light' ? 'text-rose-600 border-gray-200' : 'text-rose-200 border-white/10'} border-b pb-3 flex items-center`}>
            <div className="w-2 h-2 rounded-full bg-rose-400 mr-2 shadow-[0_0_8px_rgba(251,113,133,0.8)]"></div>
            Thông tin khách hàng
          </h3>
          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Tên khách hàng</label>
            <input required type="text" className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-black/20 border-white/10 text-white placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-orange-400/50 outline-none transition-all`} 
              value={newOrder.customerName} onChange={e => setNewOrder({ ...newOrder, customerName: e.target.value })} placeholder="Nhập tên..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Số điện thoại</label>
              <input required type="tel" inputMode="numeric" pattern="[0-9]*" className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-black/20 border-white/10 text-white placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-orange-400/50 outline-none transition-all`} 
                value={newOrder.phone} onChange={e => setNewOrder({ ...newOrder, phone: e.target.value })} placeholder="Nhập số điện thoại..." />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Địa chỉ</label>
              <input required type="text" className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-black/20 border-white/10 text-white placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-orange-400/50 outline-none transition-all`} 
                value={newOrder.address} onChange={e => setNewOrder({ ...newOrder, address: e.target.value })} placeholder="Nhập địa chỉ giao hàng..." />
            </div>
          </div>
        </div>

        <div className={`${theme === 'light' ? 'bg-white/80 border-gray-200 text-gray-900 shadow-md' : 'bg-white/5 border-white/10 text-gray-100 shadow-lg'} backdrop-blur-xl p-5 rounded-[1.5rem] space-y-4 border`}>
          <h3 className={`font-semibold ${theme === 'light' ? 'text-amber-600 border-gray-200' : 'text-amber-200 border-white/10'} border-b pb-3 flex items-center`}>
            <div className="w-2 h-2 rounded-full bg-amber-400 mr-2 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
            Chi tiết in 3D
          </h3>
          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Tên sản phẩm (Mẫu in)</label>
            <input required type="text" className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-black/20 border-white/10 text-white placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-orange-400/50 outline-none transition-all`} 
              value={newOrder.itemName} onChange={e => setNewOrder({ ...newOrder, itemName: e.target.value })} placeholder="Ví dụ: Mô hình Pokemon, Bánh răng..." />
          </div>
          
          <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-black/20 border-white/5'} p-4 rounded-xl border space-y-3`}>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-pink-600' : 'text-pink-200'} mb-2 flex items-center`}>
              <Palette size={16} className="mr-1.5" /> Chọn Nhựa & Màu Sắc
            </label>
            
            {newOrder.materials.map((mat: any, index: number) => (
              <div key={index} className={`flex flex-col gap-2 ${theme === 'light' ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/15'} p-3 rounded-lg border relative group`}>
                <div className="w-full pr-8">
                  <label className={`block text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Chọn từ kho nhựa</label>
                  <select className={`w-full p-2.5 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/30 border-white/10 text-white'} border rounded-lg focus:ring-2 focus:ring-orange-400/50 outline-none appearance-none text-sm transition-all`}
                    value={mat.inventoryId} onChange={e => onUpdateOrderMaterial(index, 'inventoryId', e.target.value)}>
                    <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="">-- Tùy chỉnh (Nhập thủ công) --</option>
                    {filaments.map(f => {
                      const currentWeight = f.weight ?? (f.percentage !== undefined ? f.percentage * 10 : 1000);
                      return (
                        <option key={f.id} className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value={f.id}>
                          {f.brand} {f.type} - {f.colorName} ({currentWeight}g)
                        </option>
                      );
                    })}
                  </select>
                </div>
                
                {!mat.inventoryId && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    <div>
                      <label className={`block text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Loại nhựa</label>
                      <input type="text" required className={`w-full p-2.5 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/30 border-white/10 text-white'} border rounded-lg focus:ring-2 focus:ring-orange-400/50 outline-none text-sm transition-all`} 
                        value={mat.type} onChange={e => onUpdateOrderMaterial(index, 'type', e.target.value)} placeholder="VD: PLA, Resin..." />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Tên màu</label>
                      <input type="text" required className={`w-full p-2.5 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/30 border-white/10 text-white'} border rounded-lg focus:ring-2 focus:ring-orange-400/50 outline-none text-sm transition-all`} 
                        value={mat.color} onChange={e => onUpdateOrderMaterial(index, 'color', e.target.value)} placeholder="Nhập màu..." />
                    </div>
                  </div>
                )}
                
                {newOrder.materials.length > 1 && (
                  <button type="button" onClick={() => onRemoveOrderMaterial(index)} className={`absolute right-3 top-3 ${theme === 'light' ? 'text-gray-400 hover:text-rose-600 bg-gray-100' : 'text-gray-500 hover:text-rose-400 bg-black/20'} p-1 rounded-md transition-colors border border-transparent`}>
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            
            <button type="button" onClick={onAddOrderMaterial} className={`w-full py-2.5 rounded-lg ${theme === 'light' ? 'bg-white border-gray-200 text-orange-600 hover:bg-orange-50' : 'bg-white/5 border-white/10 text-orange-200 hover:bg-orange-500/20'} transition-all font-medium text-sm flex items-center justify-center mt-2 shadow-sm border`}>
              <PlusCircle size={16} className="mr-2" /> Thêm loại nhựa khác
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Số lượng</label>
              <input required type="number" min="1" className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-orange-400/50 outline-none transition-all`} 
                value={newOrder.quantity} onChange={e => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) || 1 })} />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Thành tiền (VNĐ)</label>
              <input required type="number" min="0" className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-orange-400/50 outline-none transition-all`} 
                value={newOrder.price} onChange={e => setNewOrder({ ...newOrder, price: e.target.value })} placeholder="0" />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 text-gray-900 font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(251,146,60,0.4)] hover:shadow-[0_0_30px_rgba(251,146,60,0.6)] transition-all flex items-center justify-center transform active:scale-95 border border-white/40">
          <PlusCircle size={22} className="mr-2" />
          Tạo Đơn Hàng Mới
        </button>
      </form>
    ) : (
      <form onSubmit={onAddFilament} className="space-y-5 animate-in slide-in-from-right-4">
        <div className={`${theme === 'light' ? 'bg-white/80 border-gray-200 text-gray-900 shadow-md' : 'bg-white/5 border-white/10 text-gray-100 shadow-lg'} backdrop-blur-xl p-5 rounded-[1.5rem] space-y-5 border`}>
          <h3 className={`font-semibold ${theme === 'light' ? 'text-purple-600 border-gray-200' : 'text-purple-200 border-white/10'} border-b pb-3 flex items-center`}>
            <Database size={18} className="mr-2 text-purple-500 dark:text-purple-400" />
            Thông tin thẻ nhựa
          </h3>
          
          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Hãng sản xuất</label>
            <select
              className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-purple-400/50 outline-none appearance-none transition-all`}
              value={newFilament.brand}
              onChange={e => setNewFilament({ ...newFilament, brand: e.target.value })}
            >
              <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="Bambu Lab">Bambu Lab</option>
              <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="Tinmorry">Tinmorry</option>
              <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="eSun">eSun</option>
              <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="Stem">Stem</option>
              <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="Khác">Khác...</option>
            </select>
          </div>

          {newFilament.brand === 'Khác' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <input required type="text" placeholder="Nhập tên hãng..."
                className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-purple-400/50 outline-none transition-all`}
                value={newFilament.customBrand}
                onChange={e => setNewFilament({ ...newFilament, customBrand: e.target.value })}
              />
            </div>
          )}

          <div className={`grid grid-cols-1 gap-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/5'} pb-4`}>
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Loại nhựa</label>
              <select
                className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-purple-400/50 outline-none appearance-none transition-all`}
                value={newFilament.type}
                onChange={e => setNewFilament({ ...newFilament, type: e.target.value })}
              >
                <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="PLA Matte">PLA Matte</option>
                <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="PLA Basic">PLA Basic</option>
                <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="PLA Silk">PLA Silk</option>
                <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="PLA Lite">PLA Lite</option>
                <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="PETG Matte">PETG Matte</option>
                <option className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value="PETG Basic">PETG Basic</option>
              </select>
            </div>
          </div>

          <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-black/20 border-white/5'} p-4 rounded-xl border space-y-4`}>
            <h4 className={`text-sm font-medium ${theme === 'light' ? 'text-pink-600' : 'text-pink-200'} flex items-center`}>
              <Palette size={16} className="mr-1.5" /> Thêm màu sắc & số lượng
            </h4>
            
            <div>
              <label className={`block text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-1.5`}>1. Chọn màu hiển thị</label>
              <div className="flex flex-wrap gap-2.5">
                {BASIC_COLORS.map(color => (
                  <button
                    type="button"
                    key={color.hex}
                    onClick={() => setNewFilament({ ...newFilament, colorHex: color.hex, colorName: color.name })}
                    className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${newFilament.colorHex === color.hex ? 'border-gray-900 dark:border-white scale-110 shadow-[0_0_12px_rgba(0,0,0,0.3)]' : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
                <div className={`relative w-8 h-8 rounded-full border-2 border-dashed ${theme === 'light' ? 'border-gray-400' : 'border-white/30'} overflow-hidden flex items-center justify-center hover:opacity-100 transition-all opacity-80`}>
                  <input type="color" className="absolute inset-[-10px] w-12 h-12 cursor-pointer opacity-0"
                    value={newFilament.colorHex}
                    onChange={e => setNewFilament({ ...newFilament, colorHex: e.target.value })}
                  />
                  <div className="w-4 h-4 rounded-full pointer-events-none" style={{ backgroundColor: newFilament.colorHex }}></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-1.5`}>2. Tên màu thương mại</label>
                <div className="flex relative shadow-inner">
                  <div className={`w-10 h-[42px] rounded-l-xl border-y border-l ${theme === 'light' ? 'border-gray-200 bg-gray-100' : 'border-white/10 bg-black/20'} flex-shrink-0 overflow-hidden relative flex items-center justify-center`}>
                     <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: newFilament.colorHex, opacity: 0.9 }}></div>
                  </div>
                  <input 
                    type="text" required
                    className={`w-full h-[42px] p-2.5 ${theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-white/5 border-white/10 text-white'} border rounded-r-xl focus:ring-2 focus:ring-purple-400/50 outline-none text-sm transition-all`}
                    value={newFilament.colorName}
                    onChange={e => setNewFilament({ ...newFilament, colorName: e.target.value })}
                    placeholder="Nhập tên màu..."
                  />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-1.5`}>3. Số lượng</label>
                <select
                  className={`w-full h-[42px] p-2.5 ${theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-white/5 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-purple-400/50 outline-none appearance-none transition-all`}
                  value={newFilament.quantity}
                  onChange={e => setNewFilament({ ...newFilament, quantity: parseInt(e.target.value) || 1 })}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value={i+1}>{i + 1} cuộn</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              type="button" 
              onClick={onAddVariation}
              className={`w-full py-2.5 rounded-xl ${theme === 'light' ? 'bg-white border-gray-200 text-purple-700 hover:bg-purple-50' : 'bg-white/5 border-white/10 text-purple-200 hover:bg-purple-500/20'} border transition-all font-medium text-sm flex items-center justify-center`}
            >
              <PlusCircle size={16} className="mr-2" />
              Thêm loại này vào danh sách
            </button>
          </div>

          {pendingVariations.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Sẽ nhập ({pendingVariations.reduce((acc, curr) => acc + curr.quantity, 0)} cuộn):</label>
              {pendingVariations.map((v) => (
                <div key={v.id} className={`flex justify-between items-center ${theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-white/5 border-white/10 text-gray-200'} p-2.5 px-4 rounded-xl border animate-in fade-in slide-in-from-top-2`}>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full shadow-sm border border-white/20" style={{ backgroundColor: v.colorHex }}></div>
                    <span className="text-sm font-medium">{v.colorName}</span>
                    <span className={`text-xs font-bold ${theme === 'light' ? 'text-purple-700 bg-purple-100 border-purple-200' : 'text-purple-300 bg-purple-500/20 border-purple-500/30'} px-2 py-0.5 rounded-md border`}>x{v.quantity}</span>
                  </div>
                  <button type="button" onClick={() => onRemoveVariation(v.id)} className={`${theme === 'light' ? 'text-gray-400 hover:text-rose-600 bg-gray-100' : 'text-gray-500 hover:text-rose-400 bg-white/5'} p-1 rounded-lg transition-colors`}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-gray-900 font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(192,132,252,0.4)] hover:shadow-[0_0_30px_rgba(192,132,252,0.6)] transition-all flex items-center justify-center transform active:scale-95 border border-white/40">
          <CheckCircle size={22} className="mr-2" />
          Nhập {pendingVariations.length > 0 ? `${pendingVariations.reduce((acc, curr) => acc + curr.quantity, 0)} cuộn ` : ''}Vào Kho
        </button>
      </form>
    )}
  </div>
);
