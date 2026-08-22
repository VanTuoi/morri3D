import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import {
    ChevronRight,
    Layers,
    AlertCircle,
    Plus,
    LayoutGrid,
    List,
    Search,
    X,
    Filter,
    ArrowUpDown,
    RotateCcw,
    Sparkles,
    SlidersHorizontal,
    Heart
} from 'lucide-react'
import type { Filament } from '~/types'

type StockFilterType = 'ALL' | 'LOW' | 'HALF' | 'FULL'
type SortByType = 'weight-asc' | 'weight-desc' | 'favorite-first' | 'brand-asc' | 'date-desc'

export const InventoryPage: React.FC = () => {
    const { filaments = [], theme, openFilamentModal, setFilaments } = useOutletContext<any>()
    const navigate = useNavigate()
    const isDark = theme === 'dark'

    const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
        return (localStorage.getItem('3dManager_inventory_view') as 'grid' | 'list') || 'grid'
    })

    useEffect(() => {
        localStorage.setItem('3dManager_inventory_view', viewMode)
    }, [viewMode])

    const [showFilters, setShowFilters] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [stockFilter, setStockFilter] = useState<StockFilterType>('ALL')
    const [brandFilter, setBrandFilter] = useState('ALL')
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [sortBy, setSortBy] = useState<SortByType>('weight-asc')
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

    const [heartParticles, setHeartParticles] = useState<
        Array<{
            id: number
            x: number
            y: number
            tx: number
            ty: number
            size: number
            color: string
            rotate: number
            scale: number
            duration: number
            delay: number
        }>
    >([])

    const triggerHeartBurst = useCallback((clickX: number, clickY: number) => {
        const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#e11d48', '#fda4af', '#ff2a6d', '#ff007f']
        const newParticles: Array<{
            id: number
            x: number
            y: number
            tx: number
            ty: number
            size: number
            color: string
            rotate: number
            scale: number
            duration: number
            delay: number
        }> = []
        const now = Date.now()

        for (let i = 0; i < 18; i++) {
            const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.4
            const distance = 50 + Math.random() * 110
            const tx = Math.cos(angle) * distance + (Math.random() - 0.5) * 50
            const ty = -Math.abs(Math.sin(angle) * distance) - (60 + Math.random() * 140)

            newParticles.push({
                id: now + i,
                x: clickX,
                y: clickY,
                tx,
                ty,
                size: Math.floor(15 + Math.random() * 20),
                color: colors[Math.floor(Math.random() * colors.length)],
                rotate: (Math.random() - 0.5) * 90,
                scale: 1 + Math.random() * 0.5,
                duration: 1.2 + Math.random() * 0.5,
                delay: Math.random() * 0.08
            })
        }

        const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 800
        const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 600
        for (let j = 0; j < 10; j++) {
            const startX = Math.random() * windowWidth
            const startY = windowHeight * 0.65 + Math.random() * (windowHeight * 0.35)
            const tx = (Math.random() - 0.5) * 120
            const ty = -(180 + Math.random() * 280)

            newParticles.push({
                id: now + 100 + j,
                x: startX,
                y: startY,
                tx,
                ty,
                size: Math.floor(20 + Math.random() * 24),
                color: colors[Math.floor(Math.random() * colors.length)],
                rotate: (Math.random() - 0.5) * 60,
                scale: 1.1 + Math.random() * 0.6,
                duration: 1.5 + Math.random() * 0.6,
                delay: Math.random() * 0.3
            })
        }

        setHeartParticles((prev) => [...prev, ...newParticles])

        setTimeout(() => {
            setHeartParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)))
        }, 2400)
    }, [])

    const toggleFavorite = useCallback(
        (e: React.MouseEvent, id: string) => {
            e.stopPropagation()
            const targetFilament = filaments.find((f: Filament) => f.id === id)
            const isBecomingFavorite = !targetFilament?.isFavorite

            if (isBecomingFavorite) {
                const rect = e.currentTarget.getBoundingClientRect()
                const clickX = e.clientX || rect.left + rect.width / 2
                const clickY = e.clientY || rect.top + rect.height / 2
                triggerHeartBurst(clickX, clickY)
            }

            setFilaments((prev: Filament[]) => prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)))
        },
        [filaments, setFilaments, triggerHeartBurst]
    )

    const favoritesCount = useMemo(() => {
        return filaments.filter((f: Filament) => f.isFavorite).length
    }, [filaments])

    const totalWeightKg = useMemo(() => {
        const sumGrams = filaments.reduce((acc: number, f: Filament) => {
            const w = f.weight ?? (f.percentage !== undefined ? f.percentage * 10 : 1000)
            return acc + w
        }, 0)
        return (sumGrams / 1000).toFixed(1)
    }, [filaments])

    const stockCounts = useMemo(() => {
        let low = 0
        let half = 0
        let full = 0

        filaments.forEach((f: Filament) => {
            const w = f.weight ?? (f.percentage !== undefined ? f.percentage * 10 : 1000)
            if (w <= 200) low++
            else if (w <= 500) half++
            else full++
        })

        return { all: filaments.length, low, half, full }
    }, [filaments])

    const uniqueBrands = useMemo(() => {
        const set = new Set<string>()
        filaments.forEach((f: Filament) => {
            if (f.brand) set.add(f.brand)
        })
        return Array.from(set).sort()
    }, [filaments])

    const uniqueTypes = useMemo(() => {
        const set = new Set<string>()
        filaments.forEach((f: Filament) => {
            if (f.type) set.add(f.type)
        })
        return Array.from(set).sort()
    }, [filaments])

    const activeFilterCount = useMemo(() => {
        let count = 0
        if (stockFilter !== 'ALL') count++
        if (brandFilter !== 'ALL') count++
        if (typeFilter !== 'ALL') count++
        if (sortBy !== 'weight-asc') count++
        if (showFavoritesOnly) count++
        return count
    }, [stockFilter, brandFilter, typeFilter, sortBy, showFavoritesOnly])

    const isFiltered = useMemo(() => {
        return searchQuery.trim() !== '' || activeFilterCount > 0
    }, [searchQuery, activeFilterCount])

    const handleResetFilters = () => {
        setSearchQuery('')
        setStockFilter('ALL')
        setBrandFilter('ALL')
        setTypeFilter('ALL')
        setSortBy('weight-asc')
        setShowFavoritesOnly(false)
    }

    const handleToggleLowStock = () => {
        setStockFilter((prev) => (prev === 'LOW' ? 'ALL' : 'LOW'))
    }

    const displayedFilaments = useMemo(() => {
        let list = [...filaments]

        if (showFavoritesOnly) {
            list = list.filter((f: Filament) => f.isFavorite)
        }

        if (stockFilter === 'LOW') {
            list = list.filter((f: Filament) => {
                const w = f.weight ?? (f.percentage !== undefined ? f.percentage * 10 : 1000)
                return w <= 200
            })
        } else if (stockFilter === 'HALF') {
            list = list.filter((f: Filament) => {
                const w = f.weight ?? (f.percentage !== undefined ? f.percentage * 10 : 1000)
                return w <= 500
            })
        } else if (stockFilter === 'FULL') {
            list = list.filter((f: Filament) => {
                const w = f.weight ?? (f.percentage !== undefined ? f.percentage * 10 : 1000)
                return w > 500
            })
        }

        if (brandFilter !== 'ALL') {
            list = list.filter((f: Filament) => f.brand === brandFilter)
        }

        if (typeFilter !== 'ALL') {
            list = list.filter((f: Filament) => f.type === typeFilter)
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim()
            list = list.filter((f: Filament) => {
                const brand = (f.brand || '').toLowerCase()
                const type = (f.type || '').toLowerCase()
                const colorName = (f.colorName || '').toLowerCase()
                const colorHex = (f.colorHex || '').toLowerCase()
                const notes = (f.notes || '').toLowerCase()
                return (
                    brand.includes(q) ||
                    type.includes(q) ||
                    colorName.includes(q) ||
                    colorHex.includes(q) ||
                    notes.includes(q) ||
                    `${brand} ${type}`.includes(q)
                )
            })
        }

        list.sort((a: Filament, b: Filament) => {
            if (sortBy === 'favorite-first') {
                const aFav = a.isFavorite ? 0 : 1
                const bFav = b.isFavorite ? 0 : 1
                if (aFav !== bFav) return aFav - bFav
            }

            const wA = a.weight ?? (a.percentage !== undefined ? a.percentage * 10 : 1000)
            const wB = b.weight ?? (b.percentage !== undefined ? b.percentage * 10 : 1000)

            if (sortBy === 'weight-asc') return wA - wB
            if (sortBy === 'weight-desc') return wB - wA
            if (sortBy === 'brand-asc') return (a.brand || '').localeCompare(b.brand || '')
            if (sortBy === 'date-desc') {
                const dA = new Date(a.date || 0).getTime()
                const dB = new Date(b.date || 0).getTime()
                return dB - dA
            }
            return 0
        })

        return list
    }, [filaments, stockFilter, brandFilter, typeFilter, searchQuery, sortBy, showFavoritesOnly])

    const formatHex = (hex?: string) => {
        if (!hex) return ''
        const clean = hex.trim()
        return clean.startsWith('#') ? clean.toUpperCase() : `#${clean.toUpperCase()}`
    }

    return (
        <div className='relative overflow-x-clip space-y-4 sm:space-y-6 animate-in fade-in duration-300 max-w-6xl mx-auto'>
            <div className='absolute inset-0 overflow-hidden pointer-events-none -z-10'>
                <div className='absolute -top-10 -left-10 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/15 rounded-full filter blur-[80px]' />
                <div className='absolute top-36 -right-10 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full filter blur-[90px]' />
            </div>

            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1'>
                <div>
                    <div className='flex items-center gap-2 flex-wrap'>
                        <h1 className='text-sm sm:text-base font-black tracking-tight flex items-center gap-1.5'>
                            <Layers size={18} className='text-teal-500' />
                            <span>Kho Nhựa In 3D</span>
                        </h1>

                        <button
                            type='button'
                            onClick={handleResetFilters}
                            className={`text-xs px-2.5 py-0.5 rounded-full font-bold border transition-all cursor-pointer ${
                                stockFilter === 'ALL' && !isFiltered
                                    ? isDark
                                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                                        : 'bg-teal-100 text-teal-800 border-teal-300 shadow-sm'
                                    : isDark
                                      ? 'bg-zinc-800/80 border-white/10 text-zinc-400 hover:text-zinc-200'
                                      : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                            }`}
                            title='Xem tất cả cuộn nhựa'
                        >
                            {filaments.length} cuộn • ~{totalWeightKg}kg
                        </button>

                        {stockCounts.low > 0 && (
                            <button
                                type='button'
                                onClick={handleToggleLowStock}
                                className={`text-xs px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1 transition-all cursor-pointer ${
                                    stockFilter === 'LOW'
                                        ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/30 scale-105'
                                        : 'bg-rose-500/15 text-rose-500 border-rose-500/30 hover:bg-rose-500/25'
                                }`}
                                title='Bấm để lọc danh sách nhựa sắp hết (≤ 200g)'
                            >
                                <AlertCircle size={12} className={stockFilter === 'LOW' ? 'animate-pulse' : ''} />
                                <span>{stockCounts.low} sắp hết</span>
                            </button>
                        )}
                    </div>
                    <p className='text-xs opacity-60 mt-0.5 hidden sm:block'>
                        Theo dõi cuộn nhựa và khối lượng filament còn lại
                    </p>
                </div>

                <div className='flex items-center gap-2 flex-shrink-0'>
                    <div
                        className={`h-9 p-1 rounded-xl border flex items-center gap-0.5 backdrop-blur-xl ${
                            isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-white/80 border-zinc-200 shadow-sm'
                        }`}
                    >
                        <button
                            type='button'
                            onClick={() => setViewMode('grid')}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'bg-teal-600 text-white shadow-sm'
                                    : 'opacity-60 hover:opacity-100 text-inherit'
                            }`}
                            title='Xem dạng thẻ lưới'
                        >
                            <LayoutGrid size={15} />
                        </button>
                        <button
                            type='button'
                            onClick={() => setViewMode('list')}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                viewMode === 'list'
                                    ? 'bg-teal-600 text-white shadow-sm'
                                    : 'opacity-60 hover:opacity-100 text-inherit'
                            }`}
                            title='Xem dạng danh sách'
                        >
                            <List size={15} />
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/add?tab=filament')}
                        className='h-9 inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white font-black text-xs px-3.5 sm:px-4 rounded-xl shadow-md shadow-teal-500/25 transition-all cursor-pointer select-none'
                    >
                        <Plus size={15} strokeWidth={2.6} className='flex-shrink-0' />
                        <span>Nhập thêm</span>
                    </button>
                </div>
            </div>

            {filaments.length > 0 && (
                <div className='space-y-2.5'>
                    <div className='flex gap-2 items-center'>
                        <div className='relative flex-1'>
                            <Search size={15} className='absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40' />
                            <input
                                type='text'
                                className={`w-full h-10 pl-9 pr-8 text-xs rounded-2xl border outline-none backdrop-blur-xl transition-all shadow-sm ${
                                    isDark
                                        ? 'bg-zinc-900/70 border-white/10 text-zinc-100 placeholder-zinc-500 focus:border-teal-500/60 focus:bg-zinc-900'
                                        : 'bg-white/85 border-white/80 text-zinc-900 placeholder-zinc-400 focus:border-teal-500 focus:bg-white shadow-teal-500/5'
                                }`}
                                placeholder='Tìm theo tên hãng, loại nhựa, màu sắc, mã hex...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    type='button'
                                    onClick={() => setSearchQuery('')}
                                    className='absolute right-2.5 top-1/2 -translate-y-1/2 p-1 opacity-50 hover:opacity-100 rounded-md cursor-pointer'
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        <button
                            type='button'
                            onClick={() => setShowFilters((prev) => !prev)}
                            className={`h-10 px-3 sm:px-3.5 rounded-2xl border flex items-center gap-1.5 font-bold text-xs transition-all cursor-pointer select-none flex-shrink-0 shadow-xs ${
                                showFilters || activeFilterCount > 0
                                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20'
                                    : isDark
                                      ? 'bg-zinc-900/70 border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
                                      : 'bg-white/85 border-white/80 text-zinc-700 hover:bg-white shadow-teal-500/5'
                            }`}
                            title={showFilters ? 'Ẩn bộ lọc chi tiết' : 'Hiện bộ lọc chi tiết'}
                        >
                            <SlidersHorizontal
                                size={14}
                                className={showFilters ? 'rotate-180 transition-transform' : ''}
                            />
                            <span className='hidden sm:inline'>{showFilters ? 'Ẩn bộ lọc' : 'Bộ lọc'}</span>
                            {activeFilterCount > 0 && (
                                <span
                                    className={`px-1.5 py-0.2 text-[10px] font-black rounded-full shadow-xs ${
                                        showFilters || activeFilterCount > 0
                                            ? 'bg-white text-teal-700 dark:bg-zinc-900 dark:text-teal-300'
                                            : 'bg-teal-600 text-white'
                                    }`}
                                >
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {showFilters && (
                        <div
                            className={`p-3 rounded-2xl border backdrop-blur-2xl shadow-sm space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
                                isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-white/80 border-white/80'
                            }`}
                        >
                            <div className='flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-0.5'>
                                <button
                                    type='button'
                                    onClick={() => setStockFilter('ALL')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                        stockFilter === 'ALL'
                                            ? 'bg-teal-600 text-white shadow-sm'
                                            : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <Sparkles size={12} />
                                    <span>Tất cả ({stockCounts.all})</span>
                                </button>

                                <button
                                    type='button'
                                    onClick={() => setShowFavoritesOnly((prev) => !prev)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                        showFavoritesOnly
                                            ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                                            : 'text-rose-400 hover:bg-rose-500/10 hover:text-rose-500'
                                    }`}
                                >
                                    <Heart size={12} className={showFavoritesOnly ? 'fill-white' : ''} />
                                    <span>Yêu thích ({favoritesCount})</span>
                                </button>

                                <button
                                    type='button'
                                    onClick={() => setStockFilter('LOW')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                        stockFilter === 'LOW'
                                            ? 'bg-rose-500 text-white shadow-sm'
                                            : 'text-rose-500/90 hover:bg-rose-500/10'
                                    }`}
                                >
                                    <AlertCircle size={12} />
                                    <span>Sắp hết ≤200g ({stockCounts.low})</span>
                                </button>

                                <button
                                    type='button'
                                    onClick={() => setStockFilter('HALF')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                        stockFilter === 'HALF'
                                            ? 'bg-amber-500 text-white shadow-sm'
                                            : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <span>Dưới 500g ({stockCounts.half + stockCounts.low})</span>
                                </button>

                                <button
                                    type='button'
                                    onClick={() => setStockFilter('FULL')}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                        stockFilter === 'FULL'
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                                >
                                    <span>Đầy cuộn &gt;500g ({stockCounts.full})</span>
                                </button>
                            </div>

                            <div className='flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-inherit/40'>
                                <div className='flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-semibold flex-shrink-0'>
                                    <Filter size={12} />
                                    <span>Chi tiết:</span>
                                </div>

                                <select
                                    value={brandFilter}
                                    onChange={(e) => setBrandFilter(e.target.value)}
                                    className={`h-8 px-2.5 rounded-xl border text-xs outline-none transition-all cursor-pointer ${
                                        brandFilter !== 'ALL'
                                            ? 'bg-teal-500/15 border-teal-500 text-teal-600 dark:text-teal-300 font-bold'
                                            : isDark
                                              ? 'bg-zinc-800/80 border-white/10 text-zinc-200'
                                              : 'bg-white border-zinc-200 text-zinc-800 shadow-xs'
                                    }`}
                                >
                                    <option value='ALL'>Tất cả hãng ({uniqueBrands.length})</option>
                                    {uniqueBrands.map((b) => (
                                        <option key={b} value={b}>
                                            {b}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className={`h-8 px-2.5 rounded-xl border text-xs outline-none transition-all cursor-pointer ${
                                        typeFilter !== 'ALL'
                                            ? 'bg-teal-500/15 border-teal-500 text-teal-600 dark:text-teal-300 font-bold'
                                            : isDark
                                              ? 'bg-zinc-800/80 border-white/10 text-zinc-200'
                                              : 'bg-white border-zinc-200 text-zinc-800 shadow-xs'
                                    }`}
                                >
                                    <option value='ALL'>Tất cả loại ({uniqueTypes.length})</option>
                                    {uniqueTypes.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>

                                <div className='flex items-center gap-1 ml-auto'>
                                    <ArrowUpDown size={13} className='text-zinc-400 flex-shrink-0 hidden sm:block' />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as SortByType)}
                                        className={`h-8 px-2.5 rounded-xl border text-xs outline-none transition-all cursor-pointer ${
                                            isDark
                                                ? 'bg-zinc-800/80 border-white/10 text-zinc-200'
                                                : 'bg-white border-zinc-200 text-zinc-800 shadow-xs'
                                        }`}
                                    >
                                        <option value='weight-asc'>Khối lượng: Ít nhất trước (Ưu tiên dùng hết)</option>
                                        <option value='weight-desc'>Khối lượng: Nhiều nhất trước</option>
                                        <option value='favorite-first'>❤️ Mục yêu thích trước</option>
                                        <option value='brand-asc'>Hãng: A → Z</option>
                                        <option value='date-desc'>Mới cập nhật gần đây</option>
                                    </select>
                                </div>

                                {isFiltered && (
                                    <button
                                        type='button'
                                        onClick={handleResetFilters}
                                        className='h-8 px-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold flex items-center gap-1 transition-all cursor-pointer'
                                        title='Xóa tất cả bộ lọc'
                                    >
                                        <RotateCcw size={12} />
                                        <span>Xóa lọc</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {!showFilters && activeFilterCount > 0 && (
                        <div className='flex items-center gap-1.5 flex-wrap text-xs px-1 animate-in fade-in'>
                            <span className='opacity-60 text-[11px] font-medium'>Đang lọc:</span>
                            {showFavoritesOnly && (
                                <span className='px-2 py-0.5 rounded-lg bg-rose-500/15 text-rose-500 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1'>
                                    <Heart size={10} className='fill-rose-500' />
                                    Yêu thích
                                </span>
                            )}
                            {stockFilter !== 'ALL' && (
                                <span className='px-2 py-0.5 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-300 border border-teal-500/30 text-[11px] font-bold'>
                                    {stockFilter === 'LOW'
                                        ? 'Sắp hết (≤200g)'
                                        : stockFilter === 'HALF'
                                          ? 'Dưới 500g'
                                          : 'Đầy cuộn (>500g)'}
                                </span>
                            )}
                            {brandFilter !== 'ALL' && (
                                <span className='px-2 py-0.5 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-300 border border-teal-500/30 text-[11px] font-bold'>
                                    Hãng: {brandFilter}
                                </span>
                            )}
                            {typeFilter !== 'ALL' && (
                                <span className='px-2 py-0.5 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-300 border border-teal-500/30 text-[11px] font-bold'>
                                    Loại: {typeFilter}
                                </span>
                            )}
                            {sortBy !== 'weight-asc' && (
                                <span className='px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 text-[11px] font-semibold opacity-75'>
                                    {sortBy === 'weight-desc'
                                        ? 'Nhiều nhất'
                                        : sortBy === 'favorite-first'
                                          ? 'Yêu thích trước'
                                          : sortBy === 'brand-asc'
                                            ? 'Hãng A-Z'
                                            : 'Mới nhất'}
                                </span>
                            )}
                            <button
                                type='button'
                                onClick={handleResetFilters}
                                className='text-[11px] text-rose-500 hover:underline font-bold ml-1 cursor-pointer'
                            >
                                Xóa lọc
                            </button>
                        </div>
                    )}
                </div>
            )}

            {filaments.length === 0 ? (
                <div
                    className={`rounded-2xl sm:rounded-3xl border backdrop-blur-2xl shadow-xl p-12 text-center ${
                        isDark
                            ? 'bg-zinc-900/60 border-white/10 text-zinc-100'
                            : 'bg-white/80 border-white/80 text-zinc-900'
                    }`}
                >
                    <div className='w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 mx-auto flex items-center justify-center mb-3 border border-teal-500/20'>
                        <Layers size={22} />
                    </div>
                    <div className='font-bold text-sm mb-1'>Kho nhựa đang trống</div>
                    <div className='text-xs opacity-60 max-w-xs mx-auto mb-4'>
                        Hãy nhập thông tin cuộn nhựa đầu tiên để bắt đầu tính toán định lượng in.
                    </div>
                    <button
                        onClick={() => navigate('/add?tab=filament')}
                        className='inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-95 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-teal-500/20 transition-all cursor-pointer'
                    >
                        <Plus size={14} />
                        <span>Nhập kho nhựa mới</span>
                    </button>
                </div>
            ) : displayedFilaments.length === 0 ? (
                <div
                    className={`rounded-2xl sm:rounded-3xl border backdrop-blur-2xl shadow-xl p-10 text-center ${
                        isDark
                            ? 'bg-zinc-900/60 border-white/10 text-zinc-100'
                            : 'bg-white/80 border-white/80 text-zinc-900'
                    }`}
                >
                    <div className='w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3 border border-amber-500/20'>
                        <Search size={20} />
                    </div>
                    <div className='font-bold text-sm mb-1'>Không tìm thấy cuộn nhựa nào phù hợp</div>
                    <div className='text-xs opacity-60 max-w-xs mx-auto mb-4'>
                        Không có cuộn nhựa nào khớp với từ khóa tìm kiếm hoặc điều kiện lọc hiện tại.
                    </div>
                    <button
                        type='button'
                        onClick={handleResetFilters}
                        className='inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md shadow-teal-500/20 transition-all cursor-pointer'
                    >
                        <RotateCcw size={13} />
                        <span>Đặt lại bộ lọc</span>
                    </button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5'>
                    {displayedFilaments.map((item: Filament) => {
                        const currentWeight =
                            item.weight ?? (item.percentage !== undefined ? item.percentage * 10 : 1000)
                        const percentage = Math.min(100, Math.max(0, Math.round((currentWeight / 1000) * 100)))
                        const isLow = currentWeight <= 200
                        const isFav = !!item.isFavorite

                        return (
                            <div
                                key={item.id}
                                onClick={() => openFilamentModal(item)}
                                className={`relative p-3.5 sm:p-4 rounded-2xl border backdrop-blur-2xl transition-all duration-300 overflow-hidden group shadow-lg hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between ${
                                    isFav
                                        ? isDark
                                            ? 'bg-zinc-900/65 border-rose-500/30 text-zinc-100 shadow-black/40 hover:border-rose-500/50 hover:bg-zinc-900/80'
                                            : 'bg-white/75 border-rose-300/60 text-zinc-900 shadow-rose-500/5 hover:border-rose-400 hover:bg-white/90'
                                        : isDark
                                          ? 'bg-zinc-900/65 border-white/10 text-zinc-100 shadow-black/40 hover:border-teal-500/40 hover:bg-zinc-900/80'
                                          : 'bg-white/75 border-white/80 text-zinc-900 shadow-teal-500/5 hover:border-teal-300 hover:bg-white/90'
                                }`}
                            >
                                <div
                                    className='absolute top-0 right-0 w-20 h-20 rounded-bl-full pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity'
                                    style={{ backgroundColor: item.colorHex }}
                                />

                                {/* Nút tim góc trên phải - luôn hiển thị và nổi bật */}
                                <button
                                    type='button'
                                    onClick={(e) => toggleFavorite(e, item.id)}
                                    title={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                                    className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${
                                        isFav
                                            ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/35 hover:brightness-110 scale-105 ring-2 ring-rose-500/20'
                                            : isDark
                                              ? 'bg-zinc-800/90 border border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 shadow-sm'
                                              : 'bg-white/90 border border-zinc-200 text-zinc-400 hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50 shadow-sm'
                                    }`}
                                >
                                    <Heart size={15} className={`transition-all ${isFav ? 'fill-white' : ''}`} />
                                </button>

                                <div>
                                    {/* Hàng trên: Vòng tròn màu & mã hex (tránh bị nút tim đè) */}
                                    <div className='flex items-center gap-1.5 mb-2.5 pr-9'>
                                        <div
                                            className='w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white dark:border-zinc-800 shadow-md group-hover:scale-110 transition-transform flex-shrink-0'
                                            style={{ backgroundColor: item.colorHex }}
                                        />
                                        {item.colorHex && (
                                            <span className='font-mono text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 opacity-75'>
                                                {formatHex(item.colorHex)}
                                            </span>
                                        )}
                                    </div>

                                    <div className='mb-3'>
                                        <div className='font-black text-xs sm:text-sm truncate group-hover:text-teal-500 transition-colors pr-2'>
                                            {item.brand}
                                        </div>
                                        {/* Loại nhựa chuyển sang bên trái, bên dưới tên hãng/nhựa */}
                                        <div className='flex items-center gap-1.5 flex-wrap mt-1'>
                                            <span className='font-mono font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-300 border border-teal-500/30'>
                                                {item.type}
                                            </span>
                                            <span className='text-[10px] sm:text-[11px] opacity-60 truncate'>
                                                {item.colorName}
                                            </span>
                                        </div>
                                        {item.notes && (
                                            <div className='text-[10px] text-teal-400/90 truncate mt-1 italic'>
                                                {item.notes}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='pt-2 border-t border-inherit/40'>
                                    <div className='flex items-center justify-between text-[10px] sm:text-[11px] font-bold mb-1.5'>
                                        <span
                                            className={
                                                isLow
                                                    ? 'text-rose-500 font-extrabold flex items-center gap-0.5'
                                                    : 'opacity-80'
                                            }
                                        >
                                            {isLow && <AlertCircle size={10} />}
                                            {currentWeight}g
                                        </span>
                                        <span
                                            className={`text-[10px] ${isLow ? 'text-rose-500 font-bold' : 'opacity-60'}`}
                                        >
                                            {percentage}%
                                        </span>
                                    </div>

                                    <div
                                        className={`h-2 w-full rounded-full overflow-hidden p-0.5 border ${
                                            isDark
                                                ? 'bg-zinc-800/80 border-white/5'
                                                : 'bg-zinc-200/80 border-zinc-300/40'
                                        }`}
                                    >
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                isLow
                                                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                                                    : percentage < 50
                                                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                                      : 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-400'
                                            }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div
                    className={`rounded-2xl sm:rounded-3xl border backdrop-blur-2xl shadow-xl transition-all duration-300 overflow-hidden ${
                        isDark
                            ? 'bg-zinc-900/60 border-white/10 text-zinc-100 shadow-black/50'
                            : 'bg-white/80 border-white/80 text-zinc-900 shadow-orange-500/5'
                    }`}
                >
                    <div
                        className={`hidden md:grid grid-cols-12 px-6 py-3 text-[11px] font-bold uppercase tracking-wider border-b border-inherit/60 opacity-60 bg-black/[0.02] dark:bg-white/[0.02]`}
                    >
                        <div className='col-span-4'>Hãng & Màu sắc</div>
                        <div className='col-span-3'>Loại Nhựa</div>
                        <div className='col-span-4'>Dung lượng còn lại</div>
                        <div className='col-span-1 text-right'>Chi tiết</div>
                    </div>

                    <div className='divide-y divide-inherit/40'>
                        {displayedFilaments.map((item: Filament) => {
                            const currentWeight =
                                item.weight ?? (item.percentage !== undefined ? item.percentage * 10 : 1000)
                            const percentage = Math.min(100, Math.max(0, Math.round((currentWeight / 1000) * 100)))
                            const isLow = currentWeight <= 200

                            const isFav = !!item.isFavorite

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => openFilamentModal(item)}
                                    className={`px-4 sm:px-6 py-3 sm:py-3.5 md:grid md:grid-cols-12 md:items-center transition-all cursor-pointer text-xs group ${
                                        isFav
                                            ? 'hover:bg-rose-500/[0.04] dark:hover:bg-rose-500/[0.06]'
                                            : 'hover:bg-teal-500/[0.04] dark:hover:bg-white/[0.04]'
                                    }`}
                                >
                                    <div className='col-span-4 flex items-center gap-3'>
                                        <div className='relative flex-shrink-0'>
                                            <div
                                                className='w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/80 dark:border-white/20 shadow-md transition-transform group-hover:scale-110'
                                                style={{ backgroundColor: item.colorHex }}
                                            />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div className='font-bold text-xs sm:text-sm group-hover:text-teal-500 transition-colors flex items-center gap-1.5'>
                                                <span>{item.brand}</span>
                                                {item.colorHex && (
                                                    <span className='font-mono text-[9px] font-semibold px-1 py-0.2 rounded bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-400'>
                                                        {formatHex(item.colorHex)}
                                                    </span>
                                                )}
                                                {isLow && (
                                                    <span className='text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/20 font-bold'>
                                                        Sắp hết
                                                    </span>
                                                )}
                                            </div>
                                            <div className='opacity-60 text-[11px] flex items-center gap-1.5'>
                                                <span>{item.colorName}</span>
                                                {item.notes && (
                                                    <span className='text-[10px] text-teal-400/90 italic truncate max-w-[150px]'>
                                                        • {item.notes}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Nút tim cột cuối col-span-4 - luôn hiển thị và nổi bật */}
                                        <button
                                            type='button'
                                            onClick={(e) => toggleFavorite(e, item.id)}
                                            title={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 ${
                                                isFav
                                                    ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/30 scale-105 ring-2 ring-rose-500/20'
                                                    : isDark
                                                      ? 'bg-zinc-800/90 border border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 shadow-sm'
                                                      : 'bg-white border border-zinc-200 text-zinc-400 hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50 shadow-sm'
                                            }`}
                                        >
                                            <Heart
                                                size={14}
                                                className={`transition-all ${isFav ? 'fill-white' : ''}`}
                                            />
                                        </button>
                                    </div>

                                    <div className='col-span-3 opacity-80 text-xs hidden md:flex items-center gap-1.5'>
                                        <span className='font-mono font-bold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[11px]'>
                                            {item.type}
                                        </span>
                                    </div>

                                    <div className='col-span-4 my-2 md:my-0'>
                                        <div className='flex items-center justify-between text-[10px] sm:text-[11px] font-semibold mb-1'>
                                            <span className='md:hidden font-mono font-bold px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10'>
                                                {item.type}
                                            </span>
                                            <span
                                                className={`${isLow ? 'text-rose-500 font-bold flex items-center gap-0.5' : 'opacity-80'}`}
                                            >
                                                {isLow && <AlertCircle size={10} />}
                                                {currentWeight}g{' '}
                                                <span className='opacity-60 font-normal'>({percentage}%)</span>
                                            </span>
                                        </div>

                                        <div
                                            className={`h-2 w-full rounded-full overflow-hidden p-0.5 border ${
                                                isDark
                                                    ? 'bg-zinc-800/80 border-white/5'
                                                    : 'bg-zinc-200/80 border-zinc-300/40'
                                            }`}
                                        >
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    isLow
                                                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                                                        : percentage < 50
                                                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                                          : 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-400'
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className='col-span-1 text-right hidden md:flex justify-end opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-teal-400'>
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Hiệu ứng trái tim bay bổng toàn màn hình khi yêu thích */}
            {heartParticles.length > 0 && (
                <div className='fixed inset-0 pointer-events-none z-[9999] overflow-hidden'>
                    {heartParticles.map((p) => (
                        <div
                            key={p.id}
                            className='absolute animate-float-heart'
                            style={{
                                left: `${p.x}px`,
                                top: `${p.y}px`,
                                transform: 'translate(-50%, -50%)',
                                animation: `burstHeart ${p.duration}s cubic-bezier(0.22, 0.61, 0.36, 1) ${p.delay}s forwards`,
                                ['--tx' as any]: `${p.tx}px`,
                                ['--ty' as any]: `${p.ty}px`,
                                ['--rot' as any]: `${p.rotate}deg`,
                                ['--sc' as any]: p.scale
                            }}
                        >
                            <Heart
                                size={p.size}
                                fill={p.color}
                                color={p.color}
                                className='drop-shadow-[0_4px_14px_rgba(244,63,94,0.55)]'
                            />
                        </div>
                    ))}
                    <style>{`
            @keyframes burstHeart {
              0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.2) rotate(0deg);
              }
              15% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(var(--sc, 1.25)) rotate(calc(var(--rot) * 0.3));
              }
              60% {
                opacity: 0.95;
              }
              100% {
                opacity: 0;
                transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.5) rotate(var(--rot));
              }
            }
          `}</style>
                </div>
            )}
        </div>
    )
}

export default InventoryPage
