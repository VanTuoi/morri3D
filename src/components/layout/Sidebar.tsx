import React, { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Layers, PlusCircle, Settings, RefreshCw, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import type { UserInfo } from '~/types'

interface SidebarProps {
  theme: 'dark' | 'light'
  user: UserInfo | null
  gasUrl: string
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error'
  ordersCount: number
  filamentsCount: number
  onOpenSettings: () => void
  onRefresh: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  theme,
  user,
  gasUrl,
  syncStatus,
  ordersCount,
  filamentsCount,
  onOpenSettings,
  onRefresh
}) => {
  const isDark = theme === 'dark'

  const titleGradientRef = useRef<HTMLSpanElement>(null)
  const badge3DRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!isDark) return

    const ctx = gsap.context(() => {
      if (titleGradientRef.current) {
        gsap.to(titleGradientRef.current, {
          backgroundPosition: '200% center',
          duration: 4,
          repeat: -1,
          ease: 'linear'
        })
      }

      if (badge3DRef.current) {
        gsap.to(badge3DRef.current, {
          backgroundPosition: '200% center',
          duration: 3,
          repeat: -1,
          ease: 'linear'
        })
        gsap.to(badge3DRef.current, {
          filter: 'drop-shadow(0 0 6px rgba(249, 115, 22, 0.6))',
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }
    })

    return () => ctx.revert()
  }, [isDark])

  const navItems = [
    {
      to: '/',
      label: 'Tổng quan',
      icon: LayoutDashboard,
      badge: null,
      end: true
    },
    {
      to: '/orders',
      label: 'Đơn hàng',
      icon: Package,
      badge: ordersCount > 0 ? ordersCount : null,
      end: false
    },
    {
      to: '/inventory',
      label: 'Kho nhựa in',
      icon: Layers,
      badge: filamentsCount > 0 ? filamentsCount : null,
      end: false
    },
    {
      to: '/add',
      label: 'Tạo mới & Nhập kho',
      icon: PlusCircle,
      badge: null,
      end: false
    }
  ]

  return (
    <aside
      className={`hidden md:flex flex-col w-64 flex-shrink-0 border-r transition-all duration-300 select-none relative overflow-hidden backdrop-blur-2xl ${
        isDark
          ? 'bg-[#0c0c0e]/95 border-white/10 text-zinc-200 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-[#ff6b00] via-[#f97316] to-[#ea580c] text-white border-orange-600/40 shadow-2xl shadow-orange-500/20'
      }`}
    >
      <div
        className={`absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none ${
          isDark ? 'opacity-15' : 'opacity-35'
        }`}
      />
      <div
        className={`absolute -top-12 -left-12 w-52 h-52 rounded-full filter blur-[45px] pointer-events-none ${
          isDark ? 'bg-orange-500/15' : 'bg-white/15'
        }`}
      />
      <div
        className={`absolute bottom-16 -right-12 w-56 h-56 rounded-full filter blur-[50px] pointer-events-none ${
          isDark ? 'bg-amber-500/10' : 'bg-amber-300/20'
        }`}
      />

      <div
        className={`p-4 border-b flex items-center justify-between relative z-10 ${
          isDark ? 'border-white/10' : 'border-white/15'
        }`}
      >
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-md shadow-black/20'>
            <img src='/logo.png' alt='Logo' className='w-full h-full object-cover rounded-xl' />
          </div>
          <div className='min-w-0'>
            <h1 className='font-black text-3xl tracking-tight flex items-center leading-none select-none'>
              {isDark ? (
                <>
                  <span
                    ref={titleGradientRef}
                    className='bg-clip-text text-transparent inline-block'
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, #ffffff 0%, #f97316 25%, #fbbf24 50%, #f43f5e 75%, #ffffff 100%)',
                      backgroundSize: '200% auto'
                    }}
                  >
                    Morri
                  </span>
                  <span
                    ref={badge3DRef}
                    className='ml-1.5 bg-clip-text text-transparent inline-block font-black tracking-wider'
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, #ff6b00 0%, #ff8800 25%, #ff0055 50%, #ffa600 75%, #ff6b00 100%)',
                      backgroundSize: '200% auto'
                    }}
                  >
                    3D
                  </span>
                </>
              ) : (
                <>
                  <span className='text-white drop-shadow-sm'>Morri</span>
                  <span className='ml-1.5 px-1.5 py-0.5 rounded-md font-black text-[11px] shadow-sm bg-white text-orange-600'>
                    3D
                  </span>
                </>
              )}
            </h1>
          </div>
        </div>
      </div>

      <div className='flex-1 p-3 space-y-1.5 overflow-y-auto relative z-10 scrollbar-hide'>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${
            isDark ? 'text-orange-400' : 'text-amber-200'
          }`}
        >
          <Sparkles size={11} />
          <span>Menu chính</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white font-black shadow-lg shadow-orange-500/30 scale-[1.02] border border-orange-400/30'
                      : 'bg-white text-orange-600 font-black shadow-lg shadow-black/15 scale-[1.02] border border-white/80'
                    : isDark
                      ? 'text-zinc-400 font-semibold hover:text-orange-400 hover:bg-orange-500/10'
                      : 'text-white/85 font-bold hover:text-white hover:bg-white/15 hover:backdrop-blur-sm'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className='flex items-center gap-2.5'>
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? isDark
                            ? 'text-white stroke-[2.6]'
                            : 'text-orange-600 stroke-[2.6]'
                          : isDark
                            ? 'opacity-70 stroke-[2]'
                            : 'text-white/90 stroke-[2]'
                      }
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black transition-all ${
                        isActive
                          ? isDark
                            ? 'bg-white/25 text-white backdrop-blur-sm shadow-inner'
                            : 'bg-orange-500 text-white shadow-sm'
                          : isDark
                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                            : 'bg-white/20 text-white shadow-inner backdrop-blur-sm'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      <div className={`p-3 border-t relative z-10 ${isDark ? 'border-white/10' : 'border-white/15'}`}>
        <div
          className={`p-2.5 rounded-2xl border backdrop-blur-2xl transition-all duration-200 shadow-lg ${
            isDark
              ? 'bg-zinc-900/80 border-white/10 hover:border-orange-500/30 text-zinc-200'
              : 'border-white/20 bg-black/15 hover:bg-black/25 text-white'
          }`}
        >
          <div
            onClick={onOpenSettings}
            className={`flex items-center justify-between cursor-pointer group pb-2 border-b ${
              isDark ? 'border-white/10' : 'border-white/15'
            }`}
          >
            <div className='flex items-center gap-2.5 min-w-0'>
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt='Avatar'
                  className={`w-7 h-7 rounded-full object-cover flex-shrink-0 group-hover:scale-105 transition-transform ${
                    isDark ? 'border border-orange-500/30' : 'border-2 border-white/60'
                  }`}
                />
              ) : (
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm ${
                    isDark
                      ? 'bg-gradient-to-tr from-orange-500 via-amber-500 to-rose-500 text-white shadow-orange-500/25'
                      : 'bg-white text-orange-600'
                  }`}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className='min-w-0'>
                <div
                  className={`font-black text-xs truncate leading-tight transition-colors ${
                    isDark ? 'group-hover:text-orange-400' : 'group-hover:text-amber-200'
                  }`}
                >
                  {user?.name || 'Tài khoản'}
                </div>
                <div className={`text-[10px] truncate font-medium ${isDark ? 'text-zinc-400' : 'text-orange-100/80'}`}>
                  {user?.email || 'Chế độ khách'}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onOpenSettings()
              }}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isDark
                  ? 'opacity-60 hover:opacity-100 hover:bg-orange-500/10 text-zinc-400 hover:text-orange-400'
                  : 'opacity-80 hover:opacity-100 hover:bg-white/20 text-white'
              }`}
              title='Cài đặt tài khoản & dữ liệu'
            >
              <Settings size={14} />
            </button>
          </div>

          <div className='flex items-center justify-between pt-2 px-0.5'>
            <div className='flex items-center gap-1.5 min-w-0'>
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  !gasUrl
                    ? 'bg-zinc-400 dark:bg-zinc-600'
                    : syncStatus === 'syncing'
                      ? 'bg-amber-300 animate-ping'
                      : syncStatus === 'error'
                        ? 'bg-rose-400'
                        : 'bg-emerald-400'
                }`}
              />
              <span className={`text-[11px] font-medium truncate ${isDark ? 'text-zinc-400' : 'text-orange-100/90'}`}>
                {!gasUrl
                  ? 'Chưa kết nối'
                  : syncStatus === 'syncing'
                    ? 'Đang đồng bộ...'
                    : syncStatus === 'error'
                      ? 'Lỗi đồng bộ'
                      : 'Đã đồng bộ'}
              </span>
            </div>

            {gasUrl && (
              <button
                onClick={onRefresh}
                disabled={syncStatus === 'syncing'}
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg active:scale-95 transition-all cursor-pointer disabled:opacity-50 ${
                  isDark
                    ? 'text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20'
                    : 'text-white bg-white/20 hover:bg-white/30 font-black'
                }`}
                title='Đồng bộ lại dữ liệu'
              >
                <RefreshCw size={11} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
                <span>Làm mới</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
