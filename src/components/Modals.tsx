import React from 'react';
import { 
  X, 
  Trash2, 
  Save, 
  Database, 
  Settings, 
  LogOut, 
  RefreshCw 
} from 'lucide-react';
import { Order, Filament, UserInfo, STATUSES, formatCurrency, formatDate } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  order: Order | null;
  theme: 'dark' | 'light';
  showDeleteConfirm: boolean;
  onClose: () => void;
  onOpenDeleteConfirm: () => void;
  onCloseDeleteConfirm: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (status: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  order,
  theme,
  showDeleteConfirm,
  onClose,
  onOpenDeleteConfirm,
  onCloseDeleteConfirm,
  onDelete,
  onUpdateStatus
}) => {
  if (!isOpen || !order) return null;
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`w-full h-[90%] sm:h-auto sm:max-h-[85vh] sm:max-w-lg md:max-w-xl rounded-t-[2rem] sm:rounded-3xl border flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 backdrop-blur-2xl overflow-hidden relative ${
        isDark ? 'bg-zinc-900/95 border-white/10 text-zinc-100' : 'bg-white/95 border-zinc-200 text-zinc-900'
      }`}>
        {showDeleteConfirm && (
          <div className={`absolute inset-0 z-50 ${isDark ? 'bg-zinc-900/98 text-gray-100' : 'bg-white/98 text-gray-900'} backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-200 rounded-t-[2rem] sm:rounded-3xl`}>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <Trash2 size={32} className="text-red-400" />
            </div>
            <h4 className="text-xl font-bold mb-2">Xóa đơn hàng?</h4>
            <p className={`text-center mb-8 text-sm px-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Bạn có chắc chắn muốn xóa đơn hàng <span className="text-rose-500 dark:text-rose-300 font-bold">#{order.id}</span> không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={onCloseDeleteConfirm}
                className={`flex-1 py-3 rounded-xl border ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300' : 'border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium transition-colors cursor-pointer`}
              >
                Quay lại
              </button>
              <button 
                onClick={() => onDelete(order.id)}
                className="flex-1 py-3 rounded-xl border border-red-500/30 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold transition-colors shadow-sm cursor-pointer"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center p-5 border-b border-inherit z-10">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span>Đơn #{order.id}</span>
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenDeleteConfirm} 
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors border border-red-500/20 cursor-pointer"
              title="Xóa đơn hàng"
            >
              <Trash2 size={16} />
            </button>
            <button onClick={onClose} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-inherit cursor-pointer">
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5 z-10 scrollbar-hide">
          <div>
            <label className="text-[11px] text-orange-500 font-medium uppercase tracking-wider block mb-1">
              Ngày tạo: {formatDate(order.date)}
            </label>
            <div className="text-xl font-bold">{order.itemName}</div>
            <div className="text-xs opacity-60 mt-1.5 flex flex-wrap gap-2 items-center">
              {order.materials ? (
                order.materials.map((m, i) => (
                  <span key={i} className="bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-inherit flex items-center gap-1">
                    <span>{m.type}</span>
                    <span>({m.color})</span>
                  </span>
                ))
              ) : (
                <span className="bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-inherit">
                  {order.material || 'PLA'} ({order.color || 'Mặc định'})
                </span>
              )}
              <span className="bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-inherit">
                Số lượng: <strong className="ml-1">{order.quantity}</strong>
              </span>
            </div>
          </div>

          {/* Customer Info Card */}
          <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-inherit space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider opacity-60">Thông tin khách hàng</h4>
            <div className="flex items-center justify-between text-xs">
              <span className="opacity-60">Tên khách:</span>
              <span className="font-semibold">{order.customerName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="opacity-60">Số điện thoại:</span>
              <a href={`tel:${order.phone}`} className="font-semibold text-orange-500 hover:underline">
                {order.phone}
              </a>
            </div>
            {order.address && (
              <div className="flex items-start justify-between text-xs pt-1 border-t border-inherit">
                <span className="opacity-60 flex-shrink-0 mr-2">Địa chỉ:</span>
                <span className="font-medium text-right">{order.address}</span>
              </div>
            )}
          </div>

          {/* Pricing Box */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
            <span className="text-xs font-semibold">Tổng tiền thanh toán</span>
            <span className="text-xl font-black text-orange-500">
              {formatCurrency(order.price)}
            </span>
          </div>

          {/* Status Change Strip */}
          <div>
            <label className="text-xs font-semibold opacity-60 uppercase tracking-wider block mb-2">
              Cập nhật trạng thái
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { status: STATUSES.PENDING, label: 'Chờ in', color: 'hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-400' },
                { status: STATUSES.PRINTING, label: 'Đang in', color: 'hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400' },
                { status: STATUSES.COMPLETED, label: 'Hoàn thành', color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400' },
                { status: STATUSES.CANCELLED, label: 'Đã hủy', color: 'hover:border-red-500/50 hover:bg-red-500/10 text-red-400' },
              ].map((s) => {
                const isCurrent = order.status === s.status;
                return (
                  <button
                    key={s.status}
                    onClick={() => onUpdateStatus(s.status)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isCurrent 
                        ? 'border-orange-500 bg-orange-500/20 text-orange-500 font-bold' 
                        : `border-inherit bg-black/5 dark:bg-white/5 opacity-70 ${s.color}`
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FilamentModalProps {
  isOpen: boolean;
  editingFilament: any;
  theme: 'dark' | 'light';
  onClose: () => void;
  onEditChange: (updated: any) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const FilamentModal: React.FC<FilamentModalProps> = ({
  isOpen,
  editingFilament,
  theme,
  onClose,
  onEditChange,
  onSave,
  onDelete
}) => {
  if (!isOpen || !editingFilament) return null;
  const isDark = theme === 'dark';

  const availableBrands = Array.from(new Set([...["Bambu Lab", "Tinmorry", "eSun", "Stem"], editingFilament.brand]));
  const availableTypes = Array.from(new Set([...["PLA Matte", "PLA Basic", "PLA Silk", "PLA Lite", "PETG Matte", "PETG Basic"], editingFilament.type]));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`w-full sm:max-w-lg md:max-w-xl rounded-t-[2rem] sm:rounded-3xl border flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 max-h-[90%] pb-safe backdrop-blur-2xl overflow-hidden relative ${
        isDark ? 'bg-zinc-900/95 border-white/10 text-zinc-100' : 'bg-white/95 border-zinc-200 text-zinc-900'
      }`}>
        <div className="flex justify-between items-center p-5 border-b border-inherit z-10">
          <h3 className="font-bold text-lg flex items-center">
            <Database size={18} className="mr-2 text-purple-500" />
            Chỉnh sửa cuộn nhựa
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-inherit cursor-pointer">
            <X size={16} />
          </button>
        </div>
        
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5 z-10 scrollbar-hide">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-semibold opacity-70 block mb-1">Hãng</label>
              <select
                className="w-full p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 outline-none text-xs sm:text-sm"
                value={editingFilament.brand}
                onChange={(e) => onEditChange({ ...editingFilament, brand: e.target.value })}
              >
                {availableBrands.map(b => (
                  <option key={b} value={b} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold opacity-70 block mb-1">Loại Nhựa</label>
              <select
                className="w-full p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 outline-none text-xs sm:text-sm"
                value={editingFilament.type}
                onChange={(e) => onEditChange({ ...editingFilament, type: e.target.value })}
              >
                {availableTypes.map(t => (
                  <option key={t} value={t} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold opacity-70 block mb-1">Tên Màu</label>
            <input
              type="text"
              className="w-full p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 outline-none text-xs sm:text-sm"
              value={editingFilament.colorName}
              onChange={(e) => onEditChange({ ...editingFilament, colorName: e.target.value })}
              placeholder="VD: Trắng, Đỏ..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold opacity-70 block mb-1">Mã Màu (HEX)</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="w-10 h-10 rounded-xl cursor-pointer border border-inherit bg-transparent p-1"
                value={editingFilament.colorHex}
                onChange={(e) => onEditChange({ ...editingFilament, colorHex: e.target.value })}
              />
              <input
                type="text"
                className="flex-1 p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 outline-none font-mono text-xs sm:text-sm"
                value={editingFilament.colorHex}
                onChange={(e) => onEditChange({ ...editingFilament, colorHex: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold opacity-70">Khối Lượng Còn Lại (g)</label>
              <span className="text-xs font-bold text-purple-500">
                {editingFilament.weight ?? (editingFilament.percentage !== undefined ? editingFilament.percentage * 10 : 1000)}g
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-purple-500 cursor-pointer"
              value={editingFilament.weight ?? (editingFilament.percentage !== undefined ? editingFilament.percentage * 10 : 1000)}
              onChange={(e) => {
                const grams = parseInt(e.target.value);
                onEditChange({ 
                  ...editingFilament, 
                  weight: grams,
                  percentage: Math.round(grams / 10)
                });
              }}
            />
            <div className="flex justify-between text-[10px] opacity-50 mt-1">
              <span>0g (Hết)</span>
              <span>500g (Nửa cuộn)</span>
              <span>1000g (Đầy)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-inherit grid grid-cols-2 gap-3">
            <button onClick={onDelete} className="py-2.5 rounded-xl border border-red-500/20 text-red-500 bg-red-500/10 hover:bg-red-500/20 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer">
              <Trash2 size={15} className="mr-1.5" /> Xóa Khỏi Kho
            </button>
            <button onClick={onSave} className="py-2.5 rounded-xl text-white bg-purple-600 hover:bg-purple-700 font-bold text-xs flex items-center justify-center transition-all shadow-sm cursor-pointer">
              <Save size={15} className="mr-1.5" /> Lưu Lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SettingModalProps {
  isOpen: boolean;
  theme: 'dark' | 'light';
  user: UserInfo | null;
  gasUrl: string;
  tempGasUrl?: string;
  tempClientId?: string;
  syncStatus: string;
  syncMessage: string;
  onClose: () => void;
  onSetTheme: (theme: 'dark' | 'light') => void;
  onTempGasUrlChange?: (val: string) => void;
  onTempClientIdChange?: (val: string) => void;
  onSave?: () => void;
  onLogout: () => void;
  onPushToSheet: () => void;
}

export const SettingModal: React.FC<SettingModalProps> = ({
  isOpen,
  theme,
  user,
  gasUrl,
  syncStatus,
  onClose,
  onLogout,
  onPushToSheet
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl border shadow-2xl animate-in slide-in-from-bottom-6 backdrop-blur-2xl overflow-hidden relative ${
        isDark ? 'bg-zinc-900/95 border-white/10 text-zinc-100' : 'bg-white/95 border-zinc-200 text-zinc-900'
      }`}>
        {/* User Profile Header */}
        <div className="p-4 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {user?.picture ? (
              <img src={user.picture} alt="Avatar" className="w-9 h-9 rounded-full border border-inherit object-cover flex-shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-bold text-sm truncate leading-tight">{user?.name || 'Người dùng'}</div>
              <div className="text-[11px] opacity-60 truncate">{user?.email}</div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Flat Actions List */}
        <div className="p-2 space-y-1">
          {/* Sync Option */}
          {gasUrl && (
            <button
              type="button"
              onClick={onPushToSheet}
              disabled={syncStatus === 'syncing'}
              className="w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw size={15} className={`text-orange-500 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <div>
                  <div className="text-xs font-semibold">Đồng bộ Google Sheets</div>
                  <div className="text-[10px] opacity-60">
                    {syncStatus === 'syncing' ? 'Đang lưu lên Cloud...' : 'Đã kết nối Online'}
                  </div>
                </div>
              </div>
              <span className={`w-2 h-2 rounded-full ${syncStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            </button>
          )}

          {/* Logout Option */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full px-3 py-2.5 rounded-xl text-left flex items-center gap-2.5 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span className="text-xs font-semibold">Đăng xuất tài khoản</span>
          </button>
        </div>
      </div>
    </div>
  );
};
