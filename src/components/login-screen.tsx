import React, { useEffect, useRef, useState } from 'react'
import { Lock, Zap, Sun, Moon, ShieldAlert, X, Cpu, Wifi } from 'lucide-react'
import gsap from 'gsap'

interface LoginScreenProps {
    theme: 'dark' | 'light'
    authError?: string
    toggleTheme: (e?: React.MouseEvent) => void
    googleClientId: string
    onCredentialResponse: (response: any) => void
}

// Animated HUD ring SVG
const HudRing = ({
    size,
    duration,
    reverse = false,
    color = '#22d3ee',
    opacity = 0.6,
    dashed = false
}: {
    size: number
    duration: number
    reverse?: boolean
    color?: string
    opacity?: number
    dashed?: boolean
}) => (
    <div
        className='absolute inset-0 rounded-full flex items-center justify-center pointer-events-none'
        style={{
            animation: `loginHudSpin ${duration}s linear infinite ${reverse ? 'reverse' : ''}`
        }}
    >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2 - 2}
                fill='none'
                stroke={color}
                strokeWidth={dashed ? 1 : 1.5}
                strokeDasharray={dashed ? '4 8' : `${size * 0.6} ${size * 2}`}
                opacity={opacity}
            />
        </svg>
    </div>
)

// Scan line effect
const ScanLines = () => (
    <div
        className='absolute inset-0 pointer-events-none overflow-hidden rounded-[28px]'
        style={{
            background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.015) 2px, rgba(34,211,238,0.015) 4px)',
            zIndex: 2
        }}
    />
)

// Corner brackets
const CornerBrackets = ({ isDark }: { isDark: boolean }) => {
    const color = isDark ? 'rgba(34,211,238,0.5)' : 'rgba(14,165,233,0.4)'
    const sz = 12
    const th = 2
    return (
        <>
            <div
                className='absolute top-3 left-3 pointer-events-none'
                style={{
                    width: sz,
                    height: sz,
                    borderTop: `${th}px solid ${color}`,
                    borderLeft: `${th}px solid ${color}`
                }}
            />
            <div
                className='absolute top-3 right-3 pointer-events-none'
                style={{
                    width: sz,
                    height: sz,
                    borderTop: `${th}px solid ${color}`,
                    borderRight: `${th}px solid ${color}`
                }}
            />
            <div
                className='absolute bottom-3 left-3 pointer-events-none'
                style={{
                    width: sz,
                    height: sz,
                    borderBottom: `${th}px solid ${color}`,
                    borderLeft: `${th}px solid ${color}`
                }}
            />
            <div
                className='absolute bottom-3 right-3 pointer-events-none'
                style={{
                    width: sz,
                    height: sz,
                    borderBottom: `${th}px solid ${color}`,
                    borderRight: `${th}px solid ${color}`
                }}
            />
        </>
    )
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
    theme,
    authError,
    toggleTheme,
    googleClientId,
    onCredentialResponse
}) => {
    const [dismissed, setDismissed] = useState(false)
    const [bootIdx, setBootIdx] = useState(0)

    const bootMessages = [
        'KHỞI TẠO HỆ THỐNG ĐIỀU PHỐI...',
        'QUÉT NHẬN DẠNG THỰC THỂ...',
        'KẾT NỐI CỤM VŨ TRỤ...',
        'SẴN SÀNG XÁC THỰC DANH TÍNH!'
    ]

    useEffect(() => {
        if (authError) setDismissed(false)
    }, [authError])

    useEffect(() => {
        const interval = setInterval(() => {
            setBootIdx((prev) => (prev + 1) % bootMessages.length)
        }, 2200)
        return () => clearInterval(interval)
    }, [])

    const containerRef = useRef<HTMLDivElement>(null)
    const googleBtnRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const orb1Ref = useRef<HTMLDivElement>(null)
    const orb2Ref = useRef<HTMLDivElement>(null)

    const isDark = theme === 'dark'

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (cardRef.current) {
                gsap.to(cardRef.current, { y: -7, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
            }
            if (logoRef.current) {
                gsap.to(logoRef.current, {
                    filter: 'drop-shadow(0 0 14px rgba(34,211,238,0.8)) drop-shadow(0 0 4px rgba(34,211,238,0.5))',
                    duration: 1.8,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                })
            }
            if (orb1Ref.current) {
                gsap.to(orb1Ref.current, {
                    x: 60,
                    y: 40,
                    scale: 1.2,
                    duration: 9,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                })
            }
            if (orb2Ref.current) {
                gsap.to(orb2Ref.current, {
                    x: -50,
                    y: -50,
                    scale: 1.15,
                    duration: 11,
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
                            type: 'standard',
                            theme: 'filled_black',
                            size: 'large',
                            shape: 'pill',
                            text: 'signin_with',
                            width: 240,
                            logo_alignment: 'left'
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
            className='min-h-screen flex items-center justify-center p-4 font-mono relative overflow-hidden select-none'
            style={{
                background: isDark
                    ? 'radial-gradient(ellipse at 25% 50%, #050b18 0%, #020408 40%, #000000 100%)'
                    : 'radial-gradient(ellipse at 25% 50%, #e0f2fe 0%, #f0f9ff 40%, #ecfeff 100%)'
            }}
        >
            {/* Star field - dark only */}
            {isDark && (
                <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                    {Array.from({ length: 55 }).map((_, i) => (
                        <div
                            key={i}
                            className='absolute rounded-full bg-white'
                            style={{
                                width: `${((i * 7) % 3) + 1}px`,
                                height: `${((i * 7) % 3) + 1}px`,
                                top: `${(i * 31 + 17) % 97}%`,
                                left: `${(i * 53 + 11) % 99}%`,
                                opacity: (((i * 13) % 7) + 1) * 0.12,
                                animation: `loginTwinkle ${((i * 7) % 3) + 2}s ease-in-out infinite`,
                                animationDelay: `${(i * 0.3) % 4}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Ambient orbs */}
            <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                <div
                    ref={orb1Ref}
                    className='absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] min-w-[300px] min-h-[300px] rounded-full'
                    style={{
                        background: isDark
                            ? 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(59,130,246,0.1) 50%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                />
                <div
                    ref={orb2Ref}
                    className='absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] min-w-[280px] min-h-[280px] rounded-full'
                    style={{
                        background: isDark
                            ? 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)',
                        filter: 'blur(70px)'
                    }}
                />
                {/* HUD horizontal line */}
                <div
                    className='absolute top-1/2 left-0 right-0 h-px opacity-20 pointer-events-none'
                    style={{
                        background: isDark
                            ? 'linear-gradient(90deg, transparent, #22d3ee 30%, #22d3ee 70%, transparent)'
                            : 'linear-gradient(90deg, transparent, #0ea5e9 30%, #0ea5e9 70%, transparent)'
                    }}
                />
            </div>

            {/* Grid overlay */}
            <div
                className='absolute inset-0 pointer-events-none'
                style={{
                    backgroundImage: isDark
                        ? 'linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)'
                        : 'linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Main card */}
            <div ref={cardRef} className='relative z-10 w-[310px] sm:w-[360px]' style={{ willChange: 'transform' }}>
                <div
                    className='relative rounded-[28px] overflow-hidden'
                    style={{
                        background: isDark
                            ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 100%)',
                        backdropFilter: 'blur(28px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                        border: isDark ? '1px solid rgba(34,211,238,0.15)' : '1px solid rgba(14,165,233,0.25)',
                        boxShadow: isDark
                            ? '0 0 40px rgba(34,211,238,0.06), 0 0 80px rgba(59,130,246,0.04), inset 0 1px 0 rgba(255,255,255,0.05)'
                            : '0 0 40px rgba(14,165,233,0.1), 0 20px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
                    }}
                >
                    <ScanLines />
                    <CornerBrackets isDark={isDark} />

                    <div className='p-8 flex flex-col items-center text-center relative'>
                        {/* Controls */}
                        <div className='absolute top-4 right-4 z-20 flex items-center gap-1.5'>
                            {(import.meta.env.VITE_BYPASS_AUTH === 'true' || import.meta.env.DEV) && (
                                <button
                                    type='button'
                                    title='Dev Mode'
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
                                    className='p-1.5 rounded-md cursor-pointer transition-all'
                                    style={{
                                        background: 'rgba(34,211,238,0.1)',
                                        border: '1px solid rgba(34,211,238,0.3)',
                                        color: '#22d3ee'
                                    }}
                                >
                                    <Zap size={11} />
                                </button>
                            )}
                            <button
                                type='button'
                                onClick={toggleTheme}
                                title={isDark ? 'Light mode' : 'Dark mode'}
                                aria-label='Toggle theme'
                                className='relative inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-all duration-300 cursor-pointer'
                                style={{
                                    background: isDark ? 'rgba(34,211,238,0.15)' : 'rgba(14,165,233,0.1)',
                                    border: isDark ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(14,165,233,0.3)'
                                }}
                            >
                                <span
                                    className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0'}`}
                                    style={{
                                        background: isDark ? '#0f172a' : '#ffffff',
                                        border: isDark
                                            ? '1px solid rgba(34,211,238,0.4)'
                                            : '1px solid rgba(14,165,233,0.3)',
                                        color: isDark ? '#22d3ee' : '#0ea5e9'
                                    }}
                                >
                                    {isDark ? <Moon size={10} /> : <Sun size={10} />}
                                </span>
                            </button>
                        </div>

                        {/* HUD Logo */}
                        <div className='relative w-24 h-24 mb-5 flex items-center justify-center'>
                            <HudRing size={96} duration={8} color={isDark ? '#22d3ee' : '#0ea5e9'} opacity={0.5} />
                            <HudRing
                                size={80}
                                duration={6}
                                reverse
                                color={isDark ? '#818cf8' : '#6366f1'}
                                opacity={0.4}
                                dashed
                            />
                            <HudRing size={64} duration={4} color={isDark ? '#06b6d4' : '#0284c7'} opacity={0.35} />
                            <div
                                className='absolute inset-0 rounded-full'
                                style={{
                                    background: isDark
                                        ? 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)'
                                        : 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)'
                                }}
                            />
                            <div
                                ref={logoRef}
                                className='relative z-10 w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center'
                                style={{
                                    background: isDark ? '#050b18' : '#f0f9ff',
                                    border: isDark ? '2px solid rgba(34,211,238,0.5)' : '2px solid rgba(14,165,233,0.5)'
                                }}
                            >
                                <img
                                    src='/logo.png'
                                    alt='Morri 3D Logo'
                                    className='w-full h-full object-cover rounded-[10px]'
                                    onError={(e) => {
                                        ;(e.target as HTMLElement).style.display = 'none'
                                    }}
                                />
                                <Cpu
                                    size={22}
                                    className='absolute'
                                    style={{ color: isDark ? '#22d3ee' : '#0ea5e9', opacity: 0.8 }}
                                />
                            </div>
                            <div
                                className='absolute top-1 right-1 w-2 h-2 rounded-full animate-ping'
                                style={{ background: isDark ? '#22d3ee' : '#0ea5e9', opacity: 0.8 }}
                            />
                            <div
                                className='absolute top-1 right-1 w-2 h-2 rounded-full'
                                style={{ background: isDark ? '#22d3ee' : '#0ea5e9' }}
                            />
                        </div>

                        {/* System badge */}
                        <div
                            className='flex items-center gap-1.5 mb-2 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase'
                            style={{
                                background: isDark ? 'rgba(34,211,238,0.08)' : 'rgba(14,165,233,0.08)',
                                border: isDark ? '1px solid rgba(34,211,238,0.2)' : '1px solid rgba(14,165,233,0.2)',
                                color: isDark ? '#22d3ee' : '#0ea5e9'
                            }}
                        >
                            <Wifi size={8} />
                            <span>SYS-ID: MORRI-3D-∞</span>
                        </div>

                        {/* Title */}
                        <h2 className='text-3xl font-black tracking-tight mb-0.5 select-none'>
                            <span
                                className='bg-clip-text text-transparent'
                                style={{
                                    backgroundImage: isDark
                                        ? 'linear-gradient(135deg, #22d3ee 0%, #818cf8 50%, #22d3ee 100%)'
                                        : 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #0ea5e9 100%)',
                                    backgroundSize: '200% auto',
                                    animation: 'loginGradientShift 4s linear infinite'
                                }}
                            >
                                Morri 3D
                            </span>
                        </h2>

                        <p
                            className='text-[10px] tracking-widest uppercase mb-1 font-medium'
                            style={{ color: isDark ? 'rgba(34,211,238,0.6)' : 'rgba(14,165,233,0.7)' }}
                        >
                            TRUNG TÂM ĐIỀU PHỐI SẢN XUẤT
                        </p>

                        {/* Boot ticker */}
                        <div
                            className='text-[9px] font-mono mb-5 h-4 flex items-center gap-1.5'
                            style={{ color: isDark ? 'rgba(148,163,184,0.7)' : 'rgba(100,116,139,0.8)' }}
                        >
                            <span
                                className='inline-block w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0'
                                style={{ background: isDark ? '#22d3ee' : '#0ea5e9' }}
                            />
                            <span className='transition-all duration-300 truncate'>{bootMessages[bootIdx]}</span>
                        </div>

                        {/* Divider */}
                        <div className='w-full mb-5 flex items-center gap-2'>
                            <div
                                className='flex-1 h-px'
                                style={{ background: isDark ? 'rgba(34,211,238,0.15)' : 'rgba(14,165,233,0.2)' }}
                            />
                            <span
                                className='text-[9px] uppercase tracking-widest font-bold'
                                style={{ color: isDark ? 'rgba(34,211,238,0.5)' : 'rgba(14,165,233,0.6)' }}
                            >
                                XÁC THỰC DANH TÍNH
                            </span>
                            <div
                                className='flex-1 h-px'
                                style={{ background: isDark ? 'rgba(34,211,238,0.15)' : 'rgba(14,165,233,0.2)' }}
                            />
                        </div>

                        {/* Google Sign-in */}
                        <div className='flex flex-col items-center gap-3 w-full'>
                            <div
                                ref={googleBtnRef}
                                className='rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                                style={{
                                    boxShadow: isDark
                                        ? '0 0 20px rgba(34,211,238,0.1), 0 4px 16px rgba(0,0,0,0.4)'
                                        : '0 0 20px rgba(14,165,233,0.1), 0 4px 16px rgba(0,0,0,0.1)'
                                }}
                            />
                            <div
                                className='flex items-center justify-center gap-1.5 text-[10px] font-medium'
                                style={{ color: isDark ? 'rgba(148,163,184,0.6)' : 'rgba(100,116,139,0.7)' }}
                            >
                                <Lock size={10} />
                                <span>MÃ HÓA END-TO-END · OAUTH 2.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom HUD bar */}
                <div
                    className='mt-3 mx-4 h-px'
                    style={{
                        background: isDark
                            ? 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)'
                            : 'linear-gradient(90deg, transparent, rgba(14,165,233,0.3), transparent)'
                    }}
                />
                <div className='mt-1 flex items-center justify-center'>
                    <span
                        className='text-[8px] font-mono tracking-widest uppercase'
                        style={{ color: isDark ? 'rgba(34,211,238,0.3)' : 'rgba(14,165,233,0.4)' }}
                    >
                        MORRI-3D ORBITAL HUB · v2.0.∞
                    </span>
                </div>
            </div>

            {/* Auth error toast */}
            {authError && !dismissed && (
                <div
                    className='fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-32px)] sm:w-auto p-3.5 rounded-2xl backdrop-blur-2xl shadow-2xl flex items-start gap-3 select-none'
                    style={{
                        background: isDark ? 'rgba(10,10,20,0.95)' : 'rgba(255,255,255,0.95)',
                        border: '1px solid rgba(239,68,68,0.4)',
                        boxShadow: '0 0 20px rgba(239,68,68,0.1)'
                    }}
                >
                    <div className='p-2 rounded-xl bg-rose-500/15 text-rose-500 flex-shrink-0 mt-0.5 border border-rose-500/20'>
                        <ShieldAlert size={18} />
                    </div>
                    <div className='flex-1 min-w-0 pr-1'>
                        <div className='font-bold text-xs text-rose-500 flex items-center gap-1.5 font-mono tracking-wide'>
                            CẢNH BÁO: TRUY CẬP BỊ TỪ CHỐI
                        </div>
                        <div
                            className='text-[11px] opacity-80 mt-0.5 leading-snug'
                            style={{ color: isDark ? '#d1d5db' : '#374151' }}
                        >
                            {authError}
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={() => setDismissed(true)}
                        className='p-1 rounded-lg opacity-60 hover:opacity-100 transition-all cursor-pointer'
                        style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            <style>{`
                @keyframes loginHudSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes loginTwinkle {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.3); }
                }
                @keyframes loginGradientShift {
                    0% { background-position: 0% center; }
                    100% { background-position: 200% center; }
                }
            `}</style>
        </div>
    )
}
