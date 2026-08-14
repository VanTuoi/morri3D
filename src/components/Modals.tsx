import React from 'react';
import { 
  X, 
  Trash2, 
  Save, 
  Database, 
  Weight, 
  Settings, 
  Key, 
  Loader2, 
  CloudCheck, 
  CloudAlert, 
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

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative ${theme === 'light' ? 'bg-white/90 text-gray-900 border-gray-200' : 'bg-[#1c1c1e]/80 text-gray-100 border-white/10'} backdrop-blur-2xl w-full h-[85%] sm:h-auto sm:max-h-[90%] sm:w-[400px] sm:rounded-[2rem] rounded-t-[2.5rem] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 border overflow-hidden`}>
        {showDeleteConfirm && (
          <div className={`absolute inset-0 z-50 ${theme === 'light' ? 'bg-white/95 text-gray-900' : 'bg-[#1c1c1e]/95 text-gray-100'} backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-200 rounded-t-[2.5rem] sm:rounded-[2rem]`}>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <Trash2 size={32} className="text-red-400" />
            </div>
            <h4 className="text-xl font-bold mb-2">Xóa đơn hàng?</h4>
            <p className={`text-center mb-8 text-sm px-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
              Bạn có chắc chắn muốn xóa đơn hàng <span className="text-rose-500 dark:text-rose-300 font-bold">#{order.id}</span> không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={onCloseDeleteConfirm}
                className={`flex-1 py-3.5 rounded-xl border ${theme === 'light' ? 'border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-700' : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300'} font-medium transition-colors`}
              >
                Quay lại
              </button>
              <button 
                onClick={() => onDelete(order.id)}
                className="flex-1 py-3.5 rounded-xl border border-red-500/30 bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-300 font-bold transition-colors shadow-sm"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        )}

        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        <div className={`flex justify-between items-center p-5 border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'} z-10`}>
          <h3 className="font-bold text-xl flex items-center gap-2">
            <span>Đơn #{order.id}</span>
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenDeleteConfirm} 
              className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 transition-colors border border-red-500/20"
              title="Xóa đơn hàng"
            >
              <Trash2 size={20} />
            </button>
            <button onClick={onClose} className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200' : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/5'} transition-colors border`}>
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-6 z-10 scrollbar-hide">
          <div>
            <label className="text-xs text-rose-600 dark:text-rose-300/80 font-medium uppercase tracking-wider block mb-1">
              Ngày tạo: {formatDate(order.date)}
            </label>
            <div className="text-2xl font-bold">{order.itemName}</div>
            <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-2 flex flex-wrap gap-2 items-center`}>
              {order.materials ? (
                order.materials.map((m, i) => (
                  <span key={i} className={`${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-800' : 'bg-white/5 border-white/5 text-gray-200'} px-3 py-1.5 rounded-lg border flex items-center`}>
                    <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 mr-2"></div>
                    {m.type} <span className={`mx-1 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>|</span> {m.color}
                  </span>
                ))
              ) : (
                <span className={`${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-white/5 border-white/5'} px-3 py-1.5 rounded-lg border`}>
                  {order.material || 'PLA'} <span className={`mx-1 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>|</span> {order.color || 'Mặc định'}
                </span>
              )}
              <span className="bg-orange-500/10 text-orange-600 dark:text-orange-200 px-3 py-1.5 rounded-lg border border-orange-500/20 font-bold shadow-sm">
                SL: {order.quantity}
              </span>
            </div>
          </div>
          
          <div className={`grid grid-cols-2 gap-4 ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-black/20 border-white/5'} p-4 rounded-2xl border shadow-inner`}>
            <div className="col-span-2 sm:col-span-1">
              <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} font-medium mb-1 block`}>Khách hàng</label>
              <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{order.customerName}</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} font-medium mb-1 block`}>Điện thoại</label>
              <div className="font-medium text-orange-600 dark:text-orange-300">{order.phone || 'Trống'}</div>
            </div>
            <div className={`col-span-2 border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/5'} pt-3 mt-1`}>
              <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} font-medium mb-1 block`}>Địa chỉ giao hàng</label>
              <div className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} text-sm`}>{order.address || 'Không có thông tin địa chỉ'}</div>
            </div>
            <div className={`col-span-2 pt-2 border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/5'} mt-1`}>
              <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} font-medium mb-1 block`}>Tổng tiền</label>
              <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-600 dark:from-rose-300 dark:via-orange-300 dark:to-amber-200 text-xl">
                {formatCurrency(order.price)}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium block mb-3 flex items-center`}>
              Cập nhật trạng thái
              <div className={`ml-2 h-px flex-1 bg-gradient-to-r ${theme === 'light' ? 'from-gray-200' : 'from-white/10'} to-transparent`}></div>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(STATUSES).map((status) => {
                const isActive = order.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => onUpdateStatus(status)}
                    className={`py-3 px-3 text-sm font-medium rounded-xl border flex items-center justify-center transition-all ${
                      isActive 
                        ? 'border-orange-400/50 bg-gradient-to-br from-rose-500/20 to-orange-500/20 text-orange-600 dark:text-orange-200 shadow-[0_0_15px_rgba(251,146,60,0.15)] font-bold'
                        : `${theme === 'light' ? 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`
                    }`}
                  >
                    {status}
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

  const availableBrands = Array.from(new Set([...["Bambu Lab", "Tinmorry", "eSun", "Stem"], editingFilament.brand]));
  const availableTypes = Array.from(new Set([...["PLA Matte", "PLA Basic", "PLA Silk", "PLA Lite", "PETG Matte", "PETG Basic"], editingFilament.type]));

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative ${theme === 'light' ? 'bg-white/90 text-gray-900 border-gray-200' : 'bg-[#1c1c1e]/80 text-gray-100 border-white/10'} backdrop-blur-2xl w-full sm:max-w-[400px] sm:rounded-[2rem] rounded-t-[2.5rem] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 border overflow-hidden max-h-[90%] pb-safe`}>
        <div className={`flex justify-between items-center p-5 border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'} z-10`}>
          <h3 className="font-bold text-xl flex items-center">
            <Database size={20} className="mr-2 text-purple-500 dark:text-purple-400" />
            Chỉnh sửa cuộn nhựa
          </h3>
          <button onClick={onClose} className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200' : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/5'} transition-colors border`}>
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-5 z-10 scrollbar-hide pb-8">
          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-1.5`}>Hãng sản xuất</label>
            <select 
              className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-purple-400/50 outline-none appearance-none transition-all`}
              value={editingFilament.brand}
              onChange={e => onEditChange({ ...editingFilament, brand: e.target.value })}
            >
              {availableBrands.map(b => (
                <option key={b} value={b} className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-1.5`}>Loại nhựa</label>
            <select 
              className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-purple-400/50 outline-none appearance-none transition-all`}
              value={editingFilament.type}
              onChange={e => onEditChange({ ...editingFilament, type: e.target.value })}
            >
              {availableTypes.map(t => (
                <option key={t} value={t} className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-1.5`}>Mã màu</label>
              <div className={`relative w-full h-[46px] rounded-xl border ${theme === 'light' ? 'border-gray-200 bg-gray-100' : 'border-white/10 bg-black/20'} overflow-hidden flex items-center pl-3`}>
                <input 
                  type="color" 
                  className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] cursor-pointer opacity-0"
                  value={editingFilament.colorHex}
                  onChange={e => onEditChange({ ...editingFilament, colorHex: e.target.value })}
                />
                <div className="w-6 h-6 rounded-md border border-white/20 shadow-sm pointer-events-none" style={{ backgroundColor: editingFilament.colorHex }}></div>
                <span className={`ml-2 text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-mono pointer-events-none w-16 truncate`}>{editingFilament.colorHex}</span>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-1.5`}>Tên màu</label>
              <input 
                type="text" 
                className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-purple-400/50 outline-none transition-all`}
                value={editingFilament.colorName}
                onChange={e => onEditChange({ ...editingFilament, colorName: e.target.value })}
              />
            </div>
          </div>

          <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'} p-4 rounded-xl border`}>
            <label className="flex justify-between items-center mb-4">
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} flex items-center`}>
                <Weight size={16} className="mr-2 text-purple-500 dark:text-purple-400" /> Trọng lượng còn lại
              </span>
              <span className="text-xl font-black text-purple-600 dark:text-purple-300">{editingFilament.weight}g</span>
            </label>
            <input 
              type="range" min="0" max="1000" step="10"
              className="w-full h-2 bg-black/20 dark:bg-black/40 rounded-lg appearance-none cursor-pointer accent-purple-500 dark:accent-purple-400"
              value={editingFilament.weight}
              onChange={e => onEditChange({ ...editingFilament, weight: parseInt(e.target.value) || 0 })}
            />
            <div className={`flex justify-between text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} mt-2 font-medium`}>
              <span>0g (Hết)</span>
              <span>500g</span>
              <span>1000g (Đầy)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={onDelete} className="py-3.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 font-bold flex items-center justify-center transition-colors">
              <Trash2 size={18} className="mr-2" /> Xóa Khỏi Kho
            </button>
            <button onClick={onSave} className="py-3.5 rounded-xl border border-purple-500/30 text-white dark:text-purple-900 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 hover:shadow-[0_0_20px_rgba(192,132,252,0.4)] font-bold flex items-center justify-center transition-all">
              <Save size={18} className="mr-2" /> Lưu Lại
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
  tempGasUrl: string;
  tempClientId: string;
  syncStatus: string;
  syncMessage: string;
  onClose: () => void;
  onSetTheme: (theme: 'dark' | 'light') => void;
  onTempGasUrlChange: (val: string) => void;
  onTempClientIdChange: (val: string) => void;
  onSave: () => void;
  onLogout: () => void;
  onPushToSheet: () => void;
}

export const SettingModal: React.FC<SettingModalProps> = ({
  isOpen,
  theme,
  user,
  gasUrl,
  tempGasUrl,
  tempClientId,
  syncStatus,
  syncMessage,
  onClose,
  onSetTheme,
  onTempGasUrlChange,
  onTempClientIdChange,
  onSave,
  onLogout,
  onPushToSheet
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative ${theme === 'light' ? 'bg-white text-gray-900 border-gray-200' : 'bg-[#1c1c1e] text-gray-100 border-white/10'} backdrop-blur-2xl w-full sm:max-w-[440px] sm:rounded-[2rem] rounded-t-[2.5rem] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 border overflow-hidden`}>
        <div className={`flex justify-between items-center p-5 border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Settings size={20} className="text-orange-500" />
            <span>Cài đặt & Tài khoản</span>
          </h3>
          <button onClick={onClose} className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-white/5 hover:bg-white/10 text-gray-300'} transition-colors`}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {user && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img src={user.picture} alt="Avatar" className="w-10 h-10 rounded-full border border-white/30" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <div className="font-bold text-sm">{user.name}</div>
                  <div className="text-[11px] opacity-70 truncate max-w-[170px]">{user.email}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={14} />
                Đăng xuất
              </button>
            </div>
          )}

          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Giao diện</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onSetTheme('light')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-medium text-sm transition-all ${
                  theme === 'light' ? 'bg-orange-50 border-orange-400 text-orange-700 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                ☀️ Giao diện Sáng
              </button>
              <button
                type="button"
                onClick={() => onSetTheme('dark')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-medium text-sm transition-all ${
                  theme === 'dark' ? 'bg-orange-500/20 border-orange-400/50 text-orange-200 shadow-sm' : 'bg-gray-100 border-gray-200 text-gray-600'
                }`}
              >
                🌙 Giao diện Tối
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={`block text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                Google Apps Script Web App URL
              </label>
              <span className="text-[11px] text-purple-500 font-medium">Database Online</span>
            </div>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={tempGasUrl}
              onChange={(e) => onTempGasUrlChange(e.target.value)}
              className={`w-full p-3.5 text-xs font-mono border rounded-xl outline-none focus:ring-2 focus:ring-purple-400 transition-all ${
                theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-black/30 border-white/10 text-white placeholder-gray-500'
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className={`block text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} flex items-center gap-1.5`}>
              <Key size={14} className="text-orange-500" />
              Google OAuth Client ID (Tùy chọn)
            </label>
            <input
              type="text"
              placeholder="VD: 123456789-abc.apps.googleusercontent.com"
              value={tempClientId}
              onChange={(e) => onTempClientIdChange(e.target.value)}
              className={`w-full p-3 text-xs font-mono border rounded-xl outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
                theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-black/30 border-white/10 text-white placeholder-gray-500'
              }`}
            />
          </div>

          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            gasUrl 
              ? (theme === 'light' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300')
              : (theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-600' : 'bg-white/5 border-white/10 text-gray-400')
          }`}>
            {syncStatus === 'syncing' ? (
              <Loader2 size={20} className="animate-spin text-orange-400 flex-shrink-0" />
            ) : gasUrl ? (
              <CloudCheck size={20} className="text-emerald-400 flex-shrink-0" />
            ) : (
              <CloudAlert size={20} className="text-gray-400 flex-shrink-0" />
            )}
            <div className="text-xs">
              <div className="font-semibold">{gasUrl ? 'Đã liên kết Google Sheet' : 'Đang ở chế độ Local (Offline)'}</div>
              <div className="opacity-80 text-[11px] mt-0.5">{syncMessage || 'Dữ liệu được lưu trữ an toàn trên thiết bị này.'}</div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={onSave}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Save size={18} />
              Lưu Cấu Hình
            </button>

            {gasUrl && (
              <button
                type="button"
                onClick={onPushToSheet}
                className={`w-full py-3 rounded-xl border font-medium text-xs flex items-center justify-center gap-2 transition-all ${
                  theme === 'light' ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <RefreshCw size={14} />
                Đẩy toàn bộ dữ liệu hiện tại lên Google Sheet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
