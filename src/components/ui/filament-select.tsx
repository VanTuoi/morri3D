import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, Search, Check, Layers, AlertCircle } from 'lucide-react'
import type { Filament } from '~/types'
import { cn } from '~/lib/utils'

interface FilamentSelectProps {
  value?: string
  onChange: (inventoryId: string) => void
  filaments: Filament[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export const FilamentSelect: React.FC<FilamentSelectProps> = ({
  value,
  onChange,
  filaments,
  placeholder = '-- Chọn cuộn nhựa từ kho --',
  className,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedFilament = useMemo(() => {
    if (!value) return null
    return filaments.find((f) => f.id === value) || null
  }, [value, filaments])

  const filteredFilaments = useMemo(() => {
    if (!search.trim()) return filaments
    const query = search.toLowerCase().trim()
    return filaments.filter((f) => {
      const brand = (f.brand || '').toLowerCase()
      const type = (f.type || '').toLowerCase()
      const colorName = (f.colorName || '').toLowerCase()
      const colorHex = (f.colorHex || '').toLowerCase()
      return (
        brand.includes(query) ||
        type.includes(query) ||
        colorName.includes(query) ||
        colorHex.includes(query) ||
        `${brand} ${type}`.includes(query)
      )
    })
  }, [filaments, search])

  // Format hex code nicely (ensure # prefix and uppercase)
  const formatHex = (hex?: string) => {
    if (!hex) return ''
    const clean = hex.trim()
    return clean.startsWith('#') ? clean.toUpperCase() : `#${clean.toUpperCase()}`
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      // Focus search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className={cn('relative w-full text-left', className)} onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        type='button'
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        className={cn(
          'w-full min-h-[44px] sm:min-h-[48px] px-3.5 py-2 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 text-left select-none outline-none shadow-xs',
          'bg-white dark:bg-zinc-800/90 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100',
          'hover:border-orange-500/60 dark:hover:border-orange-500/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800',
          isOpen && 'ring-2 ring-orange-500/20 border-orange-500 dark:border-orange-500 shadow-md',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
      >
        <div className='flex items-center gap-2.5 min-w-0 flex-1'>
          {selectedFilament ? (
            <>
              {/* Color Swatch */}
              <span
                className='w-5 h-5 rounded-full ring-1 ring-black/20 dark:ring-white/25 shadow-xs flex-shrink-0 relative'
                style={{ backgroundColor: selectedFilament.colorHex || '#ccc' }}
              />

              {/* Hex Code Badge */}
              {selectedFilament.colorHex && (
                <span className='font-mono text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/10 flex-shrink-0'>
                  {formatHex(selectedFilament.colorHex)}
                </span>
              )}

              {/* Brand & Type & Color Name */}
              <div className='flex items-center gap-1.5 min-w-0 flex-1 truncate'>
                <span className='font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate'>
                  {selectedFilament.brand} {selectedFilament.type}
                </span>
                <span className='text-xs opacity-75 truncate text-zinc-600 dark:text-zinc-300'>
                  - {selectedFilament.colorName}
                </span>
              </div>
            </>
          ) : (
            <>
              <span className='w-5 h-5 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0'>
                <Layers size={12} />
              </span>
              <span className='text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 truncate'>
                {placeholder}
              </span>
            </>
          )}
        </div>

        <div className='flex items-center gap-2 flex-shrink-0'>
          {selectedFilament && (
            <span className='text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400'>
              {selectedFilament.weight ?? 1000}g
            </span>
          )}
          <ChevronDown
            size={16}
            className={cn('text-zinc-400 transition-transform duration-200', isOpen && 'rotate-180 text-orange-500')}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-2xl animate-in fade-in-0 zoom-in-95 duration-150',
            'bg-white/95 dark:bg-zinc-900/95 border-zinc-200 dark:border-white/15 text-zinc-900 dark:text-zinc-100'
          )}
        >
          {/* Quick Search Bar (if list is long) */}
          {filaments.length > 3 && (
            <div className='p-2.5 border-b border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-800/40'>
              <div className='relative'>
                <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400' />
                <input
                  ref={searchInputRef}
                  type='text'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Tìm hãng, loại nhựa, màu, mã hex...'
                  className='w-full h-8 pl-8 pr-3 text-xs rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-orange-500 dark:focus:border-orange-500 placeholder:text-zinc-400 transition-all'
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className='max-h-64 sm:max-h-72 overflow-y-auto p-1.5 space-y-1'>
            {filaments.length === 0 ? (
              <div className='p-4 text-center text-xs opacity-60 flex flex-col items-center gap-1.5'>
                <AlertCircle size={18} className='text-amber-500' />
                <span>Kho nhựa đang trống. Hãy thêm cuộn nhựa vào kho trước.</span>
              </div>
            ) : filteredFilaments.length > 0 ? (
              filteredFilaments.map((fil) => {
                const isSelected = value === fil.id
                return (
                  <div
                    key={fil.id}
                    onClick={() => {
                      onChange(fil.id)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className={cn(
                      'w-full px-3 py-2.5 rounded-xl flex items-center justify-between gap-2.5 transition-colors cursor-pointer text-left group',
                      isSelected
                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold'
                        : 'hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-800 dark:text-zinc-200'
                    )}
                  >
                    <div className='flex items-center gap-2.5 min-w-0 flex-1'>
                      {/* Color Swatch */}
                      <span
                        className='w-5 h-5 rounded-full ring-1 ring-black/20 dark:ring-white/25 shadow-xs flex-shrink-0'
                        style={{ backgroundColor: fil.colorHex || '#ccc' }}
                      />

                      {/* Hex Code Badge */}
                      {fil.colorHex && (
                        <span className='font-mono text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/10 flex-shrink-0 min-w-[62px] text-center'>
                          {formatHex(fil.colorHex)}
                        </span>
                      )}

                      {/* Filament Info */}
                      <div className='flex flex-col min-w-0 flex-1'>
                        <span className='font-bold text-xs sm:text-sm truncate text-zinc-900 dark:text-zinc-100'>
                          {fil.brand} {fil.type}
                        </span>
                        <span className='text-[11px] opacity-70 truncate text-zinc-600 dark:text-zinc-300'>
                          Màu: {fil.colorName}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center gap-2 flex-shrink-0'>
                      <span className='text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400'>
                        {fil.weight ?? 1000}g
                      </span>
                      {isSelected && <Check size={16} className='text-orange-500 flex-shrink-0' />}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className='p-4 text-center text-xs opacity-60'>Không tìm thấy cuộn nhựa phù hợp</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
