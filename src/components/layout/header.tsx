import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Settings, RefreshCw } from 'lucide-react'
import gsap from 'gsap'

interface HeaderProps {
    theme: 'dark' | 'light'
    gasUrl: string
    syncStatus: 'idle' | 'syncing' | 'synced' | 'error'
    onOpenSettings: () => void
    onRefresh: () => void
}

export const Header: React.FC<HeaderProps> = ({ theme, gasUrl, syncStatus, onOpenSettings, onRefresh }) => {
    const isDark = theme === 'dark'

    const titleGradientRef = useRef<HTMLSpanElement>(null)
    const badge3DRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
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
    }, [])

    return (
        <header
            className={`md:hidden sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 header-safe-top pb-3.5 border-b backdrop-blur-xl transition-colors select-none ${
                isDark
                    ? 'bg-[#09090b]/80 border-zinc-800/80 text-zinc-100'
                    : 'bg-white/80 border-zinc-200/80 text-zinc-900'
            }`}
        >
            <div className='flex items-center gap-3'>
                <Link to='/' className='flex items-center gap-2.5 md:hidden cursor-pointer group'>
                    <div className='w-8 h-8 rounded-xl overflow-hidden shadow-md shadow-orange-500/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300'>
                        <img src='/logo.png' alt='Logo' className='w-full h-full object-cover rounded-xl' />
                    </div>
                    <div>
                        <h1 className='font-black text-sm leading-tight flex items-center select-none'>
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
                                        className='ml-1 bg-clip-text text-transparent inline-block font-black tracking-wider'
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
                                    <span className='text-zinc-900'>Morri</span>
                                    <span className='ml-1 px-1 py-0.2 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] shadow-sm'>
                                        3D
                                    </span>
                                </>
                            )}
                        </h1>
                        <div className='flex items-center gap-1.5'>
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                    !gasUrl
                                        ? 'bg-zinc-400 dark:bg-zinc-600'
                                        : syncStatus === 'syncing'
                                          ? 'bg-amber-400 animate-ping'
                                          : syncStatus === 'error'
                                            ? 'bg-rose-500'
                                            : 'bg-emerald-400'
                                }`}
                            />
                            <span className='text-[10px] opacity-70 font-medium'>
                                {!gasUrl
                                    ? 'Chưa kết nối'
                                    : syncStatus === 'syncing'
                                      ? 'Đang đồng bộ...'
                                      : syncStatus === 'error'
                                        ? 'Lỗi đồng bộ'
                                        : 'Đã đồng bộ'}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>

            <div className='flex items-center gap-2.5'>
                <div
                    className={`flex md:hidden items-center gap-1 p-1 rounded-full border backdrop-blur-2xl shadow-lg transition-all duration-300 ${
                        isDark
                            ? 'bg-white/[0.06] border-white/15 text-zinc-300 shadow-black/40'
                            : 'bg-black/[0.04] border-black/10 text-zinc-700 shadow-orange-500/5'
                    }`}
                >
                    {gasUrl && (
                        <button
                            onClick={onRefresh}
                            disabled={syncStatus === 'syncing'}
                            className='w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer opacity-80 hover:opacity-100'
                            title='Đồng bộ Google Sheets'
                        >
                            <RefreshCw
                                size={14}
                                className={syncStatus === 'syncing' ? 'animate-spin text-orange-500' : ''}
                            />
                        </button>
                    )}

                    <button
                        onClick={onOpenSettings}
                        className='w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer opacity-80 hover:opacity-100'
                        title='Cài đặt tài khoản & dữ liệu'
                    >
                        <Settings size={14} />
                    </button>
                </div>
            </div>
        </header>
    )
}
