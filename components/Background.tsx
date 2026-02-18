'use client'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/usePerformance'

/*
  PERFORMANCE-FIRST background:
  - Single canvas for stars (replaces multiple animated divs)
  - CSS-only aurora (no canvas, no JS, GPU composited via transform)
  - No backdrop-filter, no filter:blur on animated elements (main lag source)
  - will-change: transform on orbs so browser puts them on own GPU layer
  - Scanlines via CSS background-image (zero paint cost)
  - Vignette via single CSS gradient (zero paint cost)
  - All orbs use opacity + transform only (compositor-only properties)
*/

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })!

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    // Detect mobile once
    const isMobile = W < 768

    type Star = { x: number; y: number; r: number; base: number; phase: number; speed: number }
    const COUNT = isMobile ? 55 : 120

    const stars: Star[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.0 + 0.3,
      base: Math.random() * 0.5 + 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.15,
    }))

    // If reduced motion — draw once, static
    if (prefersReduced) {
      stars.forEach(s => {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,200,255,${s.base})`
        ctx.fill()
      })
      return
    }

    let t = 0
    let raf: number
    let lastTime = 0
    const FPS_CAP = isMobile ? 24 : 40 // cap FPS on mobile
    const INTERVAL = 1000 / FPS_CAP

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      if (now - lastTime < INTERVAL) return
      lastTime = now
      t += 0.016

      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const a = s.base + 0.15 * Math.sin(t * s.speed + s.phase)
        ctx.globalAlpha = a
        ctx.fillStyle = '#c0d0ff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(draw)

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [prefersReduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        opacity: 0.8,
      }}
    />
  )
}

export default function Background() {
  return (
    <>
      {/* ── 1. Deep base gradient (pure CSS, zero cost) ── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: `
          linear-gradient(160deg,
            #03040f 0%,
            #060818 30%,
            #050715 60%,
            #030410 85%,
            #020309 100%
          )
        `,
      }} />

      {/* ── 2. Star canvas (single canvas, FPS-capped) ── */}
      <StarCanvas />

      {/* ── 3. Aurora orbs — CSS animation only, transform+opacity (GPU composited)
               NO filter:blur on animated elements — blur is pre-baked via border-radius + transparency
               The "blur" effect comes from large soft radial-gradients, not CSS filter
      ── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 1,
        pointerEvents: 'none', overflow: 'hidden',
      }}>
        {/* Orb A — blue/indigo top-left */}
        <div style={{
          position: 'absolute',
          top: '-25%', left: '-15%',
          width: '65vw', height: '65vw',
          maxWidth: '700px', maxHeight: '700px',
          background: 'radial-gradient(circle at 40% 40%, rgba(79,110,247,0.16) 0%, rgba(100,60,200,0.07) 45%, transparent 70%)',
          borderRadius: '50%',
          animation: 'orb-a 16s ease-in-out infinite',
          willChange: 'transform',
        }} />

        {/* Orb B — purple/pink bottom-right */}
        <div style={{
          position: 'absolute',
          bottom: '-20%', right: '-15%',
          width: '60vw', height: '60vw',
          maxWidth: '650px', maxHeight: '650px',
          background: 'radial-gradient(circle at 60% 60%, rgba(124,58,237,0.13) 0%, rgba(200,40,120,0.06) 45%, transparent 70%)',
          borderRadius: '50%',
          animation: 'orb-b 20s ease-in-out infinite',
          willChange: 'transform',
        }} />

        {/* Orb C — teal mid, small */}
        <div style={{
          position: 'absolute',
          top: '40%', right: '-5%',
          width: '40vw', height: '40vw',
          maxWidth: '450px', maxHeight: '450px',
          background: 'radial-gradient(circle at 50% 50%, rgba(6,214,160,0.08) 0%, transparent 65%)',
          borderRadius: '50%',
          animation: 'orb-c 13s ease-in-out infinite',
          willChange: 'transform',
        }} />
      </div>

      {/* ── 4. Grid lines (CSS, zero paint) ── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 2,
        pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(79,110,247,0.028) 1px, transparent 1px),
          linear-gradient(90deg, rgba(79,110,247,0.028) 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
        // Fade grid at top/bottom edges
        maskImage: 'linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%)',
      }} />

      {/* ── 5. Scanlines (CSS repeating gradient, zero JS) ── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 3,
        pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,8,0.06) 3px, rgba(0,0,8,0.06) 4px)',
        opacity: 0.5,
      }} />

      {/* ── 6. Vignette (CSS radial, zero JS) ── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 4,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse 110% 90% at 50% 50%, transparent 35%, rgba(2,3,10,0.65) 100%)',
      }} />

      <style>{`
        @keyframes orb-a {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(4vw, 3vh) scale(1.06); }
        }
        @keyframes orb-b {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-3vw,-4vh) scale(1.04); }
        }
        @keyframes orb-c {
          0%,100% { transform: translate(0,0); }
          50%      { transform: translate(-3vw, 4vh); }
        }
        @media (prefers-reduced-motion: reduce) {
          .orb-a, .orb-b, .orb-c { animation: none !important; }
        }
        @media (max-width: 768px) {
          /* Slower orbs on mobile to reduce compositing cost */
          @keyframes orb-a { 0%,100%{transform:none} 50%{transform:translate(2vw,2vh)} }
          @keyframes orb-b { 0%,100%{transform:none} 50%{transform:translate(-2vw,-2vh)} }
          @keyframes orb-c { display: none; }
        }
      `}</style>
    </>
  )
}