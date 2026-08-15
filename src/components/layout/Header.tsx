import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Settings, 
  RefreshCw, 
  Sun, 
  Moon, 
  Plus
} from 'lucide-react';
import { UserInfo } from '../../types';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: (e?: React.MouseEvent) => void;
  user: UserInfo | null;
  gasUrl: string;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  onOpenSettings: () => void;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  user,
  gasUrl,
  syncStatus,
  onOpenSettings,
  onRefresh
}) => {
  const isDark = theme === 'dark';
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/orders':
        return 'Quản lý Đơn hàng';
      case '/inventory':
        return 'Kho Nhựa In 3D';
      case '/add':
        return 'Tạo Đơn Hàng / Nhập Kho';
      case '/':
      default:
        return 'Tổng quan hệ thống';
    }
  };

  const isAddPage = location.pathname === '/add';

  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b backdrop-blur-xl transition-colors select-none ${
      isDark 
        ? 'bg-[#09090b]/80 border-zinc-800/80 text-zinc-100' 
        : 'bg-white/80 border-zinc-200/80 text-zinc-900'
    }`}>
      {/* Left: Mobile Brand & Desktop Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile Logo Branding */}
        <Link to="/" className="flex items-center gap-2.5 md:hidden cursor-pointer">
          <div className="w-8 h-8 rounded-xl p-[1px] bg-gradient-to-tr from-amber-500 to-rose-500 flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-[9px]" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight flex items-center">
              <span>Morri</span>
              <span className="text-orange-500 ml-1">3D</span>
            </h1>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                gasUrl ? (syncStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400') : 'bg-zinc-500'
              }`} />
              <span className="text-[10px] opacity-60 font-medium">
                {gasUrl ? 'Online DB' : 'Offline'}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Title / Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-sm font-semibold">
          <span className="opacity-50 font-normal">Morri 3D</span>
          <span className="opacity-30">/</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{getPageTitle(location.pathname)}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {!isAddPage && (
          <button
            onClick={() => navigate('/add')}
            className="hidden sm:flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Thêm mới</span>
          </button>
        )}

        {/* Sync trigger */}
        {gasUrl && (
          <button
            onClick={onRefresh}
            disabled={syncStatus === 'syncing'}
            className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-700'
            }`}
            title="Đồng bộ Google Sheets"
          >
            <RefreshCw size={15} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
          </button>
        )}

        {/* Theme Toggle Button (Mobile only, desktop is on sidebar) */}
        <button
          onClick={onToggleTheme}
          className={`md:hidden p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
          }`}
          title="Chuyển đổi giao diện sáng/tối"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 hover:bg-zinc-200 text-zinc-700'
          }`}
          title="Cài đặt tài khoản & dữ liệu"
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
};
