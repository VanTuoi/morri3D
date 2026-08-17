import React, { useState, useEffect } from 'react'
import {
  X,
  Trash2,
  Save,
  Database,
  LogOut,
  RefreshCw,
  Sun,
  Moon,
  Edit3,
  Plus,
  Layers,
  User,
  Phone,
  MapPin,
  FileText
} from 'lucide-react'
import type { Order, OrderMaterial, Filament, UserInfo } from '~/types'
import { STATUSES, formatCurrency, formatDateTime } from '~/types'
import { FilamentSelect } from './ui'

interface OrderModalProps {
  isOpen: boolean
  order: Order | null
  filaments?: Filament[]
  theme: 'dark' | 'light'
  showDeleteConfirm: boolean
  onClose: () => void
  onOpenDeleteConfirm: () => void
  onCloseDeleteConfirm: () => void
  onDelete: (id: string) => void
  onUpdateStatus: (status: string) => void
  onSaveOrder?: (updated: Order) => void
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  order,
  filaments = [],
  theme,
  showDeleteConfirm,
  onClose,
  onOpenDeleteConfirm,
  onCloseDeleteConfirm,
  onDelete,
  onUpdateStatus,
  onSaveOrder
}) => {
  const isDark = theme === 'dark'

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Order | null>(order)

  useEffect(() => {
    if (order) {
      setFormData({
        ...order,
        materials:
          order.materials && order.materials.length > 0
            ? order.materials
            : [{ inventoryId: '', type: order.material || 'PLA', color: order.color || 'Mặc định' }]
      })
      setIsEditing(false)
    }
  }, [order, isOpen])

  if (!isOpen || !order || !formData) return null

  const handleFieldChange = (field: keyof Order, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleMaterialChange = (index: number, field: keyof OrderMaterial, value: string) => {
    if (!formData) return
    const updated = [...(formData.materials || [])]
    updated[index] = { ...updated[index], [field]: value }

    if (field === 'inventoryId' && value) {
      const fil = filaments.find((f) => f.id === value)
      if (fil) {
        updated[index].type = `${fil.brand} ${fil.type}`
        updated[index].color = fil.colorName
      }
    }
    setFormData((prev) => (prev ? { ...prev, materials: updated } : prev))
  }

  const handleAddMaterial = () => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            materials: [...(prev.materials || []), { inventoryId: '', type: '', color: '' }]
          }
        : prev
    )
  }

  const handleRemoveMaterial = (index: number) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            materials: (prev.materials || []).filter((_, i) => i !== index)
          }
        : prev
    )
  }

  const handleSave = () => {
    if (!formData || !formData.customerName?.trim() || !formData.itemName?.trim()) return
    onSaveOrder?.(formData)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setFormData(order)
    setIsEditing(false)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />

      <div
        className={`w-full h-[92%] sm:h-auto sm:max-h-[85vh] sm:max-w-lg md:max-w-xl rounded-t-[2rem] sm:rounded-3xl border flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 backdrop-blur-2xl overflow-hidden relative ${
          isDark ? 'bg-zinc-900/95 border-white/10 text-zinc-100' : 'bg-white/95 border-zinc-200 text-zinc-900'
        }`}
      >
        {showDeleteConfirm && (
          <div
            className={`absolute inset-0 z-50 ${isDark ? 'bg-zinc-900/98 text-gray-100' : 'bg-white/98 text-gray-900'} backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-200 rounded-t-[2rem] sm:rounded-3xl`}
          >
            <div className='w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]'>
              <Trash2 size={32} className='text-red-400' />
            </div>
            <h4 className='text-xl font-bold mb-2'>Xóa đơn hàng?</h4>
            <p className={`text-center mb-8 text-sm px-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Bạn có chắc chắn muốn xóa đơn hàng{' '}
              <span className='text-rose-500 dark:text-rose-300 font-bold'>#{order.id}</span> không? Hành động này không
              thể hoàn tác.
            </p>
            <div className='flex gap-3 w-full'>
              <button
                onClick={onCloseDeleteConfirm}
                className={`flex-1 py-3 rounded-xl border ${isDark ? 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300' : 'border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-700'} font-medium transition-colors cursor-pointer`}
              >
                Quay lại
              </button>
              <button
                onClick={() => onDelete(order.id)}
                className='flex-1 py-3 rounded-xl border border-red-500/30 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold transition-colors shadow-sm cursor-pointer'
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        )}

        <div className='flex justify-between items-center p-4 sm:p-5 border-b border-inherit z-10'>
          <div className='flex items-center gap-2'>
            <h3 className='font-bold text-base sm:text-lg flex items-center gap-2'>
              <span className='font-mono text-orange-500 font-black'>#{order.id}</span>
              <span className='text-xs opacity-60 font-normal hidden sm:inline'>• {formatDateTime(order.date)}</span>
            </h3>
            {isEditing && (
              <span className='text-[10px] px-2 py-0.5 rounded-full font-bold bg-orange-500/15 text-orange-500 border border-orange-500/25'>
                Đang chỉnh sửa
              </span>
            )}
          </div>

          <div className='flex items-center gap-1.5 sm:gap-2'>
            {isEditing ? (
              <>
                <button
                  type='button'
                  onClick={handleCancelEdit}
                  className='px-3 py-1.5 rounded-xl border border-inherit text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer'
                >
                  Hủy
                </button>
                <button
                  type='button'
                  onClick={handleSave}
                  className='px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5'
                >
                  <Save size={14} />
                  <span>Lưu</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type='button'
                  onClick={() => setIsEditing(true)}
                  className='px-2.5 sm:px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 transition-colors border border-orange-500/20 cursor-pointer flex items-center gap-1.5 text-xs font-bold'
                  title='Chỉnh sửa thông tin đơn hàng'
                >
                  <Edit3 size={14} />
                  <span className='hidden sm:inline'>Sửa</span>
                </button>
                <button
                  type='button'
                  onClick={onOpenDeleteConfirm}
                  className='p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors border border-red-500/20 cursor-pointer'
                  title='Xóa đơn hàng'
                >
                  <Trash2 size={15} />
                </button>
                <button
                  type='button'
                  onClick={onClose}
                  className='p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-inherit cursor-pointer'
                >
                  <X size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className='p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 sm:space-y-5 z-10 scrollbar-hide'>
          {isEditing ? (
            /* ===== EDIT FORM MODE ===== */
            <div className='space-y-3.5 sm:space-y-4 text-xs'>
              <div>
                <label className='block font-semibold opacity-70 mb-1'>Tên mẫu in 3D *</label>
                <input
                  type='text'
                  value={formData.itemName}
                  onChange={(e) => handleFieldChange('itemName', e.target.value)}
                  className={`w-full h-9 px-3 text-xs rounded-xl border outline-none font-bold transition-all ${
                    isDark
                      ? 'bg-zinc-800/80 border-white/10 text-zinc-100 focus:border-orange-500/60'
                      : 'bg-white border-zinc-200 text-zinc-900 focus:border-orange-500'
                  }`}
                  placeholder='VD: Mô hình Rồng Thần, Giá đỡ điện thoại...'
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
                <div>
                  <label className='block font-semibold opacity-70 mb-1'>Tên khách hàng *</label>
                  <input
                    type='text'
                    value={formData.customerName}
                    onChange={(e) => handleFieldChange('customerName', e.target.value)}
                    className={`w-full h-9 px-3 text-xs rounded-xl border outline-none font-medium transition-all ${
                      isDark
                        ? 'bg-zinc-800/80 border-white/10 text-zinc-100 focus:border-orange-500/60'
                        : 'bg-white border-zinc-200 text-zinc-900 focus:border-orange-500'
                    }`}
                  />
                </div>
                <div>
                  <label className='block font-semibold opacity-70 mb-1'>Số điện thoại *</label>
                  <input
                    type='text'
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className={`w-full h-9 px-3 text-xs rounded-xl border outline-none font-medium transition-all ${
                      isDark
                        ? 'bg-zinc-800/80 border-white/10 text-zinc-100 focus:border-orange-500/60'
                        : 'bg-white border-zinc-200 text-zinc-900 focus:border-orange-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className='block font-semibold opacity-70 mb-1'>Địa chỉ nhận hàng</label>
                <input
                  type='text'
                  value={formData.address || ''}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className={`w-full h-9 px-3 text-xs rounded-xl border outline-none transition-all ${
                    isDark
                      ? 'bg-zinc-800/80 border-white/10 text-zinc-100 focus:border-orange-500/60'
                      : 'bg-white border-zinc-200 text-zinc-900 focus:border-orange-500'
                  }`}
                  placeholder='Địa chỉ giao hàng (nếu có)'
                />
              </div>

              <div className='grid grid-cols-2 gap-2.5'>
                <div>
                  <label className='block font-semibold opacity-70 mb-1'>Số lượng *</label>
                  <input
                    type='number'
                    min='1'
                    value={formData.quantity}
                    onChange={(e) => handleFieldChange('quantity', parseInt(e.target.value) || 1)}
                    className={`w-full h-9 px-3 text-xs rounded-xl border outline-none font-bold transition-all ${
                      isDark
                        ? 'bg-zinc-800/80 border-white/10 text-zinc-100 focus:border-orange-500/60'
                        : 'bg-white border-zinc-200 text-zinc-900 focus:border-orange-500'
                    }`}
                  />
                </div>
                <div>
                  <label className='block font-semibold opacity-70 mb-1'>Thành tiền (VNĐ) *</label>
                  <input
                    type='number'
                    min='0'
                    value={formData.price}
                    onChange={(e) => handleFieldChange('price', parseInt(e.target.value) || 0)}
                    className={`w-full h-9 px-3 text-xs rounded-xl border outline-none font-black text-orange-500 transition-all ${
                      isDark
                        ? 'bg-zinc-800/80 border-white/10 focus:border-orange-500/60'
                        : 'bg-white border-zinc-200 focus:border-orange-500'
                    }`}
                  />
                </div>
              </div>

              <div className='space-y-2.5 pt-1 border-t border-inherit/40'>
                <div className='flex items-center justify-between'>
                  <label className='font-semibold opacity-70 text-xs'>Vật liệu / Nhựa in</label>
                  <button
                    type='button'
                    onClick={handleAddMaterial}
                    className='text-[11px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer'
                  >
                    <Plus size={12} />
                    <span>Thêm nhựa</span>
                  </button>
                </div>

                {(formData.materials || []).map((mat, idx) => (
                  <div
                    key={idx}
                    className='p-3 rounded-2xl border bg-black/[0.02] dark:bg-white/[0.02] border-zinc-200/80 dark:border-white/10 space-y-2.5 transition-all'
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='text-xs font-bold text-zinc-600 dark:text-zinc-400'>
                        Cuộn nhựa {(formData.materials || []).length > 1 ? `#${idx + 1}` : ''}
                      </span>
                      {(formData.materials || []).length > 1 && (
                        <button
                          type='button'
                          onClick={() => handleRemoveMaterial(idx)}
                          className='px-2 py-1 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium'
                        >
                          <X size={13} />
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>

                    <FilamentSelect
                      value={mat.inventoryId || ''}
                      filaments={filaments}
                      placeholder='-- Chọn cuộn nhựa từ kho --'
                      onChange={(val) => handleMaterialChange(idx, 'inventoryId', val)}
                    />
                  </div>
                ))}
              </div>

              <div className='pt-1 border-t border-inherit/40'>
                <label className='block font-semibold opacity-70 mb-1'>Ghi chú đơn hàng</label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-xl border outline-none resize-none transition-all ${
                    isDark
                      ? 'bg-zinc-800/80 border-white/10 text-zinc-100 focus:border-orange-500/60'
                      : 'bg-white border-zinc-200 text-zinc-900 focus:border-orange-500'
                  }`}
                  placeholder='Ghi chú thêm về thông số in, thời gian giao...'
                />
              </div>

              <div className='pt-1 border-t border-inherit/40'>
                <label className='block font-semibold opacity-70 mb-1'>Trạng thái đơn hàng</label>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-1.5'>
                  {[
                    { status: STATUSES.PENDING, label: 'Chờ in' },
                    { status: STATUSES.PRINTING, label: 'Đang in' },
                    { status: STATUSES.COMPLETED, label: 'Hoàn thành' },
                    { status: STATUSES.CANCELLED, label: 'Đã hủy' }
                  ].map((s) => {
                    const isSelected = formData.status === s.status
                    return (
                      <button
                        key={s.status}
                        type='button'
                        onClick={() => handleFieldChange('status', s.status)}
                        className={`py-1.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                            : 'border-inherit bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ===== VIEW MODE ===== */
            <>
              <div>
                <label className='text-[11px] text-orange-500 font-bold uppercase tracking-wider block mb-1'>
                  Ngày tạo: {formatDateTime(order.date)}
                </label>
                <div className='text-lg sm:text-xl font-black'>{order.itemName}</div>
                <div className='text-xs opacity-75 mt-2 flex flex-wrap gap-1.5 items-center'>
                  {order.materials && order.materials.length > 0 ? (
                    order.materials.map((m, i) => (
                      <span
                        key={i}
                        className='bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-inherit flex items-center gap-1 font-medium'
                      >
                        <Layers size={11} className='text-orange-400 opacity-80' />
                        <span>{m.type}</span>
                        <span className='opacity-60'>({m.color})</span>
                      </span>
                    ))
                  ) : (
                    <span className='bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-inherit flex items-center gap-1 font-medium'>
                      <Layers size={11} className='text-orange-400 opacity-80' />
                      <span>{order.material || 'PLA'}</span>
                      <span className='opacity-60'>({order.color || 'Mặc định'})</span>
                    </span>
                  )}
                  <span className='bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-inherit font-medium'>
                    Số lượng: <strong className='ml-1 font-black'>{order.quantity}</strong>
                  </span>
                </div>
              </div>

              <div className='bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-inherit space-y-2.5'>
                <h4 className='text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5'>
                  <User size={13} />
                  <span>Thông tin khách hàng</span>
                </h4>
                <div className='flex items-center justify-between text-xs'>
                  <span className='opacity-60'>Tên khách:</span>
                  <span className='font-bold'>{order.customerName}</span>
                </div>
                <div className='flex items-center justify-between text-xs'>
                  <span className='opacity-60'>Số điện thoại:</span>
                  <a
                    href={`tel:${order.phone}`}
                    className='font-bold text-orange-500 hover:underline flex items-center gap-1'
                  >
                    <Phone size={11} />
                    <span>{order.phone}</span>
                  </a>
                </div>
                {order.address && (
                  <div className='flex items-start justify-between text-xs pt-1.5 border-t border-inherit/40'>
                    <span className='opacity-60 flex-shrink-0 mr-2 flex items-center gap-1'>
                      <MapPin size={11} />
                      <span>Địa chỉ:</span>
                    </span>
                    <span className='font-medium text-right'>{order.address}</span>
                  </div>
                )}
                {order.notes && (
                  <div className='flex items-start justify-between text-xs pt-1.5 border-t border-inherit/40'>
                    <span className='opacity-60 flex-shrink-0 mr-2 flex items-center gap-1'>
                      <FileText size={11} />
                      <span>Ghi chú:</span>
                    </span>
                    <span className='font-semibold text-right text-orange-500/90 dark:text-orange-400'>
                      📝 {order.notes}
                    </span>
                  </div>
                )}
              </div>

              <div className='flex items-center justify-between p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20'>
                <span className='text-xs font-bold'>Tổng tiền thanh toán</span>
                <span className='text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500'>
                  {formatCurrency(order.price)}
                </span>
              </div>

              <div>
                <label className='text-xs font-bold opacity-60 uppercase tracking-wider block mb-2'>
                  Cập nhật trạng thái
                </label>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                  {[
                    {
                      status: STATUSES.PENDING,
                      label: 'Chờ in',
                      color: 'hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-400'
                    },
                    {
                      status: STATUSES.PRINTING,
                      label: 'Đang in',
                      color: 'hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400'
                    },
                    {
                      status: STATUSES.COMPLETED,
                      label: 'Hoàn thành',
                      color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400'
                    },
                    {
                      status: STATUSES.CANCELLED,
                      label: 'Đã hủy',
                      color: 'hover:border-red-500/50 hover:bg-red-500/10 text-red-400'
                    }
                  ].map((s) => {
                    const isCurrent = order.status === s.status
                    return (
                      <button
                        key={s.status}
                        onClick={() => onUpdateStatus(s.status)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? 'border-orange-500 bg-orange-500/20 text-orange-500 shadow-sm'
                            : `border-inherit bg-black/5 dark:bg-white/5 opacity-70 ${s.color}`
                        }`}
                      >
                        {s.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface FilamentModalProps {
  isOpen: boolean
  editingFilament: any
  theme: 'dark' | 'light'
  onClose: () => void
  onEditChange: (updated: any) => void
  onSave: () => void
  onDelete: () => void
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
  if (!isOpen || !editingFilament) return null
  const isDark = theme === 'dark'

  const availableBrands = Array.from(new Set([...['Bambu Lab', 'Tinmorry', 'eSun', 'Stem'], editingFilament.brand]))
  const availableTypes = Array.from(
    new Set([...['PLA Matte', 'PLA Basic', 'PLA Silk', 'PLA Lite', 'PETG Matte', 'PETG Basic'], editingFilament.type])
  )

  return (
    <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />

      <div
        className={`w-full sm:max-w-lg md:max-w-xl rounded-t-[2rem] sm:rounded-3xl border flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 max-h-[90%] pb-safe backdrop-blur-2xl overflow-hidden relative ${
          isDark ? 'bg-zinc-900/95 border-white/10 text-zinc-100' : 'bg-white/95 border-zinc-200 text-zinc-900'
        }`}
      >
        <div className='flex justify-between items-center p-5 border-b border-inherit z-10'>
          <h3 className='font-bold text-lg flex items-center'>
            <Database size={18} className='mr-2 text-purple-500' />
            Chỉnh sửa cuộn nhựa
          </h3>
          <button
            onClick={onClose}
            className='p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-inherit cursor-pointer'
          >
            <X size={16} />
          </button>
        </div>

        <div className='p-5 sm:p-6 flex-1 overflow-y-auto space-y-5 z-10 scrollbar-hide'>
          <div className='grid grid-cols-2 gap-3.5'>
            <div>
              <label className='text-xs font-semibold opacity-70 block mb-1'>Hãng</label>
              <select
                className='w-full p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 outline-none text-xs sm:text-sm'
                value={editingFilament.brand}
                onChange={(e) => onEditChange({ ...editingFilament, brand: e.target.value })}
              >
                {availableBrands.map((b) => (
                  <option key={b} value={b} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='text-xs font-semibold opacity-70 block mb-1'>Loại Nhựa</label>
              <select
                className='w-full p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 outline-none text-xs sm:text-sm'
                value={editingFilament.type}
                onChange={(e) => onEditChange({ ...editingFilament, type: e.target.value })}
              >
                {availableTypes.map((t) => (
                  <option key={t} value={t} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className='text-xs font-semibold opacity-70 block mb-1'>Tên Màu</label>
            <input
              type='text'
              className='w-full p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 outline-none text-xs sm:text-sm'
              value={editingFilament.colorName}
              onChange={(e) => onEditChange({ ...editingFilament, colorName: e.target.value })}
              placeholder='VD: Trắng, Đỏ...'
            />
          </div>

          <div>
            <label className='text-xs font-semibold opacity-70 block mb-1'>Mã Màu (HEX)</label>
            <div className='flex items-center gap-3'>
              <input
                type='color'
                className='w-10 h-10 rounded-xl cursor-pointer border border-inherit bg-transparent p-1'
                value={editingFilament.colorHex}
                onChange={(e) => onEditChange({ ...editingFilament, colorHex: e.target.value })}
              />
              <input
                type='text'
                className='flex-1 p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 outline-none font-mono text-xs sm:text-sm'
                value={editingFilament.colorHex}
                onChange={(e) => onEditChange({ ...editingFilament, colorHex: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className='text-xs font-semibold opacity-70 block mb-1'>Ghi Chú</label>
            <input
              type='text'
              className='w-full p-2.5 rounded-xl border border-inherit bg-black/5 dark:bg-white/5 outline-none text-xs sm:text-sm'
              value={editingFilament.notes || ''}
              onChange={(e) => onEditChange({ ...editingFilament, notes: e.target.value })}
              placeholder=''
            />
          </div>

          <div>
            <div className='flex justify-between items-center mb-1'>
              <label className='text-xs font-semibold opacity-70'>Khối Lượng Còn Lại (g)</label>
              <span className='text-xs font-bold text-purple-500'>
                {editingFilament.weight ??
                  (editingFilament.percentage !== undefined ? editingFilament.percentage * 10 : 1000)}
                g
              </span>
            </div>
            <input
              type='range'
              min='0'
              max='1000'
              step='50'
              className='w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-purple-500 cursor-pointer'
              value={
                editingFilament.weight ??
                (editingFilament.percentage !== undefined ? editingFilament.percentage * 10 : 1000)
              }
              onChange={(e) => {
                const grams = parseInt(e.target.value)
                onEditChange({
                  ...editingFilament,
                  weight: grams,
                  percentage: Math.round(grams / 10)
                })
              }}
            />
            <div className='flex justify-between text-[10px] opacity-50 mt-1'>
              <span>0g (Hết)</span>
              <span>500g (Nửa cuộn)</span>
              <span>1000g (Đầy)</span>
            </div>
          </div>

          <div className='pt-3 border-t border-inherit grid grid-cols-2 gap-3'>
            <button
              onClick={onDelete}
              className='py-2.5 rounded-xl border border-red-500/20 text-red-500 bg-red-500/10 hover:bg-red-500/20 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer'
            >
              <Trash2 size={15} className='mr-1.5' /> Xóa Khỏi Kho
            </button>
            <button
              onClick={onSave}
              className='py-2.5 rounded-xl text-white bg-purple-600 hover:bg-purple-700 font-bold text-xs flex items-center justify-center transition-all shadow-sm cursor-pointer'
            >
              <Save size={15} className='mr-1.5' /> Lưu Lại
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SettingModalProps {
  isOpen: boolean
  theme: 'dark' | 'light'
  user: UserInfo | null
  gasUrl: string
  tempGasUrl?: string
  tempClientId?: string
  syncStatus: string
  syncMessage: string
  onClose: () => void
  onSetTheme: (theme: 'dark' | 'light') => void
  onTempGasUrlChange?: (val: string) => void
  onTempClientIdChange?: (val: string) => void
  onSave?: () => void
  onLogout: () => void
  onPushToSheet: () => void
}

export const SettingModal: React.FC<SettingModalProps> = ({
  isOpen,
  theme,
  user,
  gasUrl,
  syncStatus,
  onClose,
  onSetTheme,
  onLogout,
  onPushToSheet
}) => {
  if (!isOpen) return null
  const isDark = theme === 'dark'

  return (
    <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose} />

      <div
        className={`w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl border shadow-2xl animate-in slide-in-from-bottom-6 backdrop-blur-2xl overflow-hidden relative ${
          isDark ? 'bg-zinc-900/95 border-white/10 text-zinc-100' : 'bg-white/95 border-zinc-200 text-zinc-900'
        }`}
      >
        <div className='p-4 border-b border-inherit flex items-center justify-between'>
          <div className='flex items-center gap-3 min-w-0'>
            {user?.picture ? (
              <img
                src={user.picture}
                alt='Avatar'
                className='w-9 h-9 rounded-full border border-inherit object-cover flex-shrink-0'
              />
            ) : (
              <div className='w-9 h-9 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold flex-shrink-0'>
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className='min-w-0'>
              <div className='font-bold text-sm truncate leading-tight'>{user?.name || 'Người dùng'}</div>
              <div className='text-[11px] opacity-60 truncate'>{user?.email}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className='p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer'
          >
            <X size={16} />
          </button>
        </div>

        <div className='p-2 space-y-1'>
          <div className='w-full px-3 py-2.5 rounded-xl flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors'>
            <div className='flex items-center gap-2.5'>
              {isDark ? (
                <Moon size={15} className='text-amber-400 fill-amber-400' />
              ) : (
                <Sun size={15} className='text-orange-500 fill-orange-400' />
              )}
              <div>
                <div className='text-xs font-semibold'>Chế độ hiển thị</div>
                <div className='text-[10px] opacity-60'>
                  {isDark ? 'Giao diện Tối (Dark mode)' : 'Giao diện Sáng (Light mode)'}
                </div>
              </div>
            </div>

            <button
              type='button'
              onClick={() => onSetTheme(isDark ? 'light' : 'dark')}
              title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
              aria-label='Toggle theme'
              className={`relative inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-all duration-300 focus:outline-none cursor-pointer border ${
                isDark ? 'bg-zinc-800/90 border-white/15' : 'bg-orange-100 border-orange-200'
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full shadow-sm transition-transform duration-300 ${
                  isDark
                    ? 'translate-x-5 bg-zinc-900 text-amber-400 border border-white/15'
                    : 'translate-x-0 bg-white text-orange-500 border border-orange-200/80 shadow-sm'
                }`}
              >
                {isDark ? (
                  <Moon size={11} className='fill-amber-400 text-amber-400' />
                ) : (
                  <Sun size={11} className='text-orange-500 fill-orange-400' />
                )}
              </span>
            </button>
          </div>

          {gasUrl && (
            <button
              type='button'
              onClick={onPushToSheet}
              disabled={syncStatus === 'syncing'}
              className='w-full px-3 py-2.5 rounded-xl text-left flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer'
            >
              <div className='flex items-center gap-2.5'>
                <RefreshCw size={15} className={`text-orange-500 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <div>
                  <div className='text-xs font-semibold'>Đồng bộ Google Sheets</div>
                  <div className='text-[10px] opacity-60'>
                    {syncStatus === 'syncing' ? 'Đang lưu lên Cloud...' : 'Đã kết nối Online'}
                  </div>
                </div>
              </div>
              <span
                className={`w-2 h-2 rounded-full ${syncStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}
              />
            </button>
          )}

          <button
            type='button'
            onClick={onLogout}
            className='w-full px-3 py-2.5 rounded-xl text-left flex items-center gap-2.5 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer'
          >
            <LogOut size={15} />
            <span className='text-xs font-semibold'>Đăng xuất tài khoản</span>
          </button>
        </div>
      </div>
    </div>
  )
}
