import React, { useRef, useState, useEffect } from 'react';

export interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  theme?: 'dark' | 'light';
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number | string;
  padding?: string;
  mouseContainer?: React.RefObject<HTMLElement | null>;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  className = '',
  theme = 'dark',
  displacementScale = 64,
  blurAmount = 24,
  saturation = 130,
  aberrationIntensity = 2,
  elasticity = 0.35,
  cornerRadius = 24,
  padding,
  mouseContainer,
  style = {},
  onClick,
  ...props
}) => {
  const isDark = theme === 'dark';
  const internalRef = useRef<HTMLDivElement>(null);
  const filterId = useRef(`liquid-glass-filter-${Math.random().toString(36).slice(2, 9)}`);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    const targetElement = mouseContainer?.current || internalRef.current;
    if (!targetElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = targetElement.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      setMousePos({ x, y, active: true });
    };

    const handleMouseLeave = () => {
      setMousePos(prev => ({ ...prev, active: false }));
    };

    targetElement.addEventListener('mousemove', handleMouseMove);
    targetElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      targetElement.removeEventListener('mousemove', handleMouseMove);
      targetElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseContainer]);

  const radiusValue = typeof cornerRadius === 'number' ? `${cornerRadius}px` : cornerRadius;
  const blurPx = blurAmount <= 1 ? blurAmount * 240 : blurAmount;

  return (
    <div
      ref={internalRef}
      onClick={onClick}
      style={{
        borderRadius: radiusValue,
        padding: padding,
        backdropFilter: `blur(${blurPx}px) saturate(${saturation}%)`,
        WebkitBackdropFilter: `blur(${blurPx}px) saturate(${saturation}%)`,
        ...style
      }}
      className={`relative overflow-hidden border transition-all duration-200 ${
        isDark
          ? 'bg-zinc-900/70 border-white/[0.12] text-zinc-100 shadow-[0_16px_50px_rgba(0,0,0,0.6)]'
          : 'bg-white/75 border-white/80 text-zinc-900 shadow-[0_16px_50px_rgba(251,146,60,0.18)]'
      } ${className}`}
      {...props}
    >
      {/* SVG Liquid Displacement & Chromatic Aberration Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <filter id={filterId.current} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.02" 
            numOctaves={aberrationIntensity} 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale={displacementScale * elasticity * 0.15} 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </svg>

      {/* Dynamic Specular Light Glare following mouse container */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: mousePos.active ? (isDark ? 0.7 : 0.9) : 0.3,
          background: `radial-gradient(circle 220px at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${
            isDark ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.6)'
          }, transparent 70%)`
        }}
      />

      {/* Specular Top Rim Reflection */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default LiquidGlass;
