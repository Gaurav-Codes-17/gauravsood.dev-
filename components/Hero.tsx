'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useReducedMotion, useIsMobile, useIsLowEnd } from '@/lib/usePerformance'

const ROLES = [
  'Full Stack Developer',
  'React & Next.js Engineer',
  'Three.js / WebGL Builder',
  'UI/UX Craftsman',
  'Node.js Architect',
]

/* ─── Particle Canvas (mobile-aware) ─────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isLowEnd = useIsLowEnd()
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (isLowEnd || prefersReduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = window.innerWidth, H = window.innerHeight
    canvas.width = W; canvas.height = H

    const COUNT = W < 768 ? 30 : 70
    type P = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }
    const colors = ['#4f6ef7', '#7c3aed', '#06d6a0']
    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.45 + 0.08,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    let mouse = { x: W / 2, y: H / 2 }
    const onMouseMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const LINK_DIST = W < 768 ? 80 : 120

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x, dy = p.y - q.y
          const dist = Math.hypot(dx, dy)
          if (dist < LINK_DIST) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(79,110,247,${0.07 * (1 - dist / LINK_DIST)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
        const mdx = mouse.x - p.x, mdy = mouse.y - p.y
        const md = Math.hypot(mdx, mdy)
        if (md < 180) { p.vx += mdx / md * 0.018; p.vy += mdy / md * 0.018 }
        p.vx *= 0.99; p.vy *= 0.99
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H }
    window.addEventListener('resize', onResize, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMouseMove); window.removeEventListener('resize', onResize) }
  }, [isLowEnd, prefersReduced])

  if (isLowEnd || prefersReduced) return null

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
      aria-hidden="true"
    />
  )
}

/* ─── Typewriter ─────────────────────────────────── */
function TypewriterRole() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    const target = ROLES[index]
    const speed = deleting ? 32 : 72
    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < target.length) { setDisplayed(target.slice(0, charIdx + 1)); setCharIdx(c => c + 1) }
        else setTimeout(() => setDeleting(true), 1800)
      } else {
        if (charIdx > 0) { setDisplayed(target.slice(0, charIdx - 1)); setCharIdx(c => c - 1) }
        else { setDeleting(false); setIndex(i => (i + 1) % ROLES.length) }
      }
    }, speed)
    return () => clearTimeout(timer)
  }, [charIdx, deleting, index])

  return (
    <span style={{ color: 'var(--accent3)', fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.9rem, 2vw, 1.15rem)', fontWeight: 400 }}>
      {displayed}
      <span style={{
        display: 'inline-block', width: '2px', height: '1.1em',
        background: 'var(--accent3)', marginLeft: '3px', verticalAlign: 'middle',
        animation: 'blink 1s step-end infinite',
      }} />
    </span>
  )
}

/* ─── 3D Tilt Name Card ──────────────────────────── */
function TiltName() {
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const prefersReduced = useReducedMotion()
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const springX = useSpring(rotX, { stiffness: 150, damping: 20 })
  const springY = useSpring(rotY, { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || prefersReduced) return
    const rect = ref.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotX.set(((e.clientY - cy) / rect.height) * -10)
    rotY.set(((e.clientX - cx) / rect.width) * 10)
  }
  const reset = () => { rotX.set(0); rotY.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ transformStyle: 'preserve-3d', rotateX: isMobile ? 0 : springX, rotateY: isMobile ? 0 : springY, perspective: 1200 }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.2rem, 10vw, 8.5rem)',
          fontWeight: 800,
          lineHeight: 0.93,
          letterSpacing: '-0.03em',
          marginBottom: '14px',
        }}
        aria-label="Gaurav Sood"
      >
        <motion.span
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'linear-gradient(135deg, #e8eaf6 30%, var(--accent) 60%, var(--accent2) 90%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            display: 'inline-block',
          }}
        >
          Gaurav
        </motion.span>
        <br />
        <motion.span
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'linear-gradient(135deg, var(--accent3) 0%, var(--accent) 60%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            display: 'inline-block',
          }}
        >
          Sood
        </motion.span>
      </h1>
    </motion.div>
  )
}

/* ─── Floating Orbs ──────────────────────────────── */
function FloatingOrbs() {
  const isMobile = useIsMobile()
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }} aria-hidden="true">
      <motion.div
        animate={isMobile ? {} : { x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: isMobile ? '400px' : '700px', height: isMobile ? '400px' : '700px',
          background: 'radial-gradient(circle, rgba(79,110,247,0.12) 0%, transparent 70%)',
        }}
      />
      <motion.div
        animate={isMobile ? {} : { x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: isMobile ? '300px' : '600px', height: isMobile ? '300px' : '600px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        }}
      />
      {!isMobile && (
        <motion.div
          animate={{ x: [0, 10, 0], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '30%', right: '20%',
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(6,214,160,0.06) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  )
}

/* ─── Stat Counter ───────────────────────────────── */
function AnimatedStat({ number, label }: { number: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, var(--accent), var(--accent3))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}
      >
        {number}
      </motion.div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
        color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '4px',
      }}>
        {label}
      </div>
    </div>
  )
}

/* ─── Main Hero ──────────────────────────────────── */
export default function Hero() {
  const handleScroll = () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="home"
      style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}
      className="grid-bg"
      aria-label="Hero section"
    >
      <ParticleCanvas />
      <FloatingOrbs />

      <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingTop: '80px' }}>

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px 6px 8px', borderRadius: '100px',
            border: '1px solid rgba(6,214,160,0.25)', background: 'rgba(6,214,160,0.05)',
            marginBottom: '32px',
          }}
        >
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: 'var(--accent3)', boxShadow: '0 0 8px var(--accent3)',
            animation: 'pulse-glow 2s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent3)', letterSpacing: '0.08em' }}>
            AVAILABLE FOR WORK
          </span>
        </motion.div>

        {/* 3D Tilt Name */}
        <TiltName />

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '24px', minHeight: '2rem' }}
        >
          <TypewriterRole />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 48px',
            lineHeight: 1.75, fontWeight: 300,
          }}
        >
          Building{' '}
          <span style={{ color: 'var(--text)' }}>pixel-perfect</span>,{' '}
          <span style={{ color: 'var(--text)' }}>performant</span> web experiences
          at the intersection of{' '}
          <span style={{ color: 'var(--accent)' }}>engineering</span> and{' '}
          <span style={{ color: 'var(--accent2)' }}>design</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.74, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}
        >
          <motion.a
            href="#projects"
            onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 28px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              color: '#fff', borderRadius: '10px', fontFamily: 'var(--font-body)',
              fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
              boxShadow: '0 0 30px var(--glow), 0 0 60px var(--glow2)',
              transition: 'box-shadow 0.3s ease',
              letterSpacing: '0.01em',
            }}
          >
            View My Work
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>

          <motion.a
            href="https://github.com/Gaurav-Codes-17/"
            target="_blank" rel="noopener noreferrer"
            whileHover={{ y: -3, borderColor: 'var(--accent3)', color: 'var(--accent3)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 28px', background: 'transparent', color: 'var(--text)',
              borderRadius: '10px', fontFamily: 'var(--font-body)', fontWeight: 500,
              fontSize: '0.95rem', textDecoration: 'none',
              border: '1px solid var(--border-bright)', transition: 'all 0.3s ease', letterSpacing: '0.01em',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </motion.a>

          <motion.a
            href="https://www.linkedin.com/in/gaurav-sood-1a345a163/"
            target="_blank" rel="noopener noreferrer"
            whileHover={{ y: -3, borderColor: '#0077b5', color: '#0077b5' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 28px', background: 'transparent', color: 'var(--text)',
              borderRadius: '10px', fontFamily: 'var(--font-body)', fontWeight: 500,
              fontSize: '0.95rem', textDecoration: 'none',
              border: '1px solid var(--border)', transition: 'all 0.3s ease', letterSpacing: '0.01em',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}
        >
          {[
            { number: '2+', label: 'Years Experience' },
            { number: '10+', label: 'Projects Built' },
            { number: '5+', label: 'Tech Stacks' },
            { number: '100%', label: 'Passion' },
          ].map(stat => <AnimatedStat key={stat.label} {...stat} />)}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={handleScroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5 }}
        whileHover={{ opacity: 1 }}
        aria-label="Scroll to about section"
        style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>SCROLL</span>
          <div style={{
            width: '24px', height: '40px',
            border: '1.5px solid var(--border-bright)',
            borderRadius: '12px', display: 'flex', justifyContent: 'center', paddingTop: '6px',
          }}>
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '4px', height: '8px', background: 'var(--accent)', borderRadius: '2px' }}
            />
          </div>
        </motion.div>
      </motion.button>

      <style jsx>{`
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
        @keyframes pulse-glow {
          0%,100%{box-shadow:0 0 8px var(--accent3)}
          50%{box-shadow:0 0 20px var(--accent3),0 0 35px var(--accent3)}
        }
      `}</style>
    </section>
  )
}