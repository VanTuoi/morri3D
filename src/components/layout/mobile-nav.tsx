import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Layers, PlusCircle } from 'lucide-react'
import LiquidGlass from 'liquid-glass-react'

interface MobileNavProps {
  theme: 'dark' | 'light'
  ordersCount: number
}

export const MobileNav: React.FC<MobileNavProps> = ({ theme, ordersCount }) => {
  const isDark = theme === 'dark'
  const location = useLocation()

  const tabs = [
    { to: '/', label: 'Tổng quan', icon: LayoutDashboard, end: true },
    { to: '/orders', label: 'Đơn hàng', icon: Package, badge: ordersCount, end: false },
    { to: '/inventory', label: 'Kho nhựa', icon: Layers, end: false },
    { to: '/add', label: 'Tạo mới', icon: PlusCircle, end: false }
  ]

  const activeIndex = tabs.findIndex((tab) => {
    if (tab.end) return location.pathname === tab.to
    return location.pathname.startsWith(tab.to)
  })

  return (
    <div className='md:hidden'>
      <div
        className={`fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-30 bg-gradient-to-t ${
          isDark ? 'from-[#09090b] via-[#09090b]/60' : 'from-[#fff3ea] via-[#fff3ea]/60'
        } to-transparent`}
      />

      <LiquidGlass
        displacementScale={45}
        blurAmount={0.38}
        saturation={135}
        aberrationIntensity={1.8}
        elasticity={0.22}
        cornerRadius={26}
        overLight={false}
        mode='standard'
        padding='8px 10px'
        style={{
          position: 'fixed',
          top: 'calc(100dvh - 50px)',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 40
        }}
      >
        <nav
          className={`relative w-[calc(100vw-36px)] max-w-sm grid grid-cols-4 select-none font-sans p-1 rounded-[22px] border transition-colors duration-300 ${
            isDark
              ? 'bg-zinc-950/75 border-white/15 text-zinc-400 shadow-2xl shadow-black/80'
              : 'bg-white/85 border-white/70 text-zinc-600 shadow-2xl shadow-orange-500/15'
          }`}
          style={{ font: 'inherit' }}
        >
          {activeIndex !== -1 && (
            <div
              className='absolute top-1 bottom-1 transition-all duration-[460ms] ease-[cubic-bezier(0.05,0.9,0.1,1)] rounded-xl bg-gradient-to-tr from-orange-500/20 via-amber-500/15 to-rose-500/15 border border-orange-500/35 shadow-sm shadow-orange-500/10 pointer-events-none'
              style={{
                left: `calc(${activeIndex} * 25% + 4px)`,
                width: 'calc(25% - 8px)'
              }}
            />
          )}

          {tabs.map((tab) => {
            const Icon = tab.icon

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className='flex flex-col items-center justify-center py-3 px-1 rounded-xl text-[10px] font-bold transition-all duration-200 relative cursor-pointer z-10'
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`relative flex items-center justify-center mb-0.5 transition-transform duration-300 ${
                        isActive ? 'scale-110 -translate-y-0.5 text-orange-500' : 'text-zinc-400 dark:text-zinc-400'
                      }`}
                    >
                      <Icon size={19} className={isActive ? 'stroke-[2.5] text-orange-500' : 'stroke-[2]'} />
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className='absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-sm'>
                          {tab.badge}
                        </span>
                      )}
                    </div>

                    <span
                      className={`truncate leading-tight transition-colors duration-200 ${
                        isActive ? 'text-orange-500 font-black' : 'text-zinc-500 dark:text-zinc-400 font-medium'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>
      </LiquidGlass>
    </div>
  )
}
