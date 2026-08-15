export interface OrderMaterial {
  inventoryId: string;
  type: string;
  color: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  itemName: string;
  materials?: OrderMaterial[];
  material?: string;
  color?: string;
  quantity: number;
  price: number;
  status: string;
  date: string;
}

export interface Filament {
  id: string;
  brand: string;
  customBrand?: string;
  type: string;
  colorHex: string;
  colorName: string;
  weight?: number;
  percentage?: number;
  quantity?: number;
  date: string;
}

export interface UserInfo {
  name: string;
  email: string;
  picture: string;
  sub?: string;
}

export const STATUSES = {
  PENDING: 'Chờ in',
  PRINTING: 'Đang in',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy'
};

export const STATUS_COLORS: Record<string, string> = {
  [STATUSES.PENDING]: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  [STATUSES.PRINTING]: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
  [STATUSES.COMPLETED]: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  [STATUSES.CANCELLED]: 'bg-red-800/40 text-red-300 border border-red-800/50'
};

export const INITIAL_ORDERS: Order[] = [];

export const BASIC_COLORS = [
  { name: 'Đỏ', hex: '#ef4444' },
  { name: 'Xanh lá', hex: '#22c55e' },
  { name: 'Xanh dương', hex: '#3b82f6' },
  { name: 'Vàng', hex: '#eab308' },
  { name: 'Cam', hex: '#f97316' },
  { name: 'Hồng', hex: '#ec4899' },
  { name: 'Trắng', hex: '#ffffff' },
  { name: 'Đen', hex: '#000000' },
];

export const DEFAULT_GAS_URL = import.meta.env.VITE_GAS_URL || 'https://script.google.com/macros/s/AKfycbzheMtGxwI6WMysOJNFyfNCkjowSSNz1urWAyI78fOz1_MPHWs3fNPyqifEQgVLte0mHA/exec';
export const DEFAULT_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '578947535957-4m0bb7ivjoqag82ehh70scehvodsue79.apps.googleusercontent.com';

export const ALLOWED_EMAILS: string[] = (import.meta.env.VITE_ALLOWED_EMAILS || '')
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year?.slice(2) || ''}`;
};

export function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}
