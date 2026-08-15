import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { 
  Order, 
  Filament, 
  UserInfo, 
  STATUSES, 
  INITIAL_ORDERS, 
  DEFAULT_GAS_URL, 
  DEFAULT_GOOGLE_CLIENT_ID, 
  ALLOWED_EMAILS,
  parseJwt 
} from '../types';

export function useManagerData() {
  const [user, setUser] = useState<UserInfo | null>(() => {
    const saved = localStorage.getItem('3dManager_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [googleClientId, setGoogleClientId] = useState(() => {
    return localStorage.getItem('3dManager_google_client_id') || DEFAULT_GOOGLE_CLIENT_ID;
  });
  const [tempClientId, setTempClientId] = useState(googleClientId);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('3dManager_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [filaments, setFilaments] = useState<Filament[]>(() => {
    const saved = localStorage.getItem('3dManager_filaments');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'inventory' | 'add'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('3dManager_theme') as 'dark' | 'light') || 'dark';
  });

  const [gasUrl, setGasUrl] = useState(() => {
    const saved = localStorage.getItem('3dManager_gas_url');
    if (!saved || saved.includes('AKfycbyy1NEx0A68DSqfdJl11aLJ99CgymKyNBXjQ2P9sEFgYs75qEPvs2Vz9xlBxIDsyWKOwg') || saved.includes('AKfycbwlmtVsaOE8pHxtS2AyV62AK9GTBowBdwP7TBDXFevpVPkrXl774Ib_ckjNwL4eA0MjRw')) {
      return DEFAULT_GAS_URL;
    }
    return saved;
  });
  const [tempGasUrl, setTempGasUrl] = useState(gasUrl);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [addMode, setAddMode] = useState<'order' | 'filament'>('order');
  const [newFilament, setNewFilament] = useState({
    brand: 'Bambu Lab', customBrand: '', type: 'PLA Basic', quantity: 1, colorHex: '#ef4444', colorName: 'Đỏ'
  });
  const [pendingVariations, setPendingVariations] = useState<any[]>([]);
  
  const [selectedFilament, setSelectedFilament] = useState<Filament | null>(null);
  const [isFilamentModalOpen, setIsFilamentModalOpen] = useState(false);
  const [editingFilament, setEditingFilament] = useState<any>(null);

  const [newOrder, setNewOrder] = useState({
    customerName: '', phone: '', address: '', itemName: '', quantity: 1, price: '', materials: [{ inventoryId: '', type: 'PLA', color: '' }]
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    localStorage.setItem('3dManager_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('3dManager_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('3dManager_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('3dManager_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('3dManager_filaments', JSON.stringify(filaments));
  }, [filaments]);

  const [allowedEmails, setAllowedEmails] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('3dManager_allowed_emails');
      return saved ? JSON.parse(saved) : ALLOWED_EMAILS;
    } catch {
      return ALLOWED_EMAILS;
    }
  });

  const [authError, setAuthError] = useState('');

  const handleCredentialResponse = useCallback(async (response: any) => {
    if (response.credential) {
      const decoded = parseJwt(response.credential);
      if (decoded) {
        const userEmail = (decoded.email || '').toLowerCase().trim();
        let validEmails = allowedEmails;

        // Nếu có gasUrl, tải danh sách mới nhất từ Google Sheet để kiểm tra quyền truy cập theo thời gian thực
        if (gasUrl && gasUrl.startsWith('http')) {
          try {
            const res = await fetch(`${gasUrl}?action=getAll`, {
              method: 'GET',
              redirect: 'follow'
            });
            const resData = await res.json();
            if (resData.success && resData.data) {
              if (Array.isArray(resData.data.allowedEmails)) {
                validEmails = resData.data.allowedEmails;
                setAllowedEmails(validEmails);
                localStorage.setItem('3dManager_allowed_emails', JSON.stringify(validEmails));
              }
              if (Array.isArray(resData.data.orders) && resData.data.orders.length > 0) {
                setOrders(resData.data.orders);
              }
              if (Array.isArray(resData.data.filaments) && resData.data.filaments.length > 0) {
                setFilaments(resData.data.filaments);
              }
            }
          } catch (e) {
            console.warn('Không thể tải realtime từ Sheet, sử dụng danh sách offline:', e);
          }
        }

        const normalizedAllowed = validEmails.map(e => (e || '').toLowerCase().trim()).filter(Boolean);
        const fallbackAllowed = ALLOWED_EMAILS.map(e => (e || '').toLowerCase().trim()).filter(Boolean);
        const finalAllowedList = normalizedAllowed.length > 0 ? normalizedAllowed : fallbackAllowed;

        if (finalAllowedList.length > 0) {
          if (!finalAllowedList.includes(userEmail)) {
            setAuthError(`Email "${decoded.email}" không được cấp quyền truy cập hệ thống.`);
            return;
          }
        } else {
          setAuthError(`Chưa có email nào được cấp quyền trong Google Sheet (Tab "Users") hoặc bạn chưa Deploy phiên bản mới trên Apps Script.`);
          return;
        }

        setAuthError('');
        setUser({
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
          sub: decoded.sub
        });
      }
    }
  }, [allowedEmails, gasUrl]);

  const handleLogout = () => {
    setUser(null);
    setAuthError('');
    if ((window as any).google?.accounts?.id) {
      (window as any).google.accounts.id.disableAutoSelect();
    }
  };


  const fetchFromGoogleSheets = useCallback(async (customUrl?: string) => {
    const url = customUrl || gasUrl;
    if (!url || !url.startsWith('http')) return;

    setSyncStatus('syncing');
    setSyncMessage('Đang tải dữ liệu từ Google Sheet...');

    try {
      const response = await fetch(`${url}?action=getAll`, {
        method: 'GET',
        redirect: 'follow'
      });
      const res = await response.json();

      if (res.success && res.data) {
        if (Array.isArray(res.data.orders) && res.data.orders.length > 0) {
          setOrders(res.data.orders);
        }
        if (Array.isArray(res.data.filaments) && res.data.filaments.length > 0) {
          setFilaments(res.data.filaments);
        }
        if (Array.isArray(res.data.allowedEmails)) {
          setAllowedEmails(res.data.allowedEmails);
          localStorage.setItem('3dManager_allowed_emails', JSON.stringify(res.data.allowedEmails));

          const normEmails = res.data.allowedEmails.map((e: string) => (e || '').toLowerCase().trim()).filter(Boolean);
          if (normEmails.length > 0 && user && user.email) {
            const currentEmail = user.email.toLowerCase().trim();
            if (!normEmails.includes(currentEmail)) {
              setUser(null);
              localStorage.removeItem('3dManager_user');
              setAuthError(`Tài khoản "${user.email}" không còn trong danh sách được cấp quyền.`);
            }
          }
        }
        setSyncStatus('synced');
        setSyncMessage('Đã đồng bộ với Google Sheets');
      } else {
        setSyncStatus('error');
        setSyncMessage(res.error || 'Lỗi đọc dữ liệu Google Sheet');
      }
    } catch (err: any) {
      console.error('GAS Fetch Error:', err);
      setSyncStatus('error');
      setSyncMessage('Không thể kết nối tới Google Apps Script URL');
    }
  }, [gasUrl]);

  const pushToGoogleSheets = useCallback(async (ordersData: Order[], filamentsData: Filament[]) => {
    if (!gasUrl || !gasUrl.startsWith('http')) return;

    setSyncStatus('syncing');
    setSyncMessage('Đang lưu lên Google Sheet...');

    try {
      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'syncAll',
          data: {
            orders: ordersData,
            filaments: filamentsData
          }
        })
      });

      setSyncStatus('synced');
      setSyncMessage('Đã lưu lên Google Sheets');
    } catch (err: any) {
      console.error('GAS Push Error:', err);
      setSyncStatus('error');
      setSyncMessage('Lỗi đồng bộ lên Google Sheets');
    }
  }, [gasUrl]);

  useEffect(() => {
    if (gasUrl && user) {
      fetchFromGoogleSheets(gasUrl);
    }
  }, [user]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (gasUrl && user) {
      const timer = setTimeout(() => {
        pushToGoogleSheets(orders, filaments);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [orders, filaments, gasUrl, user, pushToGoogleSheets]);

  const handleSaveGasUrl = () => {
    const trimmed = tempGasUrl.trim();
    setGasUrl(trimmed);
    localStorage.setItem('3dManager_gas_url', trimmed);
    if (trimmed) {
      fetchFromGoogleSheets(trimmed);
    }

    const trimmedClientId = tempClientId.trim();
    setGoogleClientId(trimmedClientId);
    localStorage.setItem('3dManager_google_client_id', trimmedClientId);

    setIsSettingModalOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, searchQuery]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const revenue = orders.filter(o => o.status === STATUSES.COMPLETED)
                          .reduce((sum, o) => sum + Number(o.price || 0), 0);
    const printing = orders.filter(o => o.status === STATUSES.PRINTING).length;
    const pending = orders.filter(o => o.status === STATUSES.PENDING).length;
    return { totalOrders, revenue, printing, pending };
  }, [orders]);

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderToAdd: Order = {
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

  const handleUpdateStatus = (newStatus: string) => {
    if (!selectedOrder) return;
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
    setSelectedOrder(null);
    setIsOrderModalOpen(false);
    setShowDeleteConfirm(false);
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
    setShowDeleteConfirm(false);
  };

  const handleDeleteOrder = (id: string) => {
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

  const handleUpdateOrderMaterial = (index: number, field: string, value: string) => {
    const updatedMaterials = [...newOrder.materials];
    (updatedMaterials[index] as any)[field] = value;
    
    if (field === 'inventoryId' && value) {
      const selectedFil = filaments.find(f => f.id === value);
      if (selectedFil) {
        updatedMaterials[index].type = `${selectedFil.brand} ${selectedFil.type}`;
        updatedMaterials[index].color = selectedFil.colorName;
      }
    } else if (field === 'inventoryId' && !value) {
      updatedMaterials[index].type = '';
      updatedMaterials[index].color = '';
    }
    
    setNewOrder({ ...newOrder, materials: updatedMaterials });
  };

  const handleRemoveOrderMaterial = (index: number) => {
    const updatedMaterials = newOrder.materials.filter((_, i) => i !== index);
    setNewOrder({ ...newOrder, materials: updatedMaterials });
  };

  const handleAddVariation = () => {
    setPendingVariations([...pendingVariations, {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      quantity: newFilament.quantity,
      colorHex: newFilament.colorHex,
      colorName: newFilament.colorName
    }]);
  };

  const handleRemoveVariation = (id: string) => {
    setPendingVariations(pendingVariations.filter(v => v.id !== id));
  };

  const handleAddFilament = (e: React.FormEvent) => {
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

    const newItems: Filament[] = [];
    variationsToProcess.forEach((variation, index) => {
      for(let i = 0; i < variation.quantity; i++) {
        newItems.push({
          id: `PL-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${index}-${i}`,
          brand: finalBrand || 'Chưa rõ',
          type: newFilament.type,
          colorHex: variation.colorHex,
          colorName: variation.colorName,
          weight: 1000,
          date: new Date().toISOString().split('T')[0]
        });
      }
    });

    setFilaments([...newItems, ...filaments]);
    setNewFilament({ brand: 'Bambu Lab', customBrand: '', type: 'PLA Basic', quantity: 1, colorHex: '#ef4444', colorName: 'Đỏ' });
    setPendingVariations([]);
    setActiveTab('inventory');
  };

  const openFilamentModal = (filament: Filament) => {
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

  return {
    user,
    setUser,
    authError,
    allowedEmails,
    googleClientId,
    tempClientId,
    setTempClientId,
    handleCredentialResponse,
    handleLogout,
    theme,
    toggleTheme,
    gasUrl,
    tempGasUrl,
    setTempGasUrl,
    syncStatus,
    syncMessage,
    fetchFromGoogleSheets,
    pushToGoogleSheets,
    handleSaveGasUrl,
    orders,
    filaments,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredOrders,
    stats,
    newOrder,
    setNewOrder,
    handleAddOrder,
    handleUpdateStatus,
    openOrderModal,
    handleDeleteOrder,
    handleAddOrderMaterial,
    handleUpdateOrderMaterial,
    handleRemoveOrderMaterial,
    addMode,
    setAddMode,
    newFilament,
    setNewFilament,
    pendingVariations,
    handleAddVariation,
    handleRemoveVariation,
    handleAddFilament,
    selectedOrder,
    isOrderModalOpen,
    setIsOrderModalOpen,
    showDeleteConfirm,
    setShowDeleteConfirm,
    selectedFilament,
    isFilamentModalOpen,
    setIsFilamentModalOpen,
    editingFilament,
    setEditingFilament,
    openFilamentModal,
    handleSaveFilamentEdit,
    handleDeleteFilament,
    isSettingModalOpen,
    setIsSettingModalOpen
  };
}
