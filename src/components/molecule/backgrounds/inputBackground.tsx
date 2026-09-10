'use client'

import React from 'react'
import { Img } from '@/utils/img'

type Variant = 'aurora' | 'grid' | 'auroraGrid' | 'brand'
type Scheme = 'teal' | 'cyber' | 'midnight'

interface Props {
  variant?: Variant
  /** 0 a 1 */
  opacity?: number
  scheme?: Scheme
  /** imágenes opcionales de marca */
  penguinSrc?: string
  turtleSrc?: string
  className?: string
}

const schemes: Record<
  Scheme,
  { baseA: string; baseB: string; glow: string; gridLine: string }
> = {
  teal: {
    baseA: '#0b1016',
    baseB: '#0a3a48',
    glow: 'rgba(76, 196, 231, .28)',
    gridLine: 'rgba(255,255,255,.055)'
  },
  cyber: {
    baseA: '#0a0e17',
    baseB: '#0f172a',
    glow: 'rgba(56, 189, 248, .30)',
    gridLine: 'rgba(56,189,248,.065)'
  },
  midnight: {
    baseA: '#0a0b12',
    baseB: '#12131a',
    glow: 'rgba(110, 231, 255, .22)',
    gridLine: 'rgba(255,255,255,.045)'
  }
}

const InputBackground: React.FC<Props> = ({
  variant = 'brand',
  opacity = 0.95,
  scheme = 'teal',
  penguinSrc,
  turtleSrc,
  className
}) => {
  const colors = schemes[scheme]

  return (
    <div
      className={`pointer-events-none fixed inset-0 -z-10 ${className ?? ''}`}
      style={{ opacity }}
      aria-hidden
    >
      {/* Base */}
      <div
        className='absolute inset-0'
        style={{
          backgroundImage: `
            radial-gradient(55rem 28rem at 50% 8%, ${colors.glow}, transparent 62%),
            linear-gradient(125deg, ${colors.baseA}, ${colors.baseB})
          `
        }}
      />

      {/* Grid */}
      {(variant === 'grid' ||
        variant === 'auroraGrid' ||
        variant === 'brand') && (
        <div
          className='absolute inset-0 mix-blend-soft-light'
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, ${colors.gridLine} 0 1px, transparent 1px 36px),
              repeating-linear-gradient(90deg, ${colors.gridLine} 0 1px, transparent 1px 36px)
            `
          }}
        />
      )}

      {/* Auroras */}
      {(variant === 'aurora' ||
        variant === 'auroraGrid' ||
        variant === 'brand') && (
        <>
          <span className='aurora-blob left-[-14%] top-[-12%]' />
          <span className='aurora-blob right-[-18%] top-[8%] aurora-2' />
          <span className='aurora-blob left-[18%] bottom-[-18%] aurora-3' />
        </>
      )}

      {/* Marca (usa <Img />) */}
      {variant === 'brand' && (
        <>
          {penguinSrc && (
            <Img src={penguinSrc} alt='' className='brand-img brand-penguin' />
          )}
          {turtleSrc && (
            <Img src={turtleSrc} alt='' className='brand-img brand-turtle' />
          )}
        </>
      )}

      <style jsx>{`
        .aurora-blob {
          position: absolute;
          width: 42vw;
          height: 42vw;
          border-radius: 9999px;
          filter: blur(56px) saturate(115%);
          background: radial-gradient(
              circle at 30% 30%,
              rgba(12, 105, 128, 0.65),
              transparent 62%
            ),
            radial-gradient(
              circle at 70% 70%,
              rgba(103, 172, 189, 0.5),
              transparent 55%
            ),
            radial-gradient(
              circle at 50% 50%,
              rgba(10, 88, 107, 0.6),
              transparent 65%
            );
          animation: auroraMove 28s ease-in-out infinite alternate,
            auroraSpin 60s linear infinite;
        }
        .aurora-2 {
          width: 36vw;
          height: 36vw;
          animation-duration: 32s, 75s;
        }
        .aurora-3 {
          width: 50vw;
          height: 50vw;
          animation-duration: 34s, 90s;
        }
        @keyframes auroraMove {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(6%, -4%, 0) scale(1.05); }
          100% { transform: translate3d(-4%, 6%, 0) scale(1.1); }
        }
        @keyframes auroraSpin {
          from { rotate: 0deg; }
          to   { rotate: 360deg; }
        }
        .brand-img {
          position: absolute;
          width: clamp(220px, 26vw, 420px);
          opacity: 0.10;
          filter: grayscale(1) contrast(120%)
            drop-shadow(0 0 12px rgba(103, 172, 189, 0.12));
          mix-blend-lighten;
          user-select: none;
          pointer-events: none;
        }
        .brand-penguin {
          left: -4%;
          top: 12%;
          transform: rotate(-6deg);
        }
        .brand-turtle {
          right: -4%;
          bottom: 10%;
          transform: scaleX(-1) rotate(-8deg);
        }
      `}</style>
    </div>
  )
}

export default InputBackground
