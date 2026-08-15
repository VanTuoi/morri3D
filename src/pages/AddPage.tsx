import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { PlusCircle, X } from 'lucide-react';
import { BASIC_COLORS, Filament } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';

export const AddPage: React.FC = () => {
  const {
    addMode,
    setAddMode,
    newOrder,
    setNewOrder,
    handleAddOrder,
    handleAddOrderMaterial,
    handleUpdateOrderMaterial,
    handleRemoveOrderMaterial,
    newFilament,
    setNewFilament,
    pendingVariations,
    handleAddVariation,
    handleRemoveVariation,
    handleAddFilament,
    filaments
  } = useOutletContext<any>();

  return (
    <div className="space-y-3.5 sm:space-y-5 animate-in fade-in duration-200 max-w-2xl mx-auto">
      {/* Mode Switcher */}
      <div className="p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/60 flex max-w-xs mx-auto">
        <button 
          onClick={() => setAddMode('order')} 
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            addMode === 'order' 
              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm' 
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          Tạo đơn hàng
        </button>
        <button 
          onClick={() => setAddMode('filament')} 
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            addMode === 'filament' 
              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm' 
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          Nhập kho nhựa
        </button>
      </div>

      {/* Unified Single Flat Form Container */}
      <Card className="p-3.5 sm:p-6">
        {addMode === 'order' ? (
          <form onSubmit={handleAddOrder} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Tên khách hàng *</label>
                <Input 
                  required 
                  type="text" 
                  value={newOrder.customerName} 
                  onChange={e => setNewOrder({ ...newOrder, customerName: e.target.value })} 
                  placeholder="VD: Anh Minh..." 
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Số điện thoại *</label>
                <Input 
                  required 
                  type="tel" 
                  value={newOrder.phone} 
                  onChange={e => setNewOrder({ ...newOrder, phone: e.target.value })} 
                  placeholder="0901234567..." 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Địa chỉ giao hàng</label>
              <Input 
                type="text" 
                value={newOrder.address} 
                onChange={e => setNewOrder({ ...newOrder, address: e.target.value })} 
                placeholder="Địa chỉ giao hàng..." 
              />
            </div>

            <div className="pt-2 border-t border-inherit">
              <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Tên sản phẩm (Mẫu in 3D) *</label>
              <Input 
                required 
                type="text" 
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
                    className="flex-1 h-9 px-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 outline-none"
                    value={mat.inventoryId} 
                    onChange={e => handleUpdateOrderMaterial(index, 'inventoryId', e.target.value)}
                  >
                    <option value="">-- Tự nhập thủ công --</option>
                    {filaments.map((f: Filament) => (
                      <option key={f.id} value={f.id}>
                        {f.brand} {f.type} - {f.colorName} ({f.weight ?? 1000}g)
                      </option>
                    ))}
                  </select>

                  {!mat.inventoryId && (
                    <>
                      <Input 
                        type="text" 
                        required 
                        className="w-20 sm:w-24"
                        value={mat.type} 
                        onChange={e => handleUpdateOrderMaterial(index, 'type', e.target.value)} 
                        placeholder="Loại nhựa" 
                      />
                      <Input 
                        type="text" 
                        required 
                        className="w-20 sm:w-24"
                        value={mat.color} 
                        onChange={e => handleUpdateOrderMaterial(index, 'color', e.target.value)} 
                        placeholder="Màu" 
                      />
                    </>
                  )}

                  {newOrder.materials.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveOrderMaterial(index)} 
                      className="p-1.5 opacity-50 hover:opacity-100 text-red-400 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={handleAddOrderMaterial} 
                className="text-[11px] sm:text-xs font-semibold text-orange-500 hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
              >
                <PlusCircle size={12} />
                <span>Thêm loại nhựa khác</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-inherit">
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Số lượng *</label>
                <Input 
                  required 
                  type="number" 
                  min="1" 
                  className="font-bold"
                  value={newOrder.quantity} 
                  onChange={e => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) || 1 })} 
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Thành tiền (VNĐ) *</label>
                <Input 
                  required 
                  type="number" 
                  min="0" 
                  className="font-bold"
                  value={newOrder.price} 
                  onChange={e => setNewOrder({ ...newOrder, price: e.target.value })} 
                  placeholder="0" 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="default"
              size="lg"
              className="w-full mt-3"
            >
              Tạo Đơn Hàng
            </Button>
          </form>
        ) : (
          /* Add Filament Form */
          <form onSubmit={handleAddFilament} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Hãng sản xuất</label>
                <select
                  className="w-full h-9 px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 outline-none"
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
                  className="w-full h-9 px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 outline-none"
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
                  <Input 
                    type="text" 
                    required
                    value={newFilament.colorName}
                    onChange={e => setNewFilament({ ...newFilament, colorName: e.target.value })}
                    placeholder="VD: Đỏ Ruby..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold opacity-70 mb-1">Số lượng cuộn</label>
                  <select
                    className="w-full h-9 px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 outline-none"
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
                onClick={handleAddVariation}
                className="text-[11px] sm:text-xs font-semibold text-purple-500 hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
              >
                <PlusCircle size={12} />
                <span>Thêm màu này vào danh sách</span>
              </button>
            </div>

            {pendingVariations.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-inherit">
                <div className="text-[11px] font-semibold opacity-70">
                  Sẽ nhập ({pendingVariations.reduce((acc: number, curr: any) => acc + curr.quantity, 0)} cuộn):
                </div>
                {pendingVariations.map((v: any) => (
                  <div key={v.id} className="flex justify-between items-center text-xs p-1.5 px-2.5 rounded-lg bg-black/5 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: v.colorHex }} />
                      <span className="font-semibold">{v.colorName}</span>
                      <span className="opacity-60 text-[11px]">x{v.quantity}</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveVariation(v.id)} className="text-red-400 cursor-pointer">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Button 
              type="submit" 
              variant="purple"
              size="lg"
              className="w-full mt-3"
            >
              Nhập {pendingVariations.length > 0 ? `${pendingVariations.reduce((acc: number, curr: any) => acc + curr.quantity, 0)} cuộn ` : ''}Vào Kho
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
