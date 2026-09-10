import React, { useEffect, useRef, useState } from 'react'
import { RefreshCw, AlertTriangle, LogOut, Cpu, Radio } from 'lucide-react'
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

const ScanLines = () => (
    <div
        className='absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]'
        style={{
            background:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.012) 2px, rgba(34,211,238,0.012) 4px)',
            zIndex: 2
        }}
    />
)

const CornerBrackets = ({ isDark }: { isDark: boolean }) => {
    const color = isDark ? 'rgba(34,211,238,0.45)' : 'rgba(14,165,233,0.4)'
    const sz = 14
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

const HudRing = ({
    size,
    duration,
    reverse = false,
    color = '#22d3ee',
    opacity = 0.5,
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
        style={{ animation: `loadHudSpin ${duration}s linear infinite ${reverse ? 'reverse' : ''}` }}
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

export const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({
    theme,
    syncStatus,
    syncMessage,
    onRetry,
    onLogout
}) => {
    const isDark = theme === 'dark'
    const isError = syncStatus === 'error'
    const [loadIdx, setLoadIdx] = useState(0)

    const loadingMessages = [
        'ĐỒNG BỘ DỮ LIỆU VŨ TRỤ...',
        'KẾT NỐI TRẠM QUỸ ĐẠO...',
        'GIẢI MÃ GÓI THÔNG TIN...',
        'XÁC MINH LUỒNG DỮ LIỆU...',
        'TẢI CẤU HÌNH HỆ THỐNG...',
        'CÂU TRÚC KHÔNG GIAN SẴN SÀNG!'
    ]

    useEffect(() => {
        if (!isError) {
            const interval = setInterval(() => {
                setLoadIdx((prev) => (prev + 1) % loadingMessages.length)
            }, 1800)
            return () => clearInterval(interval)
        }
    }, [isError])

    const containerRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const cardRef = useRef<HTMLDivElement>(null)
    const orb1Ref = useRef<HTMLDivElement>(null)
    const orb2Ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (cardRef.current) {
                gsap.to(cardRef.current, { y: -6, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
            }
            if (logoRef.current && !isError) {
                gsap.to(logoRef.current, {
                    filter: 'drop-shadow(0 0 14px rgba(34,211,238,0.8))',
                    duration: 1.8,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                })
            }
            if (orb1Ref.current) {
                gsap.to(orb1Ref.current, {
                    x: 50,
                    y: 35,
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
                    y: -40,
                    scale: 1.1,
                    duration: 11,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                })
            }
        })
        return () => ctx.revert()
    }, [isError])

    return (
        <div
            ref={containerRef}
            className='fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 select-none overflow-hidden font-mono'
            style={{
                background: isDark
                    ? 'radial-gradient(ellipse at 25% 50%, #050b18 0%, #020408 40%, #000000 100%)'
                    : 'radial-gradient(ellipse at 25% 50%, #e0f2fe 0%, #f0f9ff 40%, #ecfeff 100%)'
            }}
        >
            {/* Star field - dark only */}
            {isDark && (
                <div className='absolute inset-0 pointer-events-none overflow-hidden'>
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className='absolute rounded-full bg-white'
                            style={{
                                width: `${((i * 7) % 3) + 1}px`,
                                height: `${((i * 7) % 3) + 1}px`,
                                top: `${(i * 31 + 17) % 97}%`,
                                left: `${(i * 53 + 11) % 99}%`,
                                opacity: (((i * 13) % 7) + 1) * 0.11,
                                animation: `loadTwinkle ${((i * 7) % 3) + 2}s ease-in-out infinite`,
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
                    className='absolute top-[10%] left-[-10%] rounded-full'
                    style={{
                        width: '55vw',
                        height: '55vw',
                        minWidth: 280,
                        minHeight: 280,
                        background: isError
                            ? 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)'
                            : isDark
                              ? 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.07) 50%, transparent 70%)'
                              : 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(59,130,246,0.1) 50%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                />
                <div
                    ref={orb2Ref}
                    className='absolute bottom-[10%] right-[-10%] rounded-full'
                    style={{
                        width: '50vw',
                        height: '50vw',
                        minWidth: 260,
                        minHeight: 260,
                        background: isError
                            ? 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)'
                            : isDark
                              ? 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)'
                              : 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.08) 50%, transparent 70%)',
                        filter: 'blur(70px)'
                    }}
                />
            </div>

            {/* Grid overlay */}
            <div
                className='absolute inset-0 pointer-events-none'
                style={{
                    backgroundImage: isDark
                        ? 'linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)'
                        : 'linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Card */}
            <div ref={cardRef} className='relative z-10 w-[300px] sm:w-[340px]' style={{ willChange: 'transform' }}>
                <div
                    className='relative rounded-[32px] overflow-hidden'
                    style={{
                        background: isDark
                            ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 100%)',
                        backdropFilter: 'blur(28px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                        border: isError
                            ? '1px solid rgba(239,68,68,0.3)'
                            : isDark
                              ? '1px solid rgba(34,211,238,0.15)'
                              : '1px solid rgba(14,165,233,0.25)',
                        boxShadow: isError
                            ? '0 0 40px rgba(239,68,68,0.05), 0 20px 40px rgba(0,0,0,0.2)'
                            : isDark
                              ? '0 0 40px rgba(34,211,238,0.06), 0 0 80px rgba(59,130,246,0.04), inset 0 1px 0 rgba(255,255,255,0.05)'
                              : '0 0 40px rgba(14,165,233,0.1), 0 20px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
                    }}
                >
                    <ScanLines />
                    <CornerBrackets isDark={isDark} />

                    <div className='p-8 flex flex-col items-center text-center'>
                        {!isError ? (
                            <>
                                {/* HUD Logo */}
                                <div className='relative w-28 h-28 sm:w-32 sm:h-32 mb-6 flex items-center justify-center'>
                                    <HudRing
                                        size={112}
                                        duration={8}
                                        color={isDark ? '#22d3ee' : '#0ea5e9'}
                                        opacity={0.45}
                                    />
                                    <HudRing
                                        size={94}
                                        duration={6}
                                        reverse
                                        color={isDark ? '#818cf8' : '#6366f1'}
                                        opacity={0.35}
                                        dashed
                                    />
                                    <HudRing
                                        size={76}
                                        duration={4}
                                        color={isDark ? '#06b6d4' : '#0284c7'}
                                        opacity={0.3}
                                    />
                                    <HudRing
                                        size={58}
                                        duration={10}
                                        reverse
                                        color={isDark ? '#22d3ee' : '#0ea5e9'}
                                        opacity={0.2}
                                        dashed
                                    />

                                    <div
                                        className='absolute inset-0 rounded-full'
                                        style={{
                                            background: isDark
                                                ? 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)'
                                                : 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)'
                                        }}
                                    />

                                    <div
                                        ref={logoRef}
                                        className='relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden flex items-center justify-center'
                                        style={{
                                            background: isDark ? '#050b18' : '#f0f9ff',
                                            border: isDark
                                                ? '2px solid rgba(34,211,238,0.5)'
                                                : '2px solid rgba(14,165,233,0.5)'
                                        }}
                                    >
                                        <img
                                            src='/logo.png'
                                            alt='Morri 3D Logo'
                                            className='w-full h-full object-cover rounded-[14px]'
                                            onError={(e) => {
                                                ;(e.target as HTMLElement).style.display = 'none'
                                            }}
                                        />
                                        <Cpu
                                            size={24}
                                            className='absolute'
                                            style={{ color: isDark ? '#22d3ee' : '#0ea5e9', opacity: 0.8 }}
                                        />
                                    </div>

                                    {/* Active ping */}
                                    <div
                                        className='absolute top-1 right-1 w-2.5 h-2.5 rounded-full animate-ping'
                                        style={{ background: isDark ? '#22d3ee' : '#0ea5e9', opacity: 0.7 }}
                                    />
                                    <div
                                        className='absolute top-1 right-1 w-2.5 h-2.5 rounded-full'
                                        style={{ background: isDark ? '#22d3ee' : '#0ea5e9' }}
                                    />
                                </div>

                                {/* Status badge */}
                                <div
                                    className='flex items-center gap-1.5 mb-2 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase'
                                    style={{
                                        background: isDark ? 'rgba(34,211,238,0.08)' : 'rgba(14,165,233,0.08)',
                                        border: isDark
                                            ? '1px solid rgba(34,211,238,0.2)'
                                            : '1px solid rgba(14,165,233,0.2)',
                                        color: isDark ? '#22d3ee' : '#0ea5e9'
                                    }}
                                >
                                    <Radio size={8} className='animate-pulse' />
                                    <span>ĐANG KẾT NỐI</span>
                                </div>

                                <h2 className='text-xl sm:text-2xl font-black tracking-tight mb-1'>
                                    <span
                                        className='bg-clip-text text-transparent'
                                        style={{
                                            backgroundImage: isDark
                                                ? 'linear-gradient(135deg, #22d3ee 0%, #818cf8 50%, #22d3ee 100%)'
                                                : 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #0ea5e9 100%)',
                                            backgroundSize: '200% auto',
                                            animation: 'loadGradientShift 4s linear infinite'
                                        }}
                                    >
                                        ĐANG TẢI DỮ LIỆU
                                    </span>
                                </h2>

                                {/* Animated ticker */}
                                <div
                                    className='text-[9px] font-mono mb-2 flex items-center gap-1.5 h-4'
                                    style={{ color: isDark ? 'rgba(148,163,184,0.7)' : 'rgba(100,116,139,0.8)' }}
                                >
                                    <span
                                        className='inline-block w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0'
                                        style={{ background: isDark ? '#22d3ee' : '#0ea5e9' }}
                                    />
                                    <span className='truncate'>{loadingMessages[loadIdx]}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Error state */}
                                <div className='relative w-24 h-24 sm:w-28 sm:h-28 mb-5 flex items-center justify-center'>
                                    <div
                                        className='absolute inset-0 rounded-full blur-xl animate-pulse'
                                        style={{ background: 'rgba(239,68,68,0.15)' }}
                                    />
                                    <div
                                        className='w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center text-red-500'
                                        style={{
                                            border: '2px solid rgba(239,68,68,0.4)',
                                            background: 'rgba(239,68,68,0.08)',
                                            boxShadow: '0 0 20px rgba(239,68,68,0.15)'
                                        }}
                                    >
                                        <AlertTriangle size={38} className='animate-bounce [animation-duration:2s]' />
                                    </div>
                                </div>

                                <div
                                    className='flex items-center gap-1.5 mb-2 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase'
                                    style={{
                                        background: 'rgba(239,68,68,0.08)',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                        color: '#ef4444'
                                    }}
                                >
                                    <span className='inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse' />
                                    <span>TÍN HIỆU BỊ MẤT</span>
                                </div>

                                <h2 className='text-xl sm:text-2xl font-black tracking-tight mb-2 text-red-500'>
                                    LỖI KẾT NỐI HỆ THỐNG
                                </h2>

                                <p
                                    className='text-xs sm:text-sm opacity-75 max-w-xs mb-6 font-medium leading-relaxed'
                                    style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                                >
                                    {syncMessage ||
                                        'Không thể thiết lập kết nối với trạm quỹ đạo. Kiểm tra tín hiệu mạng và thử lại.'}
                                </p>

                                <div className='w-full space-y-2.5'>
                                    <button
                                        type='button'
                                        onClick={onRetry}
                                        className='w-full py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]'
                                        style={{
                                            background: isDark
                                                ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
                                                : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                                            boxShadow: '0 4px 16px rgba(14,165,233,0.3)'
                                        }}
                                    >
                                        <RefreshCw size={16} />
                                        <span>KHỞI ĐỘNG LẠI KẾT NỐI</span>
                                    </button>
                                    <button
                                        type='button'
                                        onClick={onLogout}
                                        className='w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer'
                                        style={{
                                            border: '1px solid rgba(239,68,68,0.3)',
                                            background: 'rgba(239,68,68,0.08)',
                                            color: '#ef4444'
                                        }}
                                    >
                                        <LogOut size={14} />
                                        <span>THOÁT HỆ THỐNG</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom HUD bar */}
                <div
                    className='mt-3 mx-4 h-px'
                    style={{
                        background: isError
                            ? 'linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)'
                            : isDark
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

            <style>{`
                @keyframes loadHudSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes loadTwinkle {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.85; transform: scale(1.3); }
                }
                @keyframes loadGradientShift {
                    0% { background-position: 0% center; }
                    100% { background-position: 200% center; }
                }
            `}</style>
        </div>
    )
}
