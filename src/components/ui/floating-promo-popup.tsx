import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ExternalLink, X, Star, ShieldCheck, Flame, GripHorizontal, Truck } from 'lucide-react'

interface FloatingPromoPopupProps {
    theme?: 'dark' | 'light'
    productName?: string
    originalPrice?: string
    salePrice?: string
    discountBadge?: string
    soldCount?: string
    rating?: string
    imageUrl?: string
    link?: string
}

export const FloatingPromoPopup: React.FC<FloatingPromoPopupProps> = ({
    theme = 'dark',
    productName = 'Cuộn Nhựa In 3D PLA+ 1.75mm eSun Chính Hãng (1kg)',
    originalPrice = '250.000₫',
    salePrice = '189.000₫',
    discountBadge = '-24%',
    soldCount = '2.4k đã bán',
    rating = '4.9',
    imageUrl = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
    link = 'https://shopee.vn/search?keyword=nh%E1%BB%B1a%20in%203d%20esun%20pla'
}) => {
    const [isOpen, setIsOpen] = useState(true)
    const [isDismissed, setIsDismissed] = useState(false)
    const isDark = theme === 'dark'

    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const dragRef = useRef<HTMLDivElement>(null)
    const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number; hasMoved: boolean }>({
        startX: 0,
        startY: 0,
        posX: 0,
        posY: 0,
        hasMoved: false
    })

    // Bật/tắt quảng cáo qua biến môi trường VITE_ENABLE_ADS (mặc định: tắt)
    const isAdsEnabled = import.meta.env.VITE_ENABLE_ADS === 'true' || import.meta.env.VITE_ENABLE_ADS === '1'

    useEffect(() => {
        const initX = Math.max(16, window.innerWidth - (window.innerWidth < 640 ? 305 : 330))
        const initY = Math.max(16, window.innerHeight - (window.innerWidth < 640 ? 250 : 210))
        setPosition({ x: initX, y: initY })
    }, [])

    const handlePointerDown = (e: React.PointerEvent) => {
        const target = e.target as HTMLElement
        if (target.closest('button') || target.closest('a')) {
            return
        }

        if (!position) return

        setIsDragging(true)
        dragStartRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            posX: position.x,
            posY: position.y,
            hasMoved: false
        }
    }

    const handlePointerMove = useCallback(
        (e: PointerEvent) => {
            if (!isDragging) return

            const deltaX = e.clientX - dragStartRef.current.startX
            const deltaY = e.clientY - dragStartRef.current.startY

            if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                dragStartRef.current.hasMoved = true
            }

            const elemWidth = dragRef.current?.offsetWidth || 290
            const elemHeight = dragRef.current?.offsetHeight || 160

            const minX = 8
            const maxX = Math.max(8, window.innerWidth - elemWidth - 8)
            const minY = 8
            const maxY = Math.max(8, window.innerHeight - elemHeight - 8)

            const nextX = Math.min(Math.max(minX, dragStartRef.current.posX + deltaX), maxX)
            const nextY = Math.min(Math.max(minY, dragStartRef.current.posY + deltaY), maxY)

            setPosition({ x: nextX, y: nextY })
        },
        [isDragging]
    )

    const handlePointerUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('pointermove', handlePointerMove)
            window.addEventListener('pointerup', handlePointerUp)
            window.addEventListener('pointercancel', handlePointerUp)
        }
        return () => {
            window.removeEventListener('pointermove', handlePointerMove)
            window.removeEventListener('pointerup', handlePointerUp)
            window.removeEventListener('pointercancel', handlePointerUp)
        }
    }, [isDragging, handlePointerMove, handlePointerUp])

    if (!isAdsEnabled || isDismissed) return null

    const stylePosition = position
        ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
              touchAction: 'none' as const
          }
        : {
              right: '16px',
              bottom: '80px',
              touchAction: 'none' as const
          }

    return (
        <aside
            ref={dragRef}
            aria-label='Sản phẩm Shopee Mall'
            style={stylePosition}
            onPointerDown={handlePointerDown}
            className={`fixed z-40 select-none transition-shadow ${
                isDragging ? 'cursor-grabbing scale-[1.02] shadow-2xl opacity-95' : 'cursor-grab'
            }`}
        >
            {isOpen ? (
                <div
                    className={`relative p-3 rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all duration-200 overflow-hidden w-[295px] sm:w-[315px] ${
                        isDark
                            ? 'bg-zinc-900/95 border-[#ee4d2d]/35 text-zinc-100 shadow-black/70 hover:border-[#ee4d2d]/60'
                            : 'bg-white/95 border-[#ee4d2d]/30 text-zinc-900 shadow-[#ee4d2d]/15 hover:border-[#ee4d2d]'
                    }`}
                >
                    <div className='absolute -right-8 -top-8 w-28 h-28 bg-[#ee4d2d]/15 rounded-full filter blur-xl pointer-events-none' />

                    <div className='flex items-center justify-between pb-2 mb-2 border-b border-inherit/30'>
                        <div className='flex items-center gap-1.5'>
                            <span className='px-1.5 py-0.5 rounded bg-[#ee4d2d] text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-xs'>
                                <ShieldCheck size={10} /> Shopee Mall
                            </span>
                            <span className='text-[10px] text-[#ee4d2d] font-bold flex items-center gap-0.5'>
                                <Truck size={11} /> Freeship Xtra
                            </span>
                        </div>

                        <div className='flex items-center gap-1'>
                            <div className='opacity-30 hover:opacity-80 transition-opacity p-0.5'>
                                <GripHorizontal size={13} />
                            </div>
                            <button
                                type='button'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsOpen(false)
                                }}
                                className='w-5 h-5 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer'
                                title='Thu nhỏ popup'
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </div>

                    <div className='flex items-start gap-2.5 relative z-10'>
                        <div className='relative w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-xl overflow-hidden flex-shrink-0 border border-black/10 dark:border-white/10 bg-zinc-800 shadow-sm'>
                            <img
                                src={imageUrl}
                                alt={productName}
                                className='w-full h-full object-cover'
                                onError={(e) => {
                                    ;(e.target as HTMLImageElement).src =
                                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80'
                                }}
                            />
                            <span className='absolute top-0 right-0 bg-[#ee4d2d] text-white text-[8px] font-black px-1 rounded-bl'>
                                {discountBadge}
                            </span>
                        </div>

                        <div className='min-w-0 flex-1'>
                            <h4 className='font-bold text-xs line-clamp-2 leading-snug text-inherit group-hover:text-[#ee4d2d] transition-colors'>
                                {productName}
                            </h4>

                            <div className='flex items-center gap-1.5 mt-1'>
                                <span className='font-black text-sm text-[#ee4d2d]'>{salePrice}</span>
                                <span className='text-[10px] opacity-40 line-through'>{originalPrice}</span>
                            </div>

                            <div className='flex items-center gap-2 mt-0.5 text-[10px] opacity-60 font-medium'>
                                <span className='flex items-center gap-0.5 text-amber-500 font-bold'>
                                    <Star size={9} fill='currentColor' /> {rating}
                                </span>
                                <span>•</span>
                                <span>{soldCount}</span>
                            </div>
                        </div>
                    </div>

                    <div className='mt-2.5 pt-2 border-t border-inherit/40 flex items-center justify-between gap-2 relative z-10'>
                        <button
                            type='button'
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsDismissed(true)
                            }}
                            className='text-[10px] opacity-50 hover:opacity-100 underline transition-opacity cursor-pointer'
                        >
                            Đóng hẳn
                        </button>

                        <a
                            href={link}
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={(e) => {
                                if (dragStartRef.current.hasMoved) {
                                    e.preventDefault()
                                }
                            }}
                            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ee4d2d] hover:bg-[#d73211] active:scale-95 text-white font-black text-[11px] shadow-md shadow-[#ee4d2d]/30 transition-all cursor-pointer'
                        >
                            <span>Mua ngay Shopee</span>
                            <ExternalLink size={11} />
                        </a>
                    </div>
                </div>
            ) : (
                <button
                    type='button'
                    onClick={() => {
                        if (!dragStartRef.current.hasMoved) {
                            setIsOpen(true)
                        }
                    }}
                    className='group relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full border backdrop-blur-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing bg-[#ee4d2d] text-white border-orange-300 shadow-[#ee4d2d]/30'
                    title='Mở xem sản phẩm Shopee'
                >
                    <span className='relative flex h-2.5 w-2.5'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300'></span>
                    </span>

                    <span className='font-black text-xs'>Shopee Mall</span>
                    <span className='px-1 py-0.2 rounded bg-white text-[#ee4d2d] font-black text-[9px]'>-24%</span>
                    <Flame size={13} className='text-amber-200 animate-bounce' />
                </button>
            )}
        </aside>
    )
}
