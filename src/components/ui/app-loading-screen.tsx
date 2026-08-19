import React, { useEffect, useRef } from 'react'
import { RefreshCw, AlertTriangle, LogOut } from 'lucide-react'
import LiquidGlass from 'liquid-glass-react'
import gsap from 'gsap'

interface AppLoadingScreenProps {
  theme: 'dark' | 'light'
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error'
  syncMessage?: string
  gasUrl?: string
  onRetry: () => void
  onSaveGasUrl?: (newUrl: string) => void
  onLogout: () => void
}

export const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({
  theme,
  syncStatus,
  syncMessage,
  onRetry,
  onLogout
}) => {
  const isDark = theme === 'dark'
  const isError = syncStatus === 'error'

  const containerRef = useRef<HTMLDivElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const orb3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: 40,
          y: 35,
          scale: 1.15,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          x: -50,
          y: -40,
          scale: 1.1,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          x: 30,
          y: -30,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 select-none overflow-hidden ${
        isDark
          ? 'bg-[#09090b] text-zinc-100'
          : 'bg-gradient-to-br from-orange-100/90 via-[#fff3ea] to-amber-100/80 text-zinc-900'
      }`}
    >
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div
          ref={orb1Ref}
          className={`absolute top-1/4 left-1/4 w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-[100px] pointer-events-none transition-opacity duration-1000 ${
            isError
              ? 'bg-rose-500/20'
              : isDark
                ? 'bg-gradient-to-tr from-amber-600/20 to-orange-500/25'
                : 'bg-gradient-to-tr from-amber-400/35 to-orange-400/40'
          }`}
        />
        <div
          ref={orb2Ref}
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-[110px] pointer-events-none transition-opacity duration-1000 ${
            isError
              ? 'bg-red-500/20'
              : isDark
                ? 'bg-gradient-to-bl from-orange-600/20 to-amber-600/15'
                : 'bg-gradient-to-bl from-orange-300/35 to-amber-300/40'
          }`}
        />
        <div
          ref={orb3Ref}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72 rounded-full blur-[90px] pointer-events-none transition-opacity duration-1000 ${
            isError ? 'bg-amber-600/15' : isDark ? 'bg-amber-500/15' : 'bg-orange-400/30'
          }`}
        />
      </div>

      <LiquidGlass
        mouseContainer={containerRef}
        displacementScale={45}
        blurAmount={0.3}
        saturation={130}
        aberrationIntensity={1.2}
        elasticity={0.2}
        cornerRadius={32}
        overLight={false}
        mode='standard'
        padding='36px 28px'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%'
        }}
      >
        <div
          className={`w-[300px] sm:w-[340px] flex flex-col items-center text-center font-sans relative ${
            isDark ? 'text-zinc-100' : 'text-zinc-900'
          }`}
        >
          {!isError ? (
            <>
              {/* Logo with animations */}
              <div className='relative w-28 h-28 sm:w-32 sm:h-32 mb-6 flex items-center justify-center'>
                <div className='absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 to-orange-500/30 blur-xl animate-pulse' />

                <div className='absolute inset-0 rounded-full p-[3px] animate-spin [animation-duration:3s]'>
                  <div className='w-full h-full rounded-full border-3 border-transparent border-t-amber-500 border-r-orange-500' />
                </div>

                <div className='absolute inset-2 rounded-full animate-spin [animation-duration:5s] [animation-direction:reverse]'>
                  <div className='w-full h-full rounded-full border-2 border-dashed border-transparent border-b-rose-400 border-l-amber-400 opacity-80' />
                </div>

                <div className='absolute inset-4 rounded-full border-2 border-orange-500/30 animate-ping [animation-duration:2.5s]' />

                <div className='relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-2xl p-[2px] bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 shadow-lg shadow-orange-500/30 flex items-center justify-center overflow-hidden'>
                  <img
                    src='/logo.png'
                    alt='Morri 3D Logo'
                    className='w-full h-full object-cover rounded-[14px] transform hover:scale-105 transition-transform duration-300'
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                  <span className='absolute inset-0 flex items-center justify-center font-black text-white text-lg tracking-wider pointer-events-none drop-shadow-md'>
                    3D
                  </span>
                </div>
              </div>

              {/* Title / Loading Text */}
              <h2 className='text-xl sm:text-2xl font-black tracking-tight mb-1'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 animate-pulse'>
                  Đang tải dữ liệu...
                </span>
              </h2>

              <p className='text-xs opacity-60 font-medium'>{syncMessage || 'Vui lòng chờ trong giây lát'}</p>
            </>
          ) : (
            <>
              {/* Error Icon */}
              <div className='relative w-24 h-24 sm:w-28 sm:h-28 mb-5 flex items-center justify-center'>
                <div className='absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse' />
                <div className='w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 border-red-500/40 bg-red-500/10 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/20'>
                  <AlertTriangle size={42} className='animate-bounce [animation-duration:2s]' />
                </div>
              </div>

              {/* Error Title & Message */}
              <h2 className='text-xl sm:text-2xl font-black tracking-tight mb-2 text-red-500'>
                Không thể kết nối máy chủ
              </h2>

              <p className='text-xs sm:text-sm opacity-75 max-w-xs mb-6 font-medium leading-relaxed'>
                {syncMessage || 'Không thể tải dữ liệu từ Google Sheets. Vui lòng kiểm tra lại kết nối mạng.'}
              </p>

              {/* Action Buttons */}
              <div className='w-full space-y-2.5'>
                <button
                  type='button'
                  onClick={onRetry}
                  className='w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer'
                >
                  <RefreshCw size={16} />
                  <span>Thử lại ngay</span>
                </button>

                <button
                  type='button'
                  onClick={onLogout}
                  className='w-full py-2.5 px-4 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer'
                >
                  <LogOut size={14} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </>
          )}
        </div>
      </LiquidGlass>

      <div className='fixed bottom-4 left-1/2 -translate-x-1/2 text-center text-xs opacity-50 font-medium z-10'>
        <span>Morri 3D Printing Management System</span>
      </div>
    </div>
  )
}
