'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion, useIsMobile, useIsLowEnd } from '@/lib/usePerformance'

const ROLES = [
  'Full Stack Developer',
  'React & Next.js Engineer',
  'Three.js / WebGL Builder',
  'UI/UX Craftsman',
  'Node.js Architect',
]

const FIRST = 'GAURAV'
const LAST  = 'SOOD'

/* ═══════════════════════════════════════════════════
   CURSOR BLOB — rAF lerp, no Framer overhead
═══════════════════════════════════════════════════ */
function CursorBlob() {
  const blobRef   = useRef<HTMLDivElement>(null)
  const pos       = useRef({ x: 0, y: 0 })
  const cur       = useRef({ x: 0, y: 0 })
  const raf       = useRef<number>()
  const isMobile  = useIsMobile()
  const isLowEnd  = useIsLowEnd()
  const isReduced = useReducedMotion()

  useEffect(() => {
    if (isMobile || isLowEnd || isReduced) return
    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove, { passive: true })
    const loop = () => {
      cur.current.x += (pos.current.x - cur.current.x) * 0.07
      cur.current.y += (pos.current.y - cur.current.y) * 0.07
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(${cur.current.x - 220}px, ${cur.current.y - 220}px)`
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [isMobile, isLowEnd, isReduced])

  if (isMobile || isLowEnd || isReduced) return null
  return (
    <div ref={blobRef} aria-hidden="true" style={{
      position: 'fixed', top: 0, left: 0,
      width: 440, height: 440, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(79,110,247,0.07) 0%, transparent 70%)',
      pointerEvents: 'none', zIndex: 0, willChange: 'transform',
    }} />
  )
}

/* ═══════════════════════════════════════════════════
   PARTICLE CANVAS — mobile-aware, GPU-lean
═══════════════════════════════════════════════════ */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isLowEnd  = useIsLowEnd()
  const isReduced = useReducedMotion()
  const isMobile  = useIsMobile()

  useEffect(() => {
    if (isLowEnd || isReduced) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d', { alpha: true })!
    let W = window.innerWidth, H = window.innerHeight
    canvas.width = W; canvas.height = H

    const COUNT     = isMobile ? 18 : 50
    const LINK_DIST = isMobile ? 0 : 105   // skip lines on mobile entirely

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number }
    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.28 + 0.06,
    }))

    let mouse = { x: -999, y: -999 }
    const onMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY } }
    if (!isMobile) window.addEventListener('mousemove', onMove, { passive: true })

    let raf: number
    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]
        if (!isMobile) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy)
          if (d < 160 && d > 0) { p.vx += dx / d * 0.012; p.vy += dy / d * 0.012 }
        }
        p.vx *= 0.993; p.vy *= 0.993
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0

        if (LINK_DIST > 0) {
          for (let j = i + 1; j < pts.length; j++) {
            const q = pts[j]
            const d = Math.hypot(p.x - q.x, p.y - q.y)
            if (d < LINK_DIST) {
              ctx.beginPath()
              ctx.strokeStyle = `rgba(79,110,247,${0.065 * (1 - d / LINK_DIST)})`
              ctx.lineWidth = 0.5
              ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
              ctx.stroke()
            }
          }
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(120,140,255,${p.a})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      if (!isMobile) window.removeEventListener('mousemove', onMove)
    }
  }, [isLowEnd, isReduced, isMobile])

  if (isLowEnd || isReduced) return null
  return <canvas ref={canvasRef} aria-hidden="true"
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, willChange: 'auto' }} />
}

/* ═══════════════════════════════════════════════════
   FLOATING GLOWS
═══════════════════════════════════════════════════ */
function Glows() {
  const isMobile = useIsMobile()
  const isLowEnd = useIsLowEnd()

  // Mobile / low-end: static, zero JS cost
  if (isMobile || isLowEnd) return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-14%', left: '-10%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,110,247,0.11) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: '-14%', right: '-8%',  width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
    </div>
  )

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <motion.div animate={{ x: [0,34,0], y: [0,22,0], scale: [1,1.06,1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '-22%', left: '-12%', width: '680px', height: '680px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,110,247,0.13) 0%, transparent 70%)', willChange: 'transform' }} />
      <motion.div animate={{ x: [0,-22,0], y: [0,30,0], scale: [1,1.04,1] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{ position: 'absolute', bottom: '-22%', right: '-12%', width: '580px', height: '580px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', willChange: 'transform' }} />
      <motion.div animate={{ x: [0,12,0], y: [0,-18,0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{ position: 'absolute', top: '28%', right: '18%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,214,160,0.07) 0%, transparent 70%)', willChange: 'transform' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   GRID — pure CSS, zero runtime cost
═══════════════════════════════════════════════════ */
function GridOverlay() {
  const isMobile = useIsMobile()
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
      backgroundImage: `linear-gradient(rgba(79,110,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(79,110,247,0.04) 1px, transparent 1px)`,
      backgroundSize: isMobile ? '36px 36px' : '56px 56px',
      maskImage: 'radial-gradient(ellipse 72% 72% at 50% 50%, black 0%, transparent 100%)',
      WebkitMaskImage: 'radial-gradient(ellipse 72% 72% at 50% 50%, black 0%, transparent 100%)',
    }} />
  )
}

/* ═══════════════════════════════════════════════════
   SCANLINES — pure CSS, literally free
═══════════════════════════════════════════════════ */
function Scanlines() {
  const isLowEnd = useIsLowEnd()
  if (isLowEnd) return null
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.016) 2px, rgba(0,0,0,0.016) 4px)',
      mixBlendMode: 'overlay',
    }} />
  )
}

/* ═══════════════════════════════════════════════════
   CORNER BRACKETS
═══════════════════════════════════════════════════ */
function CornerDeco() {
  const isMobile = useIsMobile()
  if (isMobile) return null
  const bar: React.CSSProperties = { position: 'absolute', background: 'rgba(79,110,247,0.38)' }
  return (
    <>
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.45, duration: 0.65, ease: [0.16,1,0.3,1] }}
        style={{ position: 'absolute', top: '28px', left: '30px', zIndex: 4, width: '32px', height: '32px' }}>
        <div style={{ ...bar, width: '100%', height: '1.5px', top: 0, left: 0 }} />
        <div style={{ ...bar, width: '1.5px', height: '100%', top: 0, left: 0 }} />
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.55, duration: 0.65, ease: [0.16,1,0.3,1] }}
        style={{ position: 'absolute', bottom: '28px', right: '30px', zIndex: 4, width: '32px', height: '32px' }}>
        <div style={{ ...bar, width: '100%', height: '1.5px', bottom: 0, right: 0 }} />
        <div style={{ ...bar, width: '1.5px', height: '100%', bottom: 0, right: 0 }} />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.8 }}
        style={{
          position: 'absolute', right: '28px', top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
          color: 'rgba(130,145,200,0.28)', letterSpacing: '0.28em',
          textTransform: 'uppercase', zIndex: 4, whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
        Portfolio · 2025
      </motion.div>
    </>
  )
}

/* ═══════════════════════════════════════════════════
   LETTER REVEAL — staggered cinematic drop + skew
═══════════════════════════════════════════════════ */
function RevealName() {
  const isMobile  = useIsMobile()
  const isReduced = useReducedMotion()

  const letter = (i: number, color: string, delay: number) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: isReduced ? 0 : 70, rotateX: isReduced ? 0 : -50, skewY: isReduced ? 0 : 5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, skewY: 0 }}
      transition={{ duration: 0.62, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'inline-block',
        background: color,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        willChange: 'transform, opacity',
      }}
    >
    </motion.span>
  )

  return (
    <h1 aria-label="Gaurav Sood" style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(4.2rem, 13.5vw, 10.5rem)',
      fontWeight: 900, lineHeight: 0.86,
      letterSpacing: '-0.045em',
      marginBottom: '0.12em',
      perspective: '900px',
      userSelect: 'none',
      cursor: 'default',
    }}>
      {/* GAURAV */}
      <div style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.06em' }}>
        {FIRST.split('').map((ch, i) => (
          <motion.span key={i}
            initial={{ opacity: 0, y: isReduced ? 0 : 72, rotateX: isReduced ? 0 : -48, skewY: isReduced ? 0 : 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, skewY: 0 }}
            transition={{ duration: 0.62, delay: 0.14 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(155deg, #e8eaf6 20%, #a8b8ff 55%, #4f6ef7 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              willChange: 'transform, opacity',
            }}
          >
            {ch}
          </motion.span>
        ))}
      </div>

      {/* SOOD — nudged right on desktop for editorial asymmetry */}
      <div style={{
        display: 'block', overflow: 'hidden', paddingBottom: '0.06em',
        paddingLeft: isMobile ? '0' : '0.16em',
        position: 'relative',
      }}>
        {LAST.split('').map((ch, i) => (
          <motion.span key={i}
            initial={{ opacity: 0, y: isReduced ? 0 : 72, rotateX: isReduced ? 0 : -48, skewY: isReduced ? 0 : 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, skewY: 0 }}
            transition={{ duration: 0.62, delay: 0.55 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(155deg, #34d399 0%, #06d6a0 40%, #4f6ef7 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              willChange: 'transform, opacity',
            }}
          >
            {ch}
          </motion.span>
        ))}

        {/* Animated accent underline */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            transformOrigin: 'left',
            height: '3px', marginTop: '6px',
            background: 'linear-gradient(90deg, #06d6a0 0%, #4f6ef7 50%, transparent 100%)',
            borderRadius: '2px',
          }}
        />
      </div>
    </h1>
  )
}

/* ═══════════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════════ */
function TypewriterRole() {
  const [idx,   setIdx]   = useState(0)
  const [chars, setChars] = useState('')
  const [del,   setDel]   = useState(false)
  const [ci,    setCi]    = useState(0)
  const isReduced = useReducedMotion()

  useEffect(() => {
    if (isReduced) { setChars(ROLES[0]); return }
    const target = ROLES[idx]
    const speed  = del ? 26 : 68
    const t = setTimeout(() => {
      if (!del) {
        if (ci < target.length) { setChars(target.slice(0, ci + 1)); setCi(c => c + 1) }
        else setTimeout(() => setDel(true), 2000)
      } else {
        if (ci > 0) { setChars(target.slice(0, ci - 1)); setCi(c => c - 1) }
        else { setDel(false); setIdx(i => (i + 1) % ROLES.length) }
      }
    }, speed)
    return () => clearTimeout(t)
  }, [ci, del, idx, isReduced])

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '10px',
      padding: '7px 16px',
      border: '1px solid rgba(79,110,247,0.22)',
      borderRadius: '8px',
      background: 'rgba(79,110,247,0.05)',
      backdropFilter: 'blur(6px)',
    }}>
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: '#06d6a0', flexShrink: 0,
        boxShadow: '0 0 8px #06d6a0',
        animation: 'signalPulse 2s ease-in-out infinite',
      }} />
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(0.72rem, 1.8vw, 0.92rem)',
        color: 'rgba(175,190,255,0.9)',
        letterSpacing: '0.04em',
        minWidth: '210px',
        textAlign: 'left',
      }}>
        {chars}
        <span style={{
          display: 'inline-block', width: '2px', height: '0.85em',
          background: '#4f6ef7', marginLeft: '2px', verticalAlign: 'middle',
          animation: 'blink 1s step-end infinite',
        }} />
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   STAT CHIP
═══════════════════════════════════════════════════ */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.5rem, 3vw, 2.3rem)',
        fontWeight: 800, lineHeight: 1,
        background: 'linear-gradient(135deg, #ffffff 30%, #7b9fff 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
        color: 'rgba(145,160,210,0.52)', letterSpacing: '0.18em',
        textTransform: 'uppercase', marginTop: '5px',
      }}>
        {label}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   HERO — MAIN
═══════════════════════════════════════════════════ */
export default function Hero() {
  const isMobile = useIsMobile()

  return (
    <section
      id="home"
      aria-label="Hero"
      style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(175deg, rgb(5,6,18) 0%, rgb(6,7,20) 55%, rgb(5,6,17) 100%)',
      }}
    >
      {/* Depth layers */}
      <GridOverlay />
      <Glows />
      <ParticleCanvas />
      <CursorBlob />
      <Scanlines />
      <CornerDeco />

      {/* Top edge accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.25, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(79,110,247,0.5) 30%, rgba(6,214,160,0.4) 70%, transparent 100%)',
          transformOrigin: 'left', zIndex: 4,
        }}
      />

      {/* ────────── CONTENT ────────── */}
      <div className="container" style={{
        position: 'relative', zIndex: 3,
        textAlign: 'center',
        paddingTop:    isMobile ? '100px' : '88px',
        paddingBottom: '72px',
      }}>

        {/* AVAILABLE BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px 6px 10px',
            border: '1px solid rgba(6,214,160,0.3)',
            borderRadius: '100px',
            background: 'rgba(6,214,160,0.05)',
            backdropFilter: 'blur(8px)',
            marginBottom: '40px',
            cursor: 'default',
          }}
        >
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#06d6a0', flexShrink: 0,
            boxShadow: '0 0 10px #06d6a0',
            animation: 'signalPulse 2s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#06d6a0', letterSpacing: '0.1em' }}>
            AVAILABLE FOR WORK
          </span>
        </motion.div>

        {/* NAME */}
        <RevealName />

        {/* TYPEWRITER ROLE */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', marginBottom: '22px' }}
        >
          <TypewriterRole />
        </motion.div>

        {/* TAGLINE */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.06rem)',
            color: 'rgba(175,185,230,0.68)',
            maxWidth: '500px', margin: '0 auto 44px',
            lineHeight: 1.82, fontWeight: 300,
          }}
        >
          Building{' '}
          <span style={{ color: 'rgba(232,234,246,0.95)', fontWeight: 500 }}>pixel-perfect</span>,{' '}
          <span style={{ color: 'rgba(232,234,246,0.95)', fontWeight: 500 }}>performant</span>{' '}
          web experiences at the intersection of{' '}
          <span style={{ color: '#7b9fff', borderBottom: '1px solid rgba(79,110,247,0.4)', paddingBottom: '1px' }}>engineering</span>
          {' '}and{' '}
          <span style={{ color: '#7eeece', borderBottom: '1px solid rgba(6,214,160,0.4)', paddingBottom: '1px' }}>design</span>.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}
        >
          {/* Primary */}
          <motion.a
            href="#projects"
            onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '9px',
              padding: '13px 28px',
              background: 'linear-gradient(135deg, #4f6ef7 0%, #7c3aed 100%)',
              color: '#fff', borderRadius: '10px',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.94rem',
              textDecoration: 'none',
              boxShadow: '0 0 28px rgba(79,110,247,0.28), 0 0 56px rgba(124,58,237,0.14)',
              letterSpacing: '0.01em', position: 'relative', overflow: 'hidden',
            }}
          >
            <motion.div initial={{ x: '-120%' }} whileHover={{ x: '220%' }} transition={{ duration: 0.5, ease: 'easeInOut' }}
              aria-hidden="true" style={{
                position: 'absolute', inset: 0, width: '45%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                transform: 'skewX(-15deg)', pointerEvents: 'none',
              }} />
            View My Work
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </motion.a>

          {/* GitHub */}
          <motion.a href="https://github.com/Gaurav-Codes-17/" target="_blank" rel="noopener noreferrer"
            whileHover={{ y: -3, borderColor: 'rgba(200,212,255,0.45)', color: '#e8eaf6' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '9px', padding: '13px 24px',
              background: 'rgba(255,255,255,0.04)', color: 'rgba(195,205,245,0.78)',
              borderRadius: '10px', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.94rem',
              textDecoration: 'none', border: '1px solid rgba(200,212,255,0.16)', transition: 'all 0.28s ease', backdropFilter: 'blur(6px)',
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </motion.a>

          {/* LinkedIn */}
          <motion.a href="https://www.linkedin.com/in/gaurav-sood-1a345a163/" target="_blank" rel="noopener noreferrer"
            whileHover={{ y: -3, borderColor: 'rgba(0,140,200,0.45)', color: '#7ab8d4' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '9px', padding: '13px 24px',
              background: 'rgba(255,255,255,0.04)', color: 'rgba(195,205,245,0.78)',
              borderRadius: '10px', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.94rem',
              textDecoration: 'none', border: '1px solid rgba(200,212,255,0.16)', transition: 'all 0.28s ease', backdropFilter: 'blur(6px)',
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </motion.a>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.92, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: isMobile ? '20px' : '0',
            padding: '22px clamp(22px, 5vw, 46px)',
            background: 'rgba(255,255,255,0.022)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            backdropFilter: 'blur(10px)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Top shimmer line */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(79,110,247,0.45), rgba(6,214,160,0.3), transparent)',
          }} />
          {[
            { value: '2+',  label: 'Yrs Exp'  },
            { value: '10+', label: 'Projects' },
            { value: '5+',  label: 'Stacks'   },
            { value: '∞',   label: 'Passion'  },
          ].map((s, i, arr) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '20px' : '0' }}>
              <div style={{ padding: isMobile ? '0' : '0 clamp(18px, 3vw, 38px)' }}>
                <Stat {...s} />
              </div>
              {i < arr.length - 1 && !isMobile && (
                <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.08)' }} />
              )}
            </div>
          ))}
        </motion.div>
      </div>
      <style jsx>{`
        @keyframes blink {
          0%,100% { opacity: 1 }
          50%      { opacity: 0 }
        }
        @keyframes signalPulse {
          0%,100% { box-shadow: 0 0 6px #06d6a0; opacity: 1   }
          50%      { box-shadow: 0 0 18px #06d6a0, 0 0 30px #06d6a088; opacity: 0.72 }
        }
      `}</style>
    </section>
  )
}