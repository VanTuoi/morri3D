import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, Database, PlusCircle } from 'lucide-react';

interface MobileNavProps {
  theme: 'dark' | 'light';
  ordersCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  theme,
  ordersCount
}) => {
  const isDark = theme === 'dark';

  const tabs = [
    { to: '/', label: 'Tổng quan', icon: Home, end: true },
    { to: '/orders', label: 'Đơn hàng', icon: List, badge: ordersCount, end: false },
    { to: '/inventory', label: 'Kho nhựa', icon: Database, end: false },
    { to: '/add', label: 'Tạo mới', icon: PlusCircle, end: false },
  ];

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-safe pb-3 pt-2 pointer-events-none bg-gradient-to-t ${
      isDark ? 'from-[#09090b] via-[#09090b]/80' : 'from-[#fafafa] via-[#fafafa]/80'
    } to-transparent`}>
      <nav className={`pointer-events-auto max-w-sm mx-auto p-1.5 grid grid-cols-4 gap-1 rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all duration-300 ${
        isDark 
          ? 'bg-zinc-900/85 border-white/10 shadow-black/60 text-zinc-400' 
          : 'bg-white/90 border-zinc-200 shadow-orange-500/15 text-zinc-600'
      }`}>
        {tabs.map(tab => {
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-bold transition-all duration-200 relative cursor-pointer ${
                isActive
                  ? 'text-orange-500 bg-orange-500/10 dark:bg-orange-500/15 font-black'
                  : 'hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 opacity-75 hover:opacity-100'
              }`}
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex items-center justify-center mb-0.5">
                    <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-inherit">
                        {tab.badge}
                      </span>
                    )}
                  </div>

                  <span className="truncate leading-tight">
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
