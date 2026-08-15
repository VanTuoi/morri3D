import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  List, 
  Database, 
  PlusCircle, 
  Settings, 
  RefreshCw, 
  User, 
  Sun, 
  Moon
} from 'lucide-react';
import { UserInfo } from '../../types';

interface SidebarProps {
  theme: 'dark' | 'light';
  onToggleTheme: (e?: React.MouseEvent) => void;
  user: UserInfo | null;
  gasUrl: string;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  ordersCount: number;
  filamentsCount: number;
  onOpenSettings: () => void;
  onRefresh: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  theme,
  onToggleTheme,
  user,
  gasUrl,
  syncStatus,
  ordersCount,
  filamentsCount,
  onOpenSettings,
  onRefresh
}) => {
  const isDark = theme === 'dark';

  const navItems = [
    {
      to: '/',
      label: 'Tổng quan',
      icon: Home,
      badge: null,
      end: true
    },
    {
      to: '/orders',
      label: 'Đơn hàng',
      icon: List,
      badge: ordersCount > 0 ? ordersCount : null,
      end: false
    },
    {
      to: '/inventory',
      label: 'Kho nhựa in',
      icon: Database,
      badge: filamentsCount > 0 ? filamentsCount : null,
      end: false
    },
    {
      to: '/add',
      label: 'Tạo mới & Nhập kho',
      icon: PlusCircle,
      badge: null,
      end: false
    },
  ];

  return (
    <aside className={`hidden md:flex flex-col w-64 flex-shrink-0 border-r transition-colors duration-200 select-none ${
      isDark 
        ? 'bg-[#0e0e11] border-zinc-800/80 text-zinc-200' 
        : 'bg-zinc-50/80 border-zinc-200 text-zinc-800'
    }`}>
      {/* Brand Header */}
      <div className="p-4 border-b border-inherit flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl p-[1.5px] bg-gradient-to-tr from-amber-500 to-rose-500 shadow-sm flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-[10px]" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-sm tracking-tight flex items-center leading-none">
              <span>Morri</span>
              <span className="text-orange-500 ml-1">3D</span>
            </h1>
            <span className={`text-[11px] font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Order Manager
            </span>
          </div>
        </div>

        <button 
          onClick={onToggleTheme}
          className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
            isDark 
              ? 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:bg-zinc-700' 
              : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
          }`}
          title={isDark ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className={`px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
          isDark ? 'text-zinc-500' : 'text-zinc-400'
        }`}>
          Menu chính
        </div>

        {navItems.map(item => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-zinc-800 text-white shadow-sm font-bold'
                    : 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80 font-bold'
                  : isDark
                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} className={isActive ? 'text-orange-500 stroke-[2.4]' : 'opacity-70 stroke-[2]'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                      isActive
                        ? 'bg-orange-500/20 text-orange-400'
                        : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Quick Sync & Database Widget */}
      <div className="p-3 border-t border-inherit space-y-2">
        <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
          isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
              syncStatus === 'syncing' 
                ? 'bg-amber-400 animate-ping' 
                : gasUrl ? 'bg-emerald-400' : 'bg-zinc-400'
            }`} />
            <span className="font-semibold truncate text-[11px]">
              {gasUrl ? 'Google Sheets' : 'Cục bộ (Local)'}
            </span>
          </div>

          <button 
            onClick={onRefresh}
            disabled={syncStatus === 'syncing'}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            title="Đồng bộ lại"
          >
            <RefreshCw size={13} className={syncStatus === 'syncing' ? 'animate-spin text-orange-500' : ''} />
          </button>
        </div>

        {/* User Account Bar */}
        <div 
          onClick={onOpenSettings}
          className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
            isDark 
              ? 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80' 
              : 'bg-white border-zinc-200 hover:bg-zinc-100'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {user?.picture ? (
              <img src={user.picture} alt="Avatar" className="w-6 h-6 rounded-full border border-inherit object-cover flex-shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-bold text-[11px] truncate leading-tight">{user?.name || 'Dev Admin'}</div>
              <div className="text-[9px] opacity-60 truncate">{user?.email || 'dev@local'}</div>
            </div>
          </div>

          <Settings size={13} className="opacity-50 flex-shrink-0 ml-1" />
        </div>
      </div>
    </aside>
  );
};
