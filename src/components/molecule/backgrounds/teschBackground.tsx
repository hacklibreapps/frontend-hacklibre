// src/components/molecule/backgrounds/TechBackground.tsx
'use client'

import React, { useEffect, useRef } from 'react'

type Variant = 'aurora' | 'constellation' | 'circuit'

type Props = {
  variant?: Variant
  className?: string
  /** 0–1 (para atenuar si quieres) */
  opacity?: number
}

export default function TechBackground({
  variant = 'aurora',
  className = '',
  opacity = 1
}: Props) {
  if (variant === 'constellation') {
    return <Constellation className={className} opacity={opacity} />
  }
  if (variant === 'circuit') {
    return <Circuit className={className} opacity={opacity} />
  }
  return <Aurora className={className} opacity={opacity} />
}

/* --------------------------- AURORA (CSS) --------------------------- */
function Aurora({
  className,
  opacity
}: {
  className?: string
  opacity: number
}) {
  return (
    <div
      aria-hidden='true'
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Blobs */}
      <div className='aurora-blob aurora-a' />
      <div className='aurora-blob aurora-b' />
      <div className='aurora-blob aurora-c' />

      {/* Sutile noise arriba para textura */}
      <div className='absolute inset-0 mix-blend-overlay opacity-[.08] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]' />

      <style jsx>{`
        .aurora-blob {
          position: absolute;
          width: 60vmax;
          height: 60vmax;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.7;
        }
        .aurora-a {
          left: -10%;
          top: -20%;
          background: radial-gradient(
              circle at 30% 30%,
              #0a586b,
              transparent 60%
            ),
            radial-gradient(circle at 70% 70%, #67acbd, transparent 60%);
          animation: floatA 22s ease-in-out infinite alternate;
        }
        .aurora-b {
          right: -15%;
          top: -10%;
          background: radial-gradient(
              circle at 40% 40%,
              #15a43e,
              transparent 60%
            ),
            radial-gradient(circle at 70% 20%, #0a586b, transparent 65%);
          animation: floatB 26s ease-in-out infinite alternate;
        }
        .aurora-c {
          left: 10%;
          bottom: -20%;
          background: radial-gradient(
              circle at 60% 40%,
              #67acbd,
              transparent 60%
            ),
            radial-gradient(circle at 20% 70%, #0a586b, transparent 60%);
          animation: floatC 28s ease-in-out infinite alternate;
        }
        @keyframes floatA {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(8%, 6%, 0) scale(1.08);
          }
        }
        @keyframes floatB {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(-6%, 4%, 0) scale(1.04);
          }
        }
        @keyframes floatC {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(4%, -6%, 0) scale(1.06);
          }
        }
        /* Respeta reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .aurora-a,
          .aurora-b,
          .aurora-c {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

/* ------------------------ CONSTELLATION (Canvas) ------------------------ */
function Constellation({
  className,
  opacity
}: {
  className?: string
  opacity: number
}) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d', { alpha: true })!
    let raf = 0
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    let width = 0
    let height = 0

    type P = { x: number; y: number; vx: number; vy: number }
    let points: P[] = []

    const COLORS = {
      dot: 'rgba(103,172,189,0.55)', // Cian4
      line: 'rgba(10,88,107,0.18)', // Cian8
      glow: 'rgba(21,164,62,0.10)' // Green7
    }

    const prefersReduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    function resize() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const density = prefersReduce ? 0.0008 : 0.0015 // puntos por px^2
      const target = Math.max(30, Math.floor(width * height * density))
      points = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (prefersReduce ? 0.1 : 0.35),
        vy: (Math.random() - 0.5) * (prefersReduce ? 0.1 : 0.35)
      }))
    }

    function step() {
      ctx.clearRect(0, 0, width, height)

      // glow fondo
      const grd = ctx.createRadialGradient(
        width * 0.6,
        height * 0.4,
        0,
        width * 0.6,
        height * 0.4,
        Math.max(width, height) * 0.8
      )
      grd.addColorStop(0, COLORS.glow)
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, width, height)

      // mover
      for (const p of points) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20
      }

      // líneas
      const maxDist = prefersReduce ? 80 : 120
      ctx.lineWidth = 1
      for (let i = 0; i < points.length; i++) {
        const a = points[i]
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < maxDist * maxDist) {
            const alpha = 1 - Math.sqrt(d2) / maxDist
            ctx.strokeStyle = COLORS.line.replace(
              /0\.18/,
              (0.08 + alpha * 0.1).toFixed(2)
            )
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // puntos
      for (const p of points) {
        ctx.fillStyle = COLORS.dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(step)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    if (!prefersReduce) raf = requestAnimationFrame(step)
    else step() // frame estático

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      aria-hidden='true'
      className={`pointer-events-none fixed inset-0 -z-10 ${className}`}
      style={{ opacity }}
    >
      <canvas ref={ref} className='h-full w-full block' />
    </div>
  )
}

/* -------------------------- CIRCUIT (SVG) -------------------------- */
function Circuit({
  className,
  opacity
}: {
  className?: string
  opacity: number
}) {
  return (
    <div
      aria-hidden='true'
      className={`pointer-events-none fixed inset-0 -z-10 ${className}`}
      style={{ opacity }}
    >
      <svg
        className='h-full w-full'
        viewBox='0 0 100 100'
        preserveAspectRatio='none'
      >
        <defs>
          <linearGradient id='g' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#0a586b' stopOpacity='0.55' />
            <stop offset='100%' stopColor='#67acbd' stopOpacity='0.35' />
          </linearGradient>
        </defs>
        {/* patrón repetido */}
        {Array.from({ length: 18 }).map((_, i) => (
          <path
            key={i}
            d={`M ${-10 + i * 8} 0 L ${10 + i * 8} 20 L ${-10 + i * 8} 40 L ${
              10 + i * 8
            } 60 L ${-10 + i * 8} 80 L ${10 + i * 8} 100`}
            fill='none'
            stroke='url(#g)'
            strokeWidth='0.35'
            className='animate-circuit'
            style={{ animationDelay: `${(i % 6) * 0.4}s` }}
          />
        ))}
      </svg>

      <style jsx>{`
        .animate-circuit {
          stroke-dasharray: 10 8;
          stroke-linecap: round;
          animation: dash 8s linear infinite;
        }
        @keyframes dash {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -180;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-circuit {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
