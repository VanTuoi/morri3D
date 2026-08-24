import React, { useEffect, useState } from 'react'
import cheemsBonkWebp from '@/assets/cheems_bonk.webp'

export interface BonkEvent {
  id: number
  x: number
  y: number
  createdAt: number
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vRot: number
  size: number
  type: 'broken-heart' | 'star' | 'sweat'
}

// Synthesize a fun cartoonish "BONK!" sound using Web Audio API
const playBonkSound = () => {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()

    const now = ctx.currentTime

    // Main thud oscillator
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(420, now)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.18)

    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.22)

    // Impact click
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(750, now)
    osc2.frequency.exponentialRampToValueAtTime(120, now + 0.08)

    gain2.gain.setValueAtTime(0.25, now)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

    osc2.connect(gain2)
    gain2.connect(ctx.destination)

    osc2.start(now)
    osc2.stop(now + 0.09)
  } catch {
    // Audio might be blocked by browser autoplay policy if not within user gesture
  }
}

export const CheemsBonkOverlay: React.FC<{
  events: BonkEvent[]
  onFinishEvent?: (id: number) => void
}> = ({ events }) => {
  const [particles, setParticles] = useState<Particle[]>([])

  // Play sound & generate particles on new bonk event
  useEffect(() => {
    if (events.length === 0) return

    const latestEvent = events[events.length - 1]
    // Play sound right as bat hits (around 350-400ms into the animation)
    const soundTimer = setTimeout(() => {
      playBonkSound()
    }, 380)

    // Spawn broken heart & star particles at impact
    const particleTimer = setTimeout(() => {
      const newParticles: Particle[] = []
      const count = 7
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2
        const speed = 70 + Math.random() * 90
        newParticles.push({
          id: Date.now() + i,
          x: latestEvent.x,
          y: latestEvent.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 40,
          rot: (Math.random() - 0.5) * 180,
          vRot: (Math.random() - 0.5) * 360,
          size: 22 + Math.random() * 12,
          type: i % 2 === 0 ? 'broken-heart' : i % 3 === 0 ? 'star' : 'sweat'
        })
      }
      setParticles((prev) => [...prev, ...newParticles])
    }, 400)

    return () => {
      clearTimeout(soundTimer)
      clearTimeout(particleTimer)
    }
  }, [events])

  // Clean up particles
  useEffect(() => {
    if (particles.length === 0) return
    const timer = setTimeout(() => {
      setParticles([])
    }, 1500)
    return () => clearTimeout(timer)
  }, [particles])

  if (events.length === 0 && particles.length === 0) return null

  // Dimensions scaled to 75% (315px x 177.2px) for maximum crispness and high pixel density
  const IMG_WIDTH = 315
  const IMG_HEIGHT = 177.19
  // Bat impact point in 320x180 (shifted slightly right to hit with the bat sweet spot)
  const IMPACT_X = IMG_WIDTH * (68 / 320) // ~66.9px (shifts image +20px to the right)
  const IMPACT_Y = IMG_HEIGHT * (98.8 / 180) // ~97.3px

  return (
    <div className='fixed inset-0 pointer-events-none z-[99999] overflow-hidden'>
      {/* Cheems bonk instances */}
      {events.map((ev) => {
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
        // Cheems body extends to the right by (IMG_WIDTH - IMPACT_X) ~228px
        // If within 230px of right screen edge, flip horizontally around the exact impact pivot!
        const isFlipped = ev.x + (IMG_WIDTH - IMPACT_X) > screenWidth - 20

        // Dịch sang phải 40px rõ rệt theo yêu cầu
        const SHIFT_RIGHT_PX = 50
        const left = ev.x - IMPACT_X + SHIFT_RIGHT_PX
        const top = ev.y - IMPACT_Y

        return (
          <React.Fragment key={ev.id}>
            {/* Cheems container: flipped around the exact impact point (IMPACT_X, IMPACT_Y) */}
            <div
              className='absolute pointer-events-none animate-cheems-fade'
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${IMG_WIDTH}px`,
                height: `${IMG_HEIGHT}px`,
                transform: isFlipped ? 'scaleX(-1)' : 'none',
                transformOrigin: `${IMPACT_X}px ${IMPACT_Y}px`
              }}
            >
              {/* Cheems animated webp */}
              <img
                key={ev.id}
                src={`${cheemsBonkWebp}#bonk-${ev.id}`}
                alt='Cheems Bonk'
                className='w-full h-full object-contain filter drop-shadow-[0_16px_32px_rgba(0,0,0,0.4)] contrast-[1.06] brightness-[1.02]'
              />
            </div>

            {/* Impact Shockwave Ring anchored directly at screen coordinate (ev.x, ev.y) */}
            <div
              className='absolute pointer-events-none animate-bonk-shockwave rounded-full border-2 border-red-400/90'
              style={{
                left: `${ev.x}px`,
                top: `${ev.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          </React.Fragment>
        )
      })}

      {/* Broken heart & spark particles flying upon impact */}
      {particles.map((p) => (
        <div
          key={p.id}
          className='absolute pointer-events-none animate-bonk-particle select-none'
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            ['--vx' as string]: `${p.vx}px`,
            ['--vy' as string]: `${p.vy}px`,
            ['--rot' as string]: `${p.vRot}deg`,
            fontSize: `${p.size}px`
          }}
        >
          {p.type === 'broken-heart' ? '💔' : p.type === 'star' ? '⭐' : '💦'}
        </div>
      ))}

      <style>{`
        @keyframes cheemsFade {
          0% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-cheems-fade {
          animation: cheemsFade 1.25s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes bonkShockwave {
          0%, 30% {
            width: 0px;
            height: 0px;
            opacity: 0;
          }
          35% {
            width: 10px;
            height: 10px;
            opacity: 0.9;
          }
          65% {
            width: 65px;
            height: 65px;
            opacity: 0;
          }
          100% {
            width: 70px;
            height: 70px;
            opacity: 0;
          }
        }
        .animate-bonk-shockwave {
          animation: bonkShockwave 1.25s ease-out forwards;
        }

        @keyframes bonkParticle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.4) rotate(0deg);
          }
          40% {
            opacity: 1;
            transform: translate(calc(-50% + var(--vx) * 0.6), calc(-50% + var(--vy) * 0.6)) scale(1.15) rotate(calc(var(--rot) * 0.5));
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy) + 120px)) scale(0.5) rotate(var(--rot));
          }
        }
        .animate-bonk-particle {
          animation: bonkParticle 0.85s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  )
}

export default CheemsBonkOverlay
