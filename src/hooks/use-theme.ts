import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

export const useTheme = () => {
    const getInitialTheme = (): 'light' | 'dark' => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme')
            if (stored === 'light' || stored === 'dark') return stored
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            return prefersDark ? 'dark' : 'light'
        }
        return 'light'
    }

    const [type, setType] = useState<'light' | 'dark'>(getInitialTheme)

    useEffect(() => {
        if (type === 'dark') {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [type])

    const toggleTheme = (e?: React.MouseEvent) => {
        const nextTheme = type === 'light' ? 'dark' : 'light'

        const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window)

        const isAppearanceTransition =
            !isMobile &&
            typeof document !== 'undefined' &&
            'startViewTransition' in document &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (!isAppearanceTransition) {
            setType(nextTheme)
            return
        }

        let x = window.innerWidth - 40
        let y = 40

        if (e && e.clientX !== undefined && (e.clientX !== 0 || e.clientY !== 0)) {
            x = e.clientX
            y = e.clientY
        } else if (
            e &&
            e.currentTarget &&
            typeof (e.currentTarget as HTMLElement).getBoundingClientRect === 'function'
        ) {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
            x = rect.left + rect.width / 2
            y = rect.top + rect.height / 2
        }

        const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

        const transition = (document as any).startViewTransition(() => {
            flushSync(() => {
                setType(nextTheme)
                if (nextTheme === 'dark') {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }
            })
        })

        transition.ready.then(() => {
            const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]

            document.documentElement.animate(
                {
                    clipPath: clipPath
                },
                {
                    duration: 450,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    pseudoElement: '::view-transition-new(root)'
                }
            )
        })
    }

    return { type, toggleTheme }
}
