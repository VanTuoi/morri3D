import React, { useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  List, 
  PlusCircle, 
  Settings, 
  Search, 
  Printer, 
  Box, 
  CheckCircle, 
  Clock, 
  X,
  Database,
  Palette,
  Trash2,
  Save,
  Weight
} from 'lucide-react';

const STATUSES = {
  PENDING: 'Chờ in',
  PRINTING: 'Đang in',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy'
};

const STATUS_COLORS = {
  [STATUSES.PENDING]: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  [STATUSES.PRINTING]: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
  [STATUSES.COMPLETED]: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  [STATUSES.CANCELLED]: 'bg-red-800/40 text-red-300 border border-red-800/50'
};

const INITIAL_ORDERS = [
  {
    id: '3D-001',
    customerName: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    itemName: 'Mô hình Iron Man 20cm',
    materials: [{ inventoryId: '', type: 'PLA+', color: 'Đỏ' }],
    quantity: 1,
    price: 350000,
    status: STATUSES.PRINTING,
    date: '2026-08-14'
  },
  {
    id: '3D-002',
    customerName: 'Trần Thị B',
    phone: '0912345678',
    address: '45 Lê Duẩn, Hải Châu, Đà Nẵng',
    itemName: 'Vỏ hộp Raspberry Pi',
    materials: [{ inventoryId: '', type: 'PETG', color: 'Đen' }],
    quantity: 5,
    price: 500000,
    status: STATUSES.PENDING,
    date: '2026-08-14'
  },
  {
    id: '3D-003',
    customerName: 'Lê Văn C',
    phone: '0987654321',
    address: '88 Trần Phú, Ba Đình, Hà Nội',
    itemName: 'Bánh răng thay thế',
    materials: [{ inventoryId: '', type: 'ABS', color: 'Trắng' }],
    quantity: 2,
    price: 120000,
    status: STATUSES.COMPLETED,
    date: '2026-08-13'
  }
];

const BASIC_COLORS = [
  { name: 'Đỏ', hex: '#ef4444' },
  { name: 'Xanh lá', hex: '#22c55e' },
  { name: 'Xanh dương', hex: '#3b82f6' },
  { name: 'Vàng', hex: '#eab308' },
  { name: 'Cam', hex: '#f97316' },
  { name: 'Hồng', hex: '#ec4899' },
  { name: 'Trắng', hex: '#ffffff' },
  { name: 'Đen', hex: '#000000' },
];

const getInitialOrders = () => {
  const saved = localStorage.getItem('3dManager_orders');
  if (saved) return JSON.parse(saved);
  return INITIAL_ORDERS;
};

const getInitialFilaments = () => {
  const saved = localStorage.getItem('3dManager_filaments');
  if (saved) return JSON.parse(saved);
  return [];
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year.slice(2)}`;
};

export default function App() {
  const [orders, setOrders] = useState(getInitialOrders);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Theme state: 'dark' or 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('3dManager_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('3dManager_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  // States cho Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // States cho Inventory
  const [filaments, setFilaments] = useState(getInitialFilaments);
  const [addMode, setAddMode] = useState('order'); // 'order' or 'filament'
  const [newFilament, setNewFilament] = useState({
    brand: 'Bambu Lab', customBrand: '', type: 'PLA Basic', quantity: 1, colorHex: '#ef4444', colorName: 'Đỏ'
  });
  const [pendingVariations, setPendingVariations] = useState([]);
  
  // States cho Filament Modal (Chỉnh sửa/Xóa)
  const [selectedFilament, setSelectedFilament] = useState(null);
  const [isFilamentModalOpen, setIsFilamentModalOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState(null);

  // States cho đơn hàng mới
  const [newOrder, setNewOrder] = useState({
    customerName: '', phone: '', address: '', itemName: '', quantity: 1, price: '', materials: [{ inventoryId: '', type: 'PLA', color: '' }]
  });

  // Tự động lưu LocalStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('3dManager_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('3dManager_filaments', JSON.stringify(filaments));
  }, [filaments]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, searchQuery]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    // Doanh thu chỉ tính trên các đơn hàng có trạng thái HOÀN THÀNH
    const revenue = orders.filter(o => o.status === STATUSES.COMPLETED)
                          .reduce((sum, o) => sum + Number(o.price), 0);
    const printing = orders.filter(o => o.status === STATUSES.PRINTING).length;
    const pending = orders.filter(o => o.status === STATUSES.PENDING).length;
    return { totalOrders, revenue, printing, pending };
  }, [orders]);

  // Logic Đơn Hàng
  const handleAddOrder = (e) => {
    e.preventDefault();
    const orderToAdd = {
      ...newOrder,
      id: `3D-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      price: Number(newOrder.price),
      status: STATUSES.PENDING,
      date: new Date().toISOString().split('T')[0]
    };
    setOrders([orderToAdd, ...orders]);
    setNewOrder({ customerName: '', phone: '', address: '', itemName: '', quantity: 1, price: '', materials: [{ inventoryId: '', type: 'PLA', color: '' }] });
    setActiveTab('orders');
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedOrder) return;
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
    setSelectedOrder(null);
    setIsOrderModalOpen(false);
    setShowDeleteConfirm(false);
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
    setShowDeleteConfirm(false);
  };

  const handleDeleteOrder = (id) => {
    setOrders(orders.filter(o => o.id !== id));
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
    setShowDeleteConfirm(false);
  };

  const handleAddOrderMaterial = () => {
    setNewOrder({
      ...newOrder,
      materials: [...newOrder.materials, { inventoryId: '', type: '', color: '' }]
    });
  };

  const handleUpdateOrderMaterial = (index, field, value) => {
    const updatedMaterials = [...newOrder.materials];
    updatedMaterials[index][field] = value;
    
    // Tự động điền dữ liệu nếu chọn từ kho nhựa
    if (field === 'inventoryId' && value) {
      const selectedFilament = filaments.find(f => f.id === value);
      if (selectedFilament) {
        updatedMaterials[index].type = `${selectedFilament.brand} ${selectedFilament.type}`;
        updatedMaterials[index].color = selectedFilament.colorName;
      }
    } else if (field === 'inventoryId' && !value) {
      updatedMaterials[index].type = '';
      updatedMaterials[index].color = '';
    }
    
    setNewOrder({ ...newOrder, materials: updatedMaterials });
  };

  const handleRemoveOrderMaterial = (index) => {
    const updatedMaterials = newOrder.materials.filter((_, i) => i !== index);
    setNewOrder({ ...newOrder, materials: updatedMaterials });
  };

  // Logic Nhựa (Filament)
  const handleAddVariation = () => {
    setPendingVariations([...pendingVariations, {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      quantity: newFilament.quantity,
      colorHex: newFilament.colorHex,
      colorName: newFilament.colorName
    }]);
  };

  const handleRemoveVariation = (id) => {
    setPendingVariations(pendingVariations.filter(v => v.id !== id));
  };

  const handleAddFilament = (e) => {
    e.preventDefault();
    const finalBrand = newFilament.brand === 'Khác' ? newFilament.customBrand : newFilament.brand;
    
    let variationsToProcess = [...pendingVariations];
    
    if (variationsToProcess.length === 0) {
      variationsToProcess = [{
         quantity: newFilament.quantity,
         colorHex: newFilament.colorHex,
         colorName: newFilament.colorName
      }];
    }

    const newItems = [];
    variationsToProcess.forEach((variation, index) => {
      // Tách từng cuộn nhựa ra riêng để quản lý trọng lượng riêng biệt
      for(let i = 0; i < variation.quantity; i++) {
        newItems.push({
          id: `PL-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${index}-${i}`,
          brand: finalBrand || 'Chưa rõ',
          type: newFilament.type,
          colorHex: variation.colorHex,
          colorName: variation.colorName,
          weight: 1000, // Mặc định 1000g khi mới nhập
          date: new Date().toISOString().split('T')[0]
        });
      }
    });

    setFilaments([...newItems, ...filaments]);
    setNewFilament({ brand: 'Bambu Lab', customBrand: '', type: 'PLA Basic', quantity: 1, colorHex: '#ef4444', colorName: 'Đỏ' });
    setPendingVariations([]);
    setActiveTab('inventory');
  };

  const openFilamentModal = (filament) => {
    setSelectedFilament(filament);
    const currentWeight = filament.weight ?? (filament.percentage !== undefined ? filament.percentage * 10 : 1000);
    setEditingFilament({ ...filament, weight: currentWeight });
    setIsFilamentModalOpen(true);
  };

  const handleSaveFilamentEdit = () => {
    setFilaments(filaments.map(f => f.id === editingFilament.id ? editingFilament : f));
    setIsFilamentModalOpen(false);
  };

  const handleDeleteFilament = () => {
    setFilaments(filaments.filter(f => f.id !== editingFilament.id));
    setIsFilamentModalOpen(false);
  };

  const renderDashboard = () => (
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

  const renderOrders = () => (
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
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-24 scrollbar-hide">
        {filteredOrders.length === 0 ? (
          <div className={`text-center ${theme === 'light' ? 'text-gray-500 bg-white/70 border-gray-200' : 'text-gray-400 bg-white/5 border-white/5'} mt-10 p-6 backdrop-blur-md rounded-2xl border`}>Không tìm thấy đơn hàng nào.</div>
        ) : (
          filteredOrders.map(order => (
            <div 
              key={order.id} 
              onClick={() => openOrderModal(order)}
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
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium shadow-sm ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
              </div>
              
              <div className={`text-sm mb-3 flex items-center flex-wrap gap-1 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-700' : 'bg-black/20 border-white/5 text-gray-300'} w-fit px-3 py-1.5 rounded-lg border`}>
                <Box size={14} className={`mr-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} /> 
                {order.materials && order.materials.length > 0 
                  ? order.materials.map(m => `${m.type} (${m.color})`).join(', ')
                  : `${order.material} • ${order.color}`}
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

  const renderInventory = () => (
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
                onClick={() => openFilamentModal(item)}
                className={`${theme === 'light' ? 'bg-white/80 border-gray-200 hover:bg-white text-gray-900' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-100'} backdrop-blur-xl p-4 rounded-[1.5rem] shadow-lg flex items-center gap-4 transition-all cursor-pointer group`}
              >
                {/* Vòng tròn màu sắc cố định */}
                <div className={`w-12 h-12 rounded-full border-2 ${theme === 'light' ? 'border-gray-200' : 'border-white/20'} shadow-inner flex-shrink-0 flex items-center justify-center`}
                     style={{ backgroundColor: item.colorHex }}>
                  <div className="w-4 h-4 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: item.colorHex }}></div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold">{item.brand} • {item.type}</h4>
                  <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mt-0.5`}>Màu: {item.colorName}</div>
                </div>
                
                {/* Nút cục tạ có hiệu ứng dung lượng xuy giảm đồng bộ */}
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

  const renderAdd = () => (
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
        <form onSubmit={handleAddOrder} className="space-y-5 animate-in slide-in-from-left-4">
          <div className={`${theme === 'light' ? 'bg-white/80 border-gray-200 text-gray-900 shadow-md' : 'bg-white/5 border-white/10 text-gray-100 shadow-lg'} backdrop-blur-xl p-5 rounded-[1.5rem] space-y-4 border`}>
            <h3 className={`font-semibold ${theme === 'light' ? 'text-rose-600 border-gray-200' : 'text-rose-200 border-white/10'} border-b pb-3 flex items-center`}>
              <div className="w-2 h-2 rounded-full bg-rose-400 mr-2 shadow-[0_0_8px_rgba(251,113,133,0.8)]"></div>
              Thông tin khách hàng
            </h3>
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Tên khách hàng</label>
              <input required type="text" className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-black/20 border-white/10 text-white placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-orange-400/50 outline-none transition-all`} 
                value={newOrder.customerName} onChange={e => setNewOrder({...newOrder, customerName: e.target.value})} placeholder="Nhập tên..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Số điện thoại</label>
                <input required type="tel" inputMode="numeric" pattern="[0-9]*" className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-black/20 border-white/10 text-white placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-orange-400/50 outline-none transition-all`} 
                  value={newOrder.phone} onChange={e => setNewOrder({...newOrder, phone: e.target.value})} placeholder="Nhập số điện thoại..." />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Địa chỉ</label>
                <input required type="text" className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400' : 'bg-black/20 border-white/10 text-white placeholder-gray-500'} border rounded-xl focus:ring-2 focus:ring-orange-400/50 outline-none transition-all`} 
                  value={newOrder.address} onChange={e => setNewOrder({...newOrder, address: e.target.value})} placeholder="Nhập địa chỉ giao hàng..." />
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
                value={newOrder.itemName} onChange={e => setNewOrder({...newOrder, itemName: e.target.value})} placeholder="Ví dụ: Mô hình Pokemon, Bánh răng..." />
            </div>
            
            <div className={`${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-black/20 border-white/5'} p-4 rounded-xl border space-y-3`}>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-pink-600' : 'text-pink-200'} mb-2 flex items-center`}>
                <Palette size={16} className="mr-1.5" /> Chọn Nhựa & Màu Sắc
              </label>
              
              {newOrder.materials.map((mat, index) => (
                <div key={index} className={`flex flex-col gap-2 ${theme === 'light' ? 'bg-white border-gray-200 shadow-sm' : 'bg-white/5 border-white/15'} p-3 rounded-lg border relative group`}>
                  <div className="w-full pr-8">
                    <label className={`block text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Chọn từ kho nhựa</label>
                    <select className={`w-full p-2.5 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/30 border-white/10 text-white'} border rounded-lg focus:ring-2 focus:ring-orange-400/50 outline-none appearance-none text-sm transition-all`}
                      value={mat.inventoryId} onChange={e => handleUpdateOrderMaterial(index, 'inventoryId', e.target.value)}>
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
                          value={mat.type} onChange={e => handleUpdateOrderMaterial(index, 'type', e.target.value)} placeholder="VD: PLA, Resin..." />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-1`}>Tên màu</label>
                        <input type="text" required className={`w-full p-2.5 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/30 border-white/10 text-white'} border rounded-lg focus:ring-2 focus:ring-orange-400/50 outline-none text-sm transition-all`} 
                          value={mat.color} onChange={e => handleUpdateOrderMaterial(index, 'color', e.target.value)} placeholder="Nhập màu..." />
                      </div>
                    </div>
                  )}
                  
                  {newOrder.materials.length > 1 && (
                    <button type="button" onClick={() => handleRemoveOrderMaterial(index)} className={`absolute right-3 top-3 ${theme === 'light' ? 'text-gray-400 hover:text-rose-600 bg-gray-100' : 'text-gray-500 hover:text-rose-400 bg-black/20'} p-1 rounded-md transition-colors border border-transparent`}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              <button type="button" onClick={handleAddOrderMaterial} className={`w-full py-2.5 rounded-lg ${theme === 'light' ? 'bg-white border-gray-200 text-orange-600 hover:bg-orange-50' : 'bg-white/5 border-white/10 text-orange-200 hover:bg-orange-500/20'} transition-all font-medium text-sm flex items-center justify-center mt-2 shadow-sm border`}>
                <PlusCircle size={16} className="mr-2" /> Thêm loại nhựa khác
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Số lượng</label>
                <input required type="number" min="1" className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-orange-400/50 outline-none transition-all`} 
                  value={newOrder.quantity} onChange={e => setNewOrder({...newOrder, quantity: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Thành tiền (VNĐ)</label>
                <input required type="number" min="0" className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-orange-400/50 outline-none transition-all`} 
                  value={newOrder.price} onChange={e => setNewOrder({...newOrder, price: e.target.value})} placeholder="0" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 text-gray-900 font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(251,146,60,0.4)] hover:shadow-[0_0_30px_rgba(251,146,60,0.6)] transition-all flex items-center justify-center transform active:scale-95 border border-white/40">
            <PlusCircle size={22} className="mr-2" />
            Tạo Đơn Hàng Mới
          </button>
        </form>
      ) : (
        <form onSubmit={handleAddFilament} className="space-y-5 animate-in slide-in-from-right-4">
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
                onChange={e => setNewFilament({...newFilament, brand: e.target.value})}
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
                  onChange={e => setNewFilament({...newFilament, customBrand: e.target.value})}
                />
              </div>
            )}

            <div className={`grid grid-cols-1 gap-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/5'} pb-4`}>
              <div>
                <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-1.5`}>Loại nhựa</label>
                <select
                  className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-purple-400/50 outline-none appearance-none transition-all`}
                  value={newFilament.type}
                  onChange={e => setNewFilament({...newFilament, type: e.target.value})}
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
                      onClick={() => setNewFilament({...newFilament, colorHex: color.hex, colorName: color.name})}
                      className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${newFilament.colorHex === color.hex ? 'border-gray-900 dark:border-white scale-110 shadow-[0_0_12px_rgba(0,0,0,0.3)]' : 'border-transparent hover:scale-105 opacity-80 hover:opacity-100'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  <div className={`relative w-8 h-8 rounded-full border-2 border-dashed ${theme === 'light' ? 'border-gray-400' : 'border-white/30'} overflow-hidden flex items-center justify-center hover:opacity-100 transition-all opacity-80`}>
                    <input type="color" className="absolute inset-[-10px] w-12 h-12 cursor-pointer opacity-0"
                      value={newFilament.colorHex}
                      onChange={e => setNewFilament({...newFilament, colorHex: e.target.value})}
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
                      onChange={e => setNewFilament({...newFilament, colorName: e.target.value})}
                      placeholder="Nhập tên màu..."
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} mb-1.5`}>3. Số lượng</label>
                  <select
                    className={`w-full h-[42px] p-2.5 ${theme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-white/5 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-purple-400/50 outline-none appearance-none transition-all`}
                    value={newFilament.quantity}
                    onChange={e => setNewFilament({...newFilament, quantity: parseInt(e.target.value)})}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i+1} className={theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} value={i+1}>{i + 1} cuộn</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={handleAddVariation}
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
                    <button type="button" onClick={() => handleRemoveVariation(v.id)} className={`${theme === 'light' ? 'text-gray-400 hover:text-rose-600 bg-gray-100' : 'text-gray-500 hover:text-rose-400 bg-white/5'} p-1 rounded-lg transition-colors`}>
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

  const renderOrderModal = () => {
    if (!isOrderModalOpen || !selectedOrder) return null;

    return (
      <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOrderModalOpen(false)}></div>
        
        <div className={`relative ${theme === 'light' ? 'bg-white/90 text-gray-900 border-gray-200' : 'bg-[#1c1c1e]/80 text-gray-100 border-white/10'} backdrop-blur-2xl w-full h-[85%] sm:h-auto sm:max-h-[90%] sm:w-[400px] sm:rounded-[2rem] rounded-t-[2.5rem] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 border overflow-hidden`}>
          {showDeleteConfirm && (
            <div className={`absolute inset-0 z-50 ${theme === 'light' ? 'bg-white/95 text-gray-900' : 'bg-[#1c1c1e]/95 text-gray-100'} backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-in zoom-in-95 duration-200 rounded-t-[2.5rem] sm:rounded-[2rem]`}>
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <Trash2 size={32} className="text-red-400" />
              </div>
              <h4 className="text-xl font-bold mb-2">Xóa đơn hàng?</h4>
              <p className={`text-center mb-8 text-sm px-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                Bạn có chắc chắn muốn xóa đơn hàng <span className="text-rose-500 dark:text-rose-300 font-bold">#{selectedOrder.id}</span> không? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`flex-1 py-3.5 rounded-xl border ${theme === 'light' ? 'border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-700' : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300'} font-medium transition-colors`}
                >
                  Quay lại
                </button>
                <button 
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
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
              <span>Đơn #{selectedOrder.id}</span>
            </h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 transition-colors border border-red-500/20"
                title="Xóa đơn hàng"
              >
                <Trash2 size={20} />
              </button>
              <button onClick={() => setIsOrderModalOpen(false)} className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200' : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/5'} transition-colors border`}>
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6 z-10 scrollbar-hide">
            <div>
              <label className="text-xs text-rose-600 dark:text-rose-300/80 font-medium uppercase tracking-wider block mb-1">
                Ngày tạo: {formatDate(selectedOrder.date)}
              </label>
              <div className="text-2xl font-bold">{selectedOrder.itemName}</div>
              <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-2 flex flex-wrap gap-2 items-center`}>
                {selectedOrder.materials ? (
                  selectedOrder.materials.map((m, i) => (
                    <span key={i} className={`${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-800' : 'bg-white/5 border-white/5 text-gray-200'} px-3 py-1.5 rounded-lg border flex items-center`}>
                      <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400 mr-2"></div>
                      {m.type} <span className={`mx-1 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>|</span> {m.color}
                    </span>
                  ))
                ) : (
                  <span className={`${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-white/5 border-white/5'} px-3 py-1.5 rounded-lg border`}>
                    {selectedOrder.material} <span className={`mx-1 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>|</span> {selectedOrder.color}
                  </span>
                )}
                <span className="bg-orange-500/10 text-orange-600 dark:text-orange-200 px-3 py-1.5 rounded-lg border border-orange-500/20 font-bold shadow-sm">
                  SL: {selectedOrder.quantity}
                </span>
              </div>
            </div>
            
            <div className={`grid grid-cols-2 gap-4 ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-black/20 border-white/5'} p-4 rounded-2xl border shadow-inner`}>
              <div className="col-span-2 sm:col-span-1">
                <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} font-medium mb-1 block`}>Khách hàng</label>
                <div className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{selectedOrder.customerName}</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} font-medium mb-1 block`}>Điện thoại</label>
                <div className="font-medium text-orange-600 dark:text-orange-300">{selectedOrder.phone || 'Trống'}</div>
              </div>
              <div className={`col-span-2 border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/5'} pt-3 mt-1`}>
                <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} font-medium mb-1 block`}>Địa chỉ giao hàng</label>
                <div className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} text-sm`}>{selectedOrder.address || 'Không có thông tin địa chỉ'}</div>
              </div>
              <div className={`col-span-2 pt-2 border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/5'} mt-1`}>
                <label className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} font-medium mb-1 block`}>Tổng tiền</label>
                <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-600 dark:from-rose-300 dark:via-orange-300 dark:to-amber-200 text-xl">
                  {formatCurrency(selectedOrder.price)}
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
                  const isActive = selectedOrder.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(status)}
                      className={`py-3 px-3 text-sm font-medium rounded-xl border flex items-center justify-center transition-all ${
                        isActive 
                          ? 'border-orange-400/50 bg-gradient-to-br from-rose-500/20 to-orange-500/20 text-orange-600 dark:text-orange-200 shadow-[0_0_15px_rgba(251,146,60,0.15)] font-bold'
                          : `${theme === 'light' ? 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`
                      }`}
                    >
                      {status}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFilamentModal = () => {
    if (!isFilamentModalOpen || !editingFilament) return null;

    const availableBrands = Array.from(new Set([...["Bambu Lab", "Tinmorry", "eSun", "Stem"], editingFilament.brand]));
    const availableTypes = Array.from(new Set([...["PLA Matte", "PLA Basic", "PLA Silk", "PLA Lite", "PETG Matte", "PETG Basic"], editingFilament.type]));

    return (
      <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-200">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilamentModalOpen(false)}></div>
        
        <div className={`relative ${theme === 'light' ? 'bg-white/90 text-gray-900 border-gray-200' : 'bg-[#1c1c1e]/80 text-gray-100 border-white/10'} backdrop-blur-2xl w-full sm:max-w-[400px] sm:rounded-[2rem] rounded-t-[2.5rem] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 border overflow-hidden max-h-[90%] pb-safe`}>
          <div className={`flex justify-between items-center p-5 border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'} z-10`}>
            <h3 className="font-bold text-xl flex items-center">
              <Database size={20} className="mr-2 text-purple-500 dark:text-purple-400" />
              Chỉnh sửa cuộn nhựa
            </h3>
            <button onClick={() => setIsFilamentModalOpen(false)} className={`p-2 rounded-full ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200' : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/5'} transition-colors border`}>
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto space-y-5 z-10 scrollbar-hide pb-8">
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-1.5`}>Hãng sản xuất</label>
              <select 
                className={`w-full p-3 ${theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-black/20 border-white/10 text-white'} border rounded-xl focus:ring-2 focus:ring-purple-400/50 outline-none appearance-none transition-all`}
                value={editingFilament.brand}
                onChange={e => setEditingFilament({...editingFilament, brand: e.target.value})}
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
                onChange={e => setEditingFilament({...editingFilament, type: e.target.value})}
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
                    onChange={e => setEditingFilament({...editingFilament, colorHex: e.target.value})}
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
                  onChange={e => setEditingFilament({...editingFilament, colorName: e.target.value})}
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
                onChange={e => setEditingFilament({...editingFilament, weight: parseInt(e.target.value)})}
              />
              <div className={`flex justify-between text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} mt-2 font-medium`}>
                <span>0g (Hết)</span>
                <span>500g</span>
                <span>1000g (Đầy)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={handleDeleteFilament} className="py-3.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 font-bold flex items-center justify-center transition-colors">
                <Trash2 size={18} className="mr-2" /> Xóa Khỏi Kho
              </button>
              <button onClick={handleSaveFilamentEdit} className="py-3.5 rounded-xl border border-purple-500/30 text-white dark:text-purple-900 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 hover:shadow-[0_0_20px_rgba(192,132,252,0.4)] font-bold flex items-center justify-center transition-all">
                <Save size={18} className="mr-2" /> Lưu Lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${theme === 'light' ? 'bg-gradient-to-br from-amber-50 via-rose-50 to-orange-100 text-gray-900 selection:bg-orange-500/20' : 'bg-[#0a0a0c] text-gray-100 selection:bg-orange-500/30'} min-h-screen flex items-center justify-center sm:p-4 font-sans relative overflow-hidden transition-colors duration-500`}>
      
      {/* Enhanced Ambient Background Mesh & Glowing Orbs */}
      <div className="absolute top-[-15%] left-[-15%] w-[55vw] h-[55vw] min-w-[350px] min-h-[350px] bg-gradient-to-br from-rose-500/40 via-orange-500/25 to-pink-500/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '7s' }}></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[60vw] h-[60vw] min-w-[450px] min-h-[450px] bg-gradient-to-tl from-amber-500/30 via-rose-500/20 to-purple-500/25 rounded-full mix-blend-screen filter blur-[140px] animate-pulse pointer-events-none" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
      <div className="absolute top-[25%] left-[15%] w-[40vw] h-[40vw] min-w-[280px] min-h-[280px] bg-gradient-to-r from-orange-400/25 to-amber-300/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '11s', animationDelay: '4s' }}></div>
      
      {/* Subtle radial vignette & grid pattern overlay for professional depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none"></div>

      <div className={`${theme === 'light' ? 'bg-white/75 backdrop-blur-[50px] shadow-[0_20px_70px_rgba(251,146,60,0.18)] border-white/60' : 'bg-[#18181b]/70 backdrop-blur-[50px] shadow-[0_25px_80px_rgba(0,0,0,0.6)] border-white/10'} w-full sm:max-w-[420px] h-[100dvh] sm:h-[850px] sm:rounded-[3rem] relative overflow-hidden flex flex-col sm:border-[8px] ring-1 ring-white/10 z-10 transition-all duration-500`}>
        
        <header className="bg-transparent pt-12 pb-4 px-5 border-b border-black/5 dark:border-white/10 z-20 flex-shrink-0 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              {/* Morri 3D Printing Custom Badge Logo */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-0.5 shadow-[0_0_20px_rgba(251,146,60,0.5)] flex items-center justify-center mr-3 relative overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-amber-300 to-orange-400 rounded-[14px] flex items-center justify-center relative shadow-inner border border-white/50">
                  <span className="text-gray-900 font-black text-lg tracking-tighter drop-shadow-sm">M</span>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-400 rounded-full border border-white/80 shadow-sm"></div>
                </div>
              </div>
              <h1 className="text-sm font-bold tracking-tight flex items-center">
                Morri<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-600 dark:from-rose-300 dark:to-amber-200 ml-1 font-black">3D Printing</span>
              </h1>
            </div>
            <button 
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-2xl ${theme === 'light' ? 'bg-gray-200/80 border-gray-300 text-gray-700 hover:bg-gray-300' : 'bg-white/10 border-white/15 text-gray-200 hover:bg-white/20'} border flex items-center justify-center transition-all shadow-sm backdrop-blur-md cursor-pointer`}
              title="Chuyển đổi giao diện sáng/tối"
            >
              <Settings size={20} className="hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto relative z-10 pb-20">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'inventory' && renderInventory()}
          {activeTab === 'add' && renderAdd()}
        </main>

        <div className={`absolute bottom-0 w-full z-20 pb-safe sm:pb-4 px-4 pt-2 bg-gradient-to-t ${theme === 'light' ? 'from-white/95 via-white/85' : 'from-[#18181b] via-[#18181b]/95'} to-transparent`}>
          <nav className={`${theme === 'light' ? 'bg-white/90 border-gray-200 shadow-[0_-15px_35px_rgba(251,146,60,0.12)]' : 'bg-[#1c1c1e]/90 border-white/10 shadow-[0_-15px_35px_rgba(0,0,0,0.5)]'} backdrop-blur-3xl border px-2 py-2 flex justify-around items-center rounded-3xl mb-4 sm:mb-2 transition-all`}>
            
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 relative ${activeTab === 'dashboard' ? (theme === 'light' ? 'text-orange-600' : 'text-orange-200') : (theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300')}`}
            >
              {activeTab === 'dashboard' && <div className={`absolute inset-0 ${theme === 'light' ? 'bg-orange-500/10' : 'bg-white/10'} rounded-2xl blur-[2px]`}></div>}
              <Home size={22} className={`relative z-10 ${activeTab === 'dashboard' ? (theme === 'light' ? 'fill-orange-500/20 stroke-orange-600' : 'fill-orange-400/20 stroke-orange-300') : ''}`} />
              <span className="text-[10px] font-medium mt-1.5 relative z-10">Tổng quan</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 relative ${activeTab === 'orders' ? (theme === 'light' ? 'text-orange-600' : 'text-orange-200') : (theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300')}`}
            >
              {activeTab === 'orders' && <div className={`absolute inset-0 ${theme === 'light' ? 'bg-orange-500/10' : 'bg-white/10'} rounded-2xl blur-[2px]`}></div>}
              <List size={22} className={`relative z-10 ${activeTab === 'orders' ? (theme === 'light' ? 'fill-orange-500/20 stroke-orange-600' : 'fill-orange-400/20 stroke-orange-300') : ''}`} />
              <span className="text-[10px] font-medium mt-1.5 relative z-10">Đơn hàng</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('inventory')} 
              className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 relative ${activeTab === 'inventory' ? (theme === 'light' ? 'text-purple-600' : 'text-purple-200') : (theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300')}`}
            >
              {activeTab === 'inventory' && <div className={`absolute inset-0 ${theme === 'light' ? 'bg-purple-500/10' : 'bg-white/10'} rounded-2xl blur-[2px]`}></div>}
              <Database size={22} className={`relative z-10 ${activeTab === 'inventory' ? (theme === 'light' ? 'fill-purple-500/20 stroke-purple-600' : 'fill-purple-400/20 stroke-purple-300') : ''}`} />
              <span className="text-[10px] font-medium mt-1.5 relative z-10">Kho nhựa</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('add')} 
              className={`flex flex-col items-center p-2.5 rounded-2xl transition-all duration-300 relative ${activeTab === 'add' ? (theme === 'light' ? 'text-orange-600' : 'text-orange-200') : (theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300')}`}
            >
              <div className={`relative z-10 flex items-center justify-center transition-transform ${activeTab === 'add' ? 'scale-110' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 rounded-full blur-md opacity-50"></div>
                <div className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 text-gray-900 p-3 rounded-full relative z-10 border border-white/30 shadow-md">
                  <PlusCircle size={22} />
                </div>
              </div>
              <span className={`text-[10px] font-medium mt-1.5 relative z-10 ${activeTab === 'add' ? (theme === 'light' ? 'text-orange-600' : 'text-orange-300') : ''}`}>Thêm mới</span>
            </button>
          </nav>
        </div>

        {renderOrderModal()}
        {renderFilamentModal()}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .pb-safe {
            padding-bottom: env(safe-area-inset-bottom);
        }
      `}} />
    </div>
  );
}