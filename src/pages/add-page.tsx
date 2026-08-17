import React, { useEffect, useState } from 'react'
import { useOutletContext, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PlusCircle, X, ShoppingBag, Layers, Check } from 'lucide-react'
import type { Filament, Order } from '~/types'
import { BASIC_COLORS, STATUSES } from '~/types'
import { Input, FilamentSelect } from '~/components/ui'

const orderSchema = z.object({
  customerName: z.string().trim().min(1, 'Vui lòng nhập tên khách hàng'),
  phone: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại gồm 10 số (VD: 0912345678)'),
  address: z.string().optional(),
  itemName: z.string().trim().min(1, 'Vui lòng nhập tên mẫu in 3D'),
  materials: z
    .array(
      z.object({
        inventoryId: z.string().min(1, 'Vui lòng chọn cuộn nhựa từ kho'),
        type: z.string().min(1, 'Loại nhựa'),
        color: z.string().min(1, 'Màu sắc')
      })
    )
    .min(1, 'Cần ít nhất 1 loại nhựa in'),
  quantity: z.coerce.number().min(1, 'Số lượng tối thiểu là 1'),
  price: z.coerce.number({ invalid_type_error: 'Vui lòng nhập số tiền' }).min(0, 'Thành tiền không được âm'),
  notes: z.string().optional()
})

type OrderFormValues = z.infer<typeof orderSchema>

const filamentSchema = z.object({
  brand: z.string().min(1, 'Chọn hãng sản xuất'),
  customBrand: z.string().optional(),
  type: z.string().min(1, 'Chọn loại nhựa'),
  colorHex: z.string().min(1, 'Chọn màu sắc'),
  colorName: z.string().trim().min(1, 'Vui lòng nhập tên màu thương mại'),
  quantity: z.coerce.number().min(1, 'Số lượng tối thiểu là 1'),
  notes: z.string().optional()
})

type FilamentFormValues = z.infer<typeof filamentSchema>

export const AddPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const navigate = useNavigate()

  const { addMode, setAddMode, orders, setOrders, filaments, setFilaments, theme } = useOutletContext<any>()

  const isDark = theme === 'dark'

  const [pendingVariations, setPendingVariations] = useState<any[]>([])

  const {
    register: registerOrder,
    control: controlOrder,
    handleSubmit: handleSubmitOrder,
    formState: { errors: orderErrors },
    setValue: setOrderValue,
    watch: watchOrder,
    reset: resetOrder
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema) as any,
    defaultValues: {
      customerName: '',
      phone: '',
      address: '',
      itemName: '',
      materials: [{ inventoryId: '', type: '', color: '' }],
      quantity: 1,
      price: '' as any,
      notes: ''
    }
  })

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial
  } = useFieldArray({
    control: controlOrder,
    name: 'materials'
  })

  const watchMaterials = watchOrder('materials')

  const {
    register: registerFilament,
    handleSubmit: handleSubmitFilament,
    formState: { errors: filamentErrors },
    setValue: setFilamentValue,
    watch: watchFilament,
    reset: resetFilament
  } = useForm<FilamentFormValues>({
    resolver: zodResolver(filamentSchema) as any,
    defaultValues: {
      brand: 'Bambu Lab',
      customBrand: '',
      type: 'PLA Basic',
      colorHex: '#ef4444',
      colorName: 'Đỏ',
      quantity: 1,
      notes: ''
    }
  })

  const watchBrand = watchFilament('brand')
  const watchColorHex = watchFilament('colorHex')

  useEffect(() => {
    if (tabParam === 'filament') {
      setAddMode('filament')
    } else if (tabParam === 'order') {
      setAddMode('order')
    }
  }, [tabParam, setAddMode])

  const onOrderSubmit = (data: OrderFormValues) => {
    const orderToAdd: Order = {
      id: `3D-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      customerName: data.customerName,
      phone: data.phone,
      address: data.address || '',
      itemName: data.itemName,
      materials: data.materials,
      quantity: data.quantity,
      price: data.price,
      status: STATUSES.PENDING,
      date: new Date().toISOString().split('T')[0],
      notes: data.notes || ''
    }

    setOrders([orderToAdd, ...orders])
    resetOrder()
    navigate('/orders')
  }

  const onAddVariation = () => {
    const currentFilament = watchFilament()
    if (!currentFilament.colorName?.trim()) {
      return
    }

    setPendingVariations((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        quantity: currentFilament.quantity || 1,
        colorHex: currentFilament.colorHex || '#ef4444',
        colorName: currentFilament.colorName || 'Mặc định',
        notes: currentFilament.notes || ''
      }
    ])
  }

  const handleRemoveVariation = (id: string) => {
    setPendingVariations((prev) => prev.filter((v) => v.id !== id))
  }

  const onFilamentSubmit = (data: FilamentFormValues) => {
    const finalBrand = data.brand === 'Khác' ? data.customBrand || 'Chưa rõ' : data.brand

    let variationsToProcess = [...pendingVariations]
    if (variationsToProcess.length === 0) {
      variationsToProcess = [
        {
          quantity: data.quantity || 1,
          colorHex: data.colorHex,
          colorName: data.colorName,
          notes: data.notes || ''
        }
      ]
    }

    const newItems: Filament[] = []
    variationsToProcess.forEach((variation, index) => {
      for (let i = 0; i < variation.quantity; i++) {
        newItems.push({
          id: `PL-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, '0')}-${index}-${i}`,
          brand: finalBrand,
          type: data.type,
          colorHex: variation.colorHex,
          colorName: variation.colorName,
          weight: 1000,
          date: new Date().toISOString().split('T')[0],
          notes: variation.notes || ''
        })
      }
    })

    setFilaments([...newItems, ...filaments])
    setPendingVariations([])
    resetFilament()
    navigate('/inventory')
  }

  return (
    <div className='relative overflow-x-clip space-y-4 sm:space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto'>
      <div className='absolute inset-0 overflow-hidden pointer-events-none -z-10'>
        <div
          className={`absolute -top-12 -left-12 w-72 h-72 rounded-full filter blur-[80px] transition-colors duration-500 ${
            addMode === 'order' ? 'bg-orange-500/10 dark:bg-orange-500/15' : 'bg-teal-500/10 dark:bg-teal-500/15'
          }`}
        />
        <div
          className={`absolute top-48 -right-12 w-80 h-80 rounded-full filter blur-[90px] transition-colors duration-500 ${
            addMode === 'order' ? 'bg-amber-500/10 dark:bg-amber-500/15' : 'bg-emerald-500/10 dark:bg-emerald-500/15'
          }`}
        />
      </div>

      <div
        className={`p-1 rounded-2xl border backdrop-blur-2xl shadow-lg max-w-xs sm:max-w-sm mx-auto flex items-center transition-all ${
          isDark ? 'bg-zinc-900/70 border-white/10' : 'bg-white/80 border-white/80 shadow-black/5'
        }`}
      >
        <button
          type='button'
          onClick={() => setAddMode('order')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
            addMode === 'order'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-[1.02]'
              : 'opacity-65 hover:opacity-100 text-inherit'
          }`}
        >
          <ShoppingBag size={15} strokeWidth={2.4} />
          <span>Tạo đơn hàng</span>
        </button>

        <button
          type='button'
          onClick={() => setAddMode('filament')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
            addMode === 'filament'
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/25 scale-[1.02]'
              : 'opacity-65 hover:opacity-100 text-inherit'
          }`}
        >
          <Layers size={15} strokeWidth={2.4} />
          <span>Nhập kho nhựa</span>
        </button>
      </div>

      <div
        className={`relative rounded-2xl sm:rounded-3xl border backdrop-blur-2xl p-4 sm:p-6 shadow-2xl transition-all duration-300 overflow-hidden ${
          isDark
            ? 'bg-zinc-900/65 border-white/10 text-zinc-100 shadow-black/50'
            : 'bg-white/85 border-white/80 text-zinc-900 shadow-orange-500/5'
        }`}
      >
        <div
          className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br rounded-bl-full pointer-events-none transition-colors duration-500 ${
            addMode === 'order' ? 'from-orange-500/15 to-transparent' : 'from-teal-500/15 to-transparent'
          }`}
        />

        {addMode === 'order' ? (
          <form onSubmit={handleSubmitOrder(onOrderSubmit)} className='space-y-3.5 sm:space-y-4'>
            <div className='flex items-center gap-2 pb-2 border-b border-inherit/40'>
              <div className='w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' />
              <h2 className='text-xs sm:text-sm font-bold tracking-tight'>Thông tin đơn hàng in 3D</h2>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5'>
              <div>
                <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>Tên khách hàng *</label>
                <Input
                  type='text'
                  className={orderErrors.customerName ? 'border-rose-500/80 focus-visible:ring-rose-500/30' : ''}
                  {...registerOrder('customerName')}
                />
                {orderErrors.customerName && (
                  <span className='text-[10px] text-rose-500 font-medium mt-1 block'>
                    {orderErrors.customerName.message}
                  </span>
                )}
              </div>

              <div>
                <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>Số điện thoại *</label>
                <Input
                  type='tel'
                  className={orderErrors.phone ? 'border-rose-500/80 focus-visible:ring-rose-500/30' : ''}
                  {...registerOrder('phone')}
                />
                {orderErrors.phone && (
                  <span className='text-[10px] text-rose-500 font-medium mt-1 block'>{orderErrors.phone.message}</span>
                )}
              </div>
            </div>

            <div>
              <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>Địa chỉ giao hàng</label>
              <Input type='text' {...registerOrder('address')} />
            </div>

            <div className='pt-2 border-t border-inherit/40'>
              <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>
                Tên sản phẩm (Mẫu in 3D) *
              </label>
              <Input
                type='text'
                className={orderErrors.itemName ? 'border-rose-500/80 focus-visible:ring-rose-500/30' : ''}
                {...registerOrder('itemName')}
              />
              {orderErrors.itemName && (
                <span className='text-[10px] text-rose-500 font-medium mt-1 block'>{orderErrors.itemName.message}</span>
              )}
            </div>

            <div className='space-y-2.5 pt-1'>
              <div className='flex items-center justify-between'>
                <label className='block text-[11px] sm:text-xs font-semibold opacity-70'>Lựa chọn nhựa in</label>
                {materialFields.length > 0 && (
                  <span className='text-[10px] opacity-60 font-medium'>({materialFields.length} loại nhựa)</span>
                )}
              </div>

              {materialFields.map((field, index) => {
                const currentInventoryId = watchMaterials?.[index]?.inventoryId
                const hasError = !!orderErrors.materials?.[index]

                return (
                  <div
                    key={field.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      hasError
                        ? 'border-rose-500/80 bg-rose-500/5'
                        : 'bg-black/[0.02] dark:bg-white/[0.02] border-zinc-200/80 dark:border-white/10'
                    } space-y-2.5`}
                  >
                    <div className='flex items-center justify-between gap-2'>
                      <span className='text-xs font-bold text-zinc-600 dark:text-zinc-400'>
                        Cuộn nhựa {materialFields.length > 1 ? `#${index + 1}` : ''}
                      </span>
                      {materialFields.length > 1 && (
                        <button
                          type='button'
                          onClick={() => removeMaterial(index)}
                          className='px-2 py-1 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium'
                        >
                          <X size={13} />
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>

                    <FilamentSelect
                      value={currentInventoryId || ''}
                      filaments={filaments}
                      placeholder='-- Chọn cuộn nhựa từ kho --'
                      onChange={(val) => {
                        if (val) {
                          const fil = filaments.find((f: Filament) => f.id === val)
                          if (fil) {
                            setOrderValue(`materials.${index}.inventoryId`, val, { shouldValidate: true })
                            setOrderValue(`materials.${index}.type`, `${fil.brand} ${fil.type}`, {
                              shouldValidate: true
                            })
                            setOrderValue(`materials.${index}.color`, fil.colorName, { shouldValidate: true })
                          }
                        } else {
                          setOrderValue(`materials.${index}.inventoryId`, '', { shouldValidate: true })
                          setOrderValue(`materials.${index}.type`, '', { shouldValidate: true })
                          setOrderValue(`materials.${index}.color`, '', { shouldValidate: true })
                        }
                      }}
                    />

                    {hasError && (
                      <span className='text-[10px] text-rose-500 font-medium block'>
                        Vui lòng chọn cuộn nhựa từ kho
                      </span>
                    )}
                  </div>
                )
              })}

              <button
                type='button'
                onClick={() => appendMaterial({ inventoryId: '', type: '', color: '' })}
                className='text-[11px] sm:text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1.5 cursor-pointer pt-1 hover:underline'
              >
                <PlusCircle size={14} />
                <span>Thêm loại nhựa khác cho đơn này</span>
              </button>
            </div>

            <div className='grid grid-cols-2 gap-3 pt-2 border-t border-inherit/40'>
              <div>
                <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>Số lượng *</label>
                <Input
                  type='number'
                  min='1'
                  className={`font-black ${orderErrors.quantity ? 'border-rose-500/80' : ''}`}
                  {...registerOrder('quantity')}
                />
                {orderErrors.quantity && (
                  <span className='text-[10px] text-rose-500 font-medium mt-1 block'>
                    {orderErrors.quantity.message}
                  </span>
                )}
              </div>

              <div>
                <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>Thành tiền (VNĐ) *</label>
                <Input
                  type='number'
                  min='0'
                  className={`font-black text-orange-500 ${orderErrors.price ? 'border-rose-500/80' : ''}`}
                  {...registerOrder('price')}
                />
                {orderErrors.price && (
                  <span className='text-[10px] text-rose-500 font-medium mt-1 block'>{orderErrors.price.message}</span>
                )}
              </div>
            </div>

            <div>
              <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>Ghi chú đơn hàng</label>
              <Input type='text' {...registerOrder('notes')} />
            </div>

            <button
              type='submit'
              className='w-full mt-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 active:scale-[0.98] text-white font-black text-sm h-11 rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer select-none flex items-center justify-center gap-2'
            >
              <PlusCircle size={17} strokeWidth={2.4} />
              <span>Tạo Đơn Hàng Mới</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitFilament(onFilamentSubmit)} className='space-y-3.5 sm:space-y-4'>
            <div className='flex items-center gap-2 pb-2 border-b border-inherit/40'>
              <div className='w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]' />
              <h2 className='text-xs sm:text-sm font-bold tracking-tight'>Nhập thông tin cuộn nhựa vào kho</h2>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5'>
              <div>
                <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>Hãng sản xuất</label>
                <select
                  className={`w-full h-9 px-3 py-1.5 text-xs sm:text-sm rounded-xl border outline-none transition-colors ${
                    isDark
                      ? 'bg-zinc-800/80 border-white/10 text-zinc-100 focus:border-teal-500/50'
                      : 'bg-white border-zinc-200 text-zinc-900 focus:border-teal-500'
                  }`}
                  {...registerFilament('brand')}
                >
                  <option value='Bambu Lab'>Bambu Lab</option>
                  <option value='Tinmorry'>Tinmorry</option>
                  <option value='eSun'>eSun</option>
                  <option value='Sunlu'>Sunlu</option>
                  <option value='Stem'>Stem</option>
                  <option value='Khác'>Khác...</option>
                </select>
              </div>

              <div>
                <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>Loại nhựa</label>
                <select
                  className={`w-full h-9 px-3 py-1.5 text-xs sm:text-sm rounded-xl border outline-none transition-colors ${
                    isDark
                      ? 'bg-zinc-800/80 border-white/10 text-zinc-100 focus:border-teal-500/50'
                      : 'bg-white border-zinc-200 text-zinc-900 focus:border-teal-500'
                  }`}
                  {...registerFilament('type')}
                >
                  <option value='PLA Matte'>PLA Matte</option>
                  <option value='PLA Basic'>PLA Basic</option>
                  <option value='PLA Silk'>PLA Silk</option>
                  <option value='PLA Lite'>PLA Lite</option>
                  <option value='PETG Matte'>PETG Matte</option>
                  <option value='PETG Basic'>PETG Basic</option>
                  <option value='ABS'>ABS</option>
                  <option value='TPU 95A'>TPU 95A</option>
                </select>
              </div>
            </div>

            {watchBrand === 'Khác' && (
              <div>
                <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>Tên hãng khác</label>
                <Input type='text' {...registerFilament('customBrand')} />
              </div>
            )}

            <div className='pt-2 border-t border-inherit/40 space-y-2.5'>
              <div className='flex items-center justify-between'>
                <label className='block text-[11px] sm:text-xs font-semibold opacity-70'>Màu sắc cuộn nhựa</label>
                <div className='flex items-center gap-1.5 text-[10px] font-mono opacity-60'>
                  <span>HEX:</span>
                  <span className='uppercase font-bold'>{watchColorHex}</span>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-2'>
                {BASIC_COLORS.map((color) => (
                  <button
                    type='button'
                    key={color.hex}
                    onClick={() => {
                      setFilamentValue('colorHex', color.hex)
                      setFilamentValue('colorName', color.name)
                    }}
                    className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer relative ${
                      watchColorHex?.toLowerCase() === color.hex.toLowerCase()
                        ? 'ring-2 ring-teal-500 scale-110 shadow-lg shadow-teal-500/35 border-white'
                        : 'opacity-85 hover:opacity-100 border-white/30 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {watchColorHex?.toLowerCase() === color.hex.toLowerCase() && (
                      <Check size={13} className='text-white drop-shadow-md mx-auto' strokeWidth={3} />
                    )}
                  </button>
                ))}

                <label
                  className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer relative flex items-center justify-center overflow-hidden ${
                    !BASIC_COLORS.some((c) => c.hex.toLowerCase() === watchColorHex?.toLowerCase())
                      ? 'ring-2 ring-teal-500 scale-110 shadow-lg shadow-teal-500/35 border-white'
                      : 'opacity-85 hover:opacity-100 border-white/30 hover:scale-105'
                  }`}
                  style={{
                    background:
                      'conic-gradient(from 0deg, #ff0000 0%, #ff8800 14%, #ffff00 28%, #00cc44 42%, #0099ff 57%, #6600ff 71%, #ff00bb 85%, #ff0000 100%)'
                  }}
                  title='Chọn màu sắc tùy chỉnh (7 sắc cầu vồng)'
                >
                  {!BASIC_COLORS.some((c) => c.hex.toLowerCase() === watchColorHex?.toLowerCase()) && (
                    <Check size={13} className='text-white drop-shadow-md mx-auto z-10' strokeWidth={3} />
                  )}
                  <input
                    type='color'
                    value={watchColorHex || '#ef4444'}
                    onChange={(e) => {
                      setFilamentValue('colorHex', e.target.value)
                    }}
                    className='absolute inset-0 opacity-0 cursor-pointer w-full h-full rounded-full'
                  />
                </label>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2'>
                <div>
                  <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>
                    Tên màu thương mại *
                  </label>
                  <Input
                    type='text'
                    className={filamentErrors.colorName ? 'border-rose-500/80' : ''}
                    {...registerFilament('colorName')}
                  />
                  {filamentErrors.colorName && (
                    <span className='text-[10px] text-rose-500 font-medium mt-1 block'>
                      {filamentErrors.colorName.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>Số lượng cuộn</label>
                  <select
                    className={`w-full h-9 px-3 py-1.5 text-xs sm:text-sm rounded-xl border outline-none transition-colors ${
                      isDark
                        ? 'bg-zinc-800/80 border-white/10 text-zinc-100 focus:border-teal-500/50'
                        : 'bg-white border-zinc-200 text-zinc-900 focus:border-teal-500'
                    }`}
                    {...registerFilament('quantity')}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} cuộn (1000g / cuộn)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-[11px] sm:text-xs font-semibold opacity-70 mb-1'>Ghi chú cuộn nhựa</label>
                <Input type='text' {...registerFilament('notes')} />
              </div>

              <button
                type='button'
                onClick={onAddVariation}
                className='text-[11px] sm:text-xs font-bold text-teal-500 hover:text-teal-400 flex items-center gap-1 cursor-pointer pt-1'
              >
                <PlusCircle size={13} />
                <span>Thêm màu này vào danh sách nhập</span>
              </button>
            </div>

            {pendingVariations.length > 0 && (
              <div className='space-y-1.5 pt-2 border-t border-inherit/40'>
                <div className='text-[11px] font-bold opacity-70'>
                  Danh sách cuộn sẽ nhập ({pendingVariations.reduce((acc: number, curr: any) => acc + curr.quantity, 0)}{' '}
                  cuộn):
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {pendingVariations.map((v: any) => (
                    <div
                      key={v.id}
                      className={`flex justify-between items-center text-xs p-2 px-3 rounded-xl border ${
                        isDark ? 'bg-zinc-800/60 border-white/5' : 'bg-black/[0.03] border-black/5'
                      }`}
                    >
                      <div className='flex items-center gap-2'>
                        <div
                          className='w-4 h-4 rounded-full border border-white/40 shadow-sm'
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span className='font-bold'>{v.colorName}</span>
                        <span className='opacity-60 text-[11px]'>x{v.quantity} cuộn</span>
                      </div>
                      <button
                        type='button'
                        onClick={() => handleRemoveVariation(v.id)}
                        className='text-red-400 hover:text-red-500 p-1 cursor-pointer'
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type='submit'
              className='w-full mt-3 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] text-white font-black text-sm h-11 rounded-2xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer select-none flex items-center justify-center gap-2'
            >
              <PlusCircle size={17} strokeWidth={2.4} />
              <span>
                Nhập{' '}
                {pendingVariations.length > 0
                  ? `${pendingVariations.reduce((acc: number, curr: any) => acc + curr.quantity, 0)} cuộn `
                  : ''}
                Vào Kho
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AddPage
