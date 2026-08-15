import React, { useEffect, useRef, useState } from 'react'
import { Lock, Zap, Sun, Moon, ShieldAlert, X } from 'lucide-react'
import LiquidGlass from 'liquid-glass-react'
import gsap from 'gsap'

interface LoginScreenProps {
  theme: 'dark' | 'light'
  authError?: string
  toggleTheme: (e?: React.MouseEvent) => void
  googleClientId: string
  onCredentialResponse: (response: any) => void
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  theme,
  authError,
  toggleTheme,
  googleClientId,
  onCredentialResponse
}) => {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (authError) {
      setDismissed(false)
    }
  }, [authError])

  const containerRef = useRef<HTMLDivElement>(null)
  const googleBtnRef = useRef<HTMLDivElement>(null)
  const googleCustomBgRef = useRef<HTMLDivElement>(null)
  const titleGradientRef = useRef<HTMLSpanElement>(null)
  const badge3DRef = useRef<HTMLSpanElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const orb3Ref = useRef<HTMLDivElement>(null)
  const isDark = theme === 'dark'

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
          filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.6))',
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }

      if (googleCustomBgRef.current) {
        gsap.to(googleCustomBgRef.current, {
          backgroundPosition: '200% center',
          duration: 4,
          repeat: -1,
          ease: 'linear'
        })
      }

      // GSAP Floating Aurora Orbs
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          x: 40,
          y: 35,
          scale: 1.15,
          duration: 8,
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
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          x: 30,
          y: -30,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }
    })

    return () => ctx.revert()
  }, [isDark])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    let retries = 0

    const initGoogleGsi = () => {
      if ((window as any).google?.accounts?.id) {
        const cid = googleClientId || 'YOUR_GOOGLE_CLIENT_ID'
        try {
          ;(window as any).google.accounts.id.initialize({
            client_id: cid,
            callback: onCredentialResponse,
            auto_select: false
          })

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = ''
            ;(window as any).google.accounts.id.renderButton(googleBtnRef.current, {
              theme: isDark ? 'filled_black' : 'outline',
              size: 'large',
              shape: 'pill',
              text: 'signin_with',
              width: '225'
            })
          }
        } catch (err) {
          console.warn('Google GSI init warning:', err)
        }
        if (timer) clearInterval(timer)
      } else if (retries < 25) {
        retries++
      } else {
        if (timer) clearInterval(timer)
      }
    }

    initGoogleGsi()
    timer = setInterval(initGoogleGsi, 300)

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [googleClientId, theme, isDark, onCredentialResponse])

  return (
    <div
      ref={containerRef}
      className={`${
        isDark
          ? 'bg-[#09090b] text-zinc-100'
          : 'bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-rose-50/70 text-zinc-900'
      } min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden transition-colors duration-500 select-none`}
    >
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <div
          className={`absolute inset-0 [background-size:28px_28px] ${
            isDark
              ? 'bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] opacity-60'
              : 'bg-[radial-gradient(rgba(249,115,22,0.15)_1px,transparent_1px)] opacity-70'
          }`}
        />

        <div
          ref={orb1Ref}
          className='absolute top-[-10%] left-[-5%] w-[55vw] h-[55vw] min-w-[380px] min-h-[380px] bg-gradient-to-br from-orange-500/35 via-rose-500/25 to-amber-400/20 rounded-full filter blur-[100px]'
        />
        <div
          ref={orb2Ref}
          className='absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] min-w-[420px] min-h-[420px] bg-gradient-to-tl from-purple-600/30 via-violet-500/25 to-rose-500/20 rounded-full filter blur-[120px]'
        />
        <div
          ref={orb3Ref}
          className='absolute top-[30%] right-[15%] w-[35vw] h-[35vw] min-w-[260px] min-h-[260px] bg-gradient-to-tr from-cyan-500/20 via-pink-500/20 to-orange-400/25 rounded-full filter blur-[85px]'
        />

        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-gradient-to-r from-orange-500/25 via-rose-500/15 to-amber-500/15 rounded-full filter blur-[70px]' />
      </div>

      <LiquidGlass
        mouseContainer={containerRef}
        displacementScale={50}
        blurAmount={0.28}
        saturation={130}
        aberrationIntensity={1.5}
        elasticity={0.22}
        cornerRadius={28}
        overLight={false}
        mode='standard'
        padding='32px 28px'
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
          style={{ font: 'inherit' }}
        >
          <div className='absolute top-[-14px] right-[-10px] z-20 flex items-center gap-1.5'>
            {(import.meta.env.VITE_BYPASS_AUTH === 'true' || import.meta.env.DEV) && (
              <button
                type='button'
                title='Đăng nhập nhanh Dev Mode'
                onClick={() => {
                  const devPayload = {
                    name: 'Dev Admin',
                    email: 'admin@example.com',
                    picture: '',
                    sub: 'dev-mode'
                  }
                  localStorage.setItem('3dManager_user', JSON.stringify(devPayload))
                  window.location.reload()
                }}
                className='p-1.5 rounded-full border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-md hover:bg-orange-500/20 hover:border-orange-500/40 active:scale-90 text-orange-400 transition-all cursor-pointer shadow-sm flex items-center gap-0.5 text-[10px] font-bold'
              >
                <Zap size={11} className='text-amber-500 fill-amber-500' />
                <span className='pr-0.5 text-[9px]'>DEV</span>
              </button>
            )}

            <button
              type='button'
              onClick={toggleTheme}
              title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
              aria-label='Toggle theme'
              className='relative inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-all duration-300 focus:outline-none cursor-pointer shadow-sm border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/30 backdrop-blur-md hover:border-orange-500/40'
            >
              <span
                className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full shadow-sm transition-transform duration-300 ${
                  isDark
                    ? 'translate-x-5 bg-zinc-900/90 text-amber-400 border border-white/15'
                    : 'translate-x-0 bg-white/95 text-orange-500 border border-orange-200/80 shadow-sm'
                }`}
              >
                {isDark ? (
                  <Moon size={11} className='fill-amber-400 text-amber-400' />
                ) : (
                  <Sun size={11} className='text-orange-500 fill-orange-400' />
                )}
              </span>
            </button>
          </div>

          <div className='w-20 h-20 mx-auto rounded-2xl p-[2px] bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 shadow-lg shadow-orange-500/25 mb-4 transform hover:scale-105 transition-transform duration-300'>
            <img src='/logo.png' alt='Morri 3D Logo' className='w-full h-full object-cover rounded-[14px]' />
          </div>

          <div className='flex items-center justify-center gap-1 mb-1'>
            <h2 className='text-4xl font-black tracking-tight select-none flex items-center'>
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
                <span className='text-white tracking-tight drop-shadow-md flex items-center select-none'>
                  <span>Morri</span>
                  <span className='ml-2 text-white font-black'>3D</span>
                </span>
              )}
            </h2>
          </div>

          <div className='w-full space-y-3 mt-2 flex flex-col items-center'>
            <div className='relative w-[225px] h-[42px] rounded-full overflow-hidden group cursor-pointer shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all duration-300 active:scale-[0.98] border border-white/20 dark:border-white/15 [clip-path:inset(0_round_9999px)]'>
              <div
                ref={googleCustomBgRef}
                className='absolute inset-0 rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-300'
                style={{
                  background: 'linear-gradient(90deg, #f97316 0%, #fb923c 25%, #f43f5e 50%, #fbbf24 75%, #f97316 100%)',
                  backgroundSize: '200% auto'
                }}
              />

              <div className='absolute inset-0 rounded-full bg-white/10 dark:bg-black/30 backdrop-blur-md flex items-center justify-center gap-2.5 px-3.5 transition-all group-hover:bg-white/15 dark:group-hover:bg-white/5'>
                <div className='w-[19px] h-[19px] rounded-full bg-white/95 flex items-center justify-center p-0.5 shadow-sm flex-shrink-0'>
                  <svg className='w-full h-full' viewBox='0 0 24 24'>
                    <path
                      fill='#4285F4'
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    />
                    <path
                      fill='#34A853'
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    />
                    <path
                      fill='#FBBC05'
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z'
                    />
                    <path
                      fill='#EA4335'
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z'
                    />
                  </svg>
                </div>
                <span className='text-[13px] font-bold text-white tracking-wide select-none drop-shadow-sm'>
                  Đăng nhập Google
                </span>
              </div>

              <div
                ref={googleBtnRef}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer overflow-hidden rounded-full flex items-center justify-center z-10'
              />
            </div>

            <div
              className={`flex items-center justify-center gap-1 text-[11px] font-medium ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              <Lock size={11} />
              <span>Đăng nhập an toàn qua Google OAuth</span>
            </div>
          </div>
        </div>
      </LiquidGlass>

      {authError && !dismissed && (
        <div
          className={`fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-32px)] sm:w-auto p-3.5 rounded-2xl border backdrop-blur-2xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-start gap-3 select-none ${
            isDark
              ? 'bg-zinc-950/90 border-rose-500/30 text-zinc-100 shadow-black/80'
              : 'bg-white/95 border-rose-200 text-zinc-900 shadow-xl shadow-rose-500/10'
          }`}
        >
          <div className='p-2 rounded-xl bg-rose-500/15 text-rose-500 flex-shrink-0 mt-0.5 border border-rose-500/20'>
            <ShieldAlert size={18} />
          </div>
          <div className='flex-1 min-w-0 pr-1'>
            <div className='font-bold text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5'>
              <span>Không có quyền truy cập</span>
            </div>
            <div className='text-[11px] opacity-80 mt-0.5 leading-snug'>{authError}</div>
          </div>
          <button
            type='button'
            onClick={() => setDismissed(true)}
            className='p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer text-inherit'
            title='Đóng'
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
