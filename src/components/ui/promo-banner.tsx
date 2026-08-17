import React from 'react'
import { ShoppingBag, ExternalLink, Sparkles, Tag } from 'lucide-react'

interface PromoBannerProps {
  variant?: 'compact' | 'wide'
  theme?: 'dark' | 'light'
  title?: string
  description?: string
  link?: string
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  variant = 'wide',
  theme = 'dark',
  title = 'Săn Nhựa In 3D & Phụ Kiện Giá Rẻ',
  description = 'Tổng hợp cuộn nhựa PLA / PETG / TPU chính hãng ưu đãi trên Shopee',
  link = 'https://shopee.vn/search?keyword=nh%E1%BB%B1a%20in%203d%20pla'
}) => {
  const isDark = theme === 'dark'

  // Bật/tắt quảng cáo qua biến môi trường VITE_ENABLE_ADS (mặc định: tắt)
  const isAdsEnabled = import.meta.env.VITE_ENABLE_ADS === 'true' || import.meta.env.VITE_ENABLE_ADS === '1'

  if (!isAdsEnabled) return null

  if (variant === 'compact') {
    return (
      <a
        href={link}
        target='_blank'
        rel='noopener noreferrer'
        className={`block p-2.5 rounded-2xl border transition-all duration-300 group select-none relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border-orange-500/25 hover:border-orange-500/50 hover:bg-orange-500/15'
            : 'bg-white/90 border-orange-300 shadow-sm hover:shadow-md hover:border-orange-400'
        }`}
      >
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2 min-w-0'>
            <div className='w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-orange-500/30 group-hover:scale-105 transition-transform'>
              <ShoppingBag size={14} />
            </div>
            <div className='min-w-0'>
              <div className='font-bold text-xs truncate group-hover:text-orange-500 transition-colors flex items-center gap-1'>
                <span>Shopee 3D Mall</span>
                <Sparkles size={10} className='text-amber-400 animate-pulse' />
              </div>
              <div className='text-[10px] opacity-60 truncate'>Nhựa in PLA & Phụ kiện</div>
            </div>
          </div>
          <ExternalLink
            size={13}
            className='text-orange-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0'
          />
        </div>
      </a>
    )
  }

  return (
    <a
      href={link}
      target='_blank'
      rel='noopener noreferrer'
      className={`block p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border backdrop-blur-2xl transition-all duration-300 group select-none relative overflow-hidden shadow-lg hover:-translate-y-0.5 ${
        isDark
          ? 'bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-zinc-900/60 border-orange-500/30 hover:border-orange-500/60 shadow-black/40'
          : 'bg-gradient-to-r from-orange-50 via-amber-50/60 to-white/80 border-orange-200 hover:border-orange-400 shadow-orange-500/10'
      }`}
    >
      <div className='absolute -right-6 -bottom-6 w-28 h-28 bg-orange-500/15 rounded-full filter blur-xl pointer-events-none group-hover:scale-125 transition-transform' />

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform'>
            <ShoppingBag size={20} />
          </div>

          <div>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1'>
                <Tag size={10} /> Ưu đãi Shopee
              </span>
              <span className='text-[10px] opacity-60 font-semibold hidden sm:inline'>• Tiếp thị liên kết</span>
            </div>

            <div className='font-black text-xs sm:text-sm mt-1 group-hover:text-orange-500 transition-colors'>
              {title}
            </div>
            <p className='text-[11px] opacity-70 mt-0.5 line-clamp-1'>{description}</p>
          </div>
        </div>

        <div className='self-end sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/15 text-orange-500 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all text-xs font-bold shadow-xs'>
          <span>Mua trên Shopee</span>
          <ExternalLink size={13} className='group-hover:translate-x-0.5 transition-transform' />
        </div>
      </div>
    </a>
  )
}
