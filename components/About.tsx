'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

/* ─── Intersection Observer hook (no external dep) ── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect() // fire once, like the original
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, inView }
}

/* ─── Tilt Card ───────────────────────────────────── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect    = card.getBoundingClientRect()
    const rotateX = (((e.clientY - rect.top)  / rect.height) - 0.5) * -12
    const rotateY = (((e.clientX - rect.left) / rect.width)  - 0.5) *  12
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.15s ease', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

/* ─── Terminal data ───────────────────────────────── */
const terminalLines = [
  { prefix: '$ ', text: 'whoami',                                          color: 'var(--accent3)' },
  { prefix: '> ', text: 'gaurav-sood --role full-stack-dev',               color: 'var(--text)'     },
  { prefix: '$ ', text: 'cat skills.json',                                 color: 'var(--accent3)' },
  { prefix: '',   text: '{',                                                color: 'var(--text-muted)' },
  { prefix: '  ', text: '"frontend": ["React", "Next.js", "Three.js"],',   color: 'var(--accent)'  },
  { prefix: '  ', text: '"backend":  ["Node.js", "Express", "MongoDB"],',  color: 'var(--accent)'  },
  { prefix: '  ', text: '"creative": ["WebGL", "GSAP", "Framer"],',        color: 'var(--accent2)' },
  { prefix: '  ', text: '"passion":  "∞"',                                 color: 'var(--accent3)' },
  { prefix: '',   text: '}',                                                color: 'var(--text-muted)' },
  { prefix: '$ ', text: 'git log --oneline -3',                            color: 'var(--accent3)' },
  { prefix: '> ', text: 'a1b2c3 feat: shipped new feature',                color: 'var(--text-muted)' },
  { prefix: '> ', text: 'x9y8z7 fix: optimised performance',               color: 'var(--text-muted)' },
  { prefix: '> ', text: 'd4e5f6 chore: refactored architecture',           color: 'var(--text-muted)' },
]

/* ─── Terminal component ──────────────────────────── */
function Terminal({ inView }: { inView: boolean }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [started, setStarted]           = useState(false)
  // useRef flag avoids stale-closure / double-fire issues with useState
  const hasStarted = useRef(false)
  const bootRef    = useRef<ReturnType<typeof setTimeout>  | null>(null)
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Only fire once, and only when truly scrolled into view
    if (!inView || hasStarted.current) return
    hasStarted.current = true
    setStarted(true)

    bootRef.current = setTimeout(() => {
      let i = 0
      timerRef.current = setInterval(() => {
        i++
        setVisibleLines(i)
        if (i >= terminalLines.length) {
          clearInterval(timerRef.current!)
          timerRef.current = null
        }
      }, 110)
    }, 350)

    return () => {
      if (bootRef.current)  clearTimeout(bootRef.current)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [inView])  // ← only inView; ref guards against double-fire

  const isDone = visibleLines >= terminalLines.length

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
      // Subtle glow once typing starts
      transition: 'box-shadow 0.6s ease',
      ...(started ? { boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(79,110,247,0.07), 0 0 0 1px rgba(255,255,255,0.05)' } : {}),
    }}>

      {/* ── Title bar ── */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--surface2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        {/* Traffic lights — colour up once typing starts */}
        {(['#ff5f57', '#febc2e', '#28c840'] as const).map((c, i) => (
          <span key={c} style={{
            width: '12px', height: '12px', borderRadius: '50%', display: 'block',
            background: started ? c : 'rgba(255,255,255,0.12)',
            boxShadow: started ? `0 0 6px ${c}70` : 'none',
            transition: `background 0.4s ease ${i * 0.08}s, box-shadow 0.4s ease ${i * 0.08}s`,
          }} />
        ))}
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          color: 'var(--text-muted)', marginLeft: '8px', letterSpacing: '0.05em',
        }}>
          gaurav@dev ~ zsh
        </span>
        {/* Live indicator once done */}
        {isDone && (
          <span style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px',
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#28c840',
            animation: 'fadeIn 0.5s ease forwards',
          }}>
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%', background: '#28c840',
              boxShadow: '0 0 6px #28c840',
              animation: 'pulseDot 2s ease-in-out infinite',
            }} />
            ready
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{
        padding: '20px 24px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        lineHeight: 1.9,
        minHeight: '280px',
        position: 'relative',
      }}>
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              // Each line fades + slides up as it appears
              animation: 'lineAppear 0.2s ease forwards',
            }}
          >
            {line.prefix && (
              <span style={{
                color: 'var(--accent2)',
                userSelect: 'none',
                minWidth: line.prefix.length * 8,
                opacity: 0.8,
              }}>
                {line.prefix}
              </span>
            )}
            <span style={{ color: line.color }}>{line.text}</span>

            {/* Blinking cursor on the last visible line */}
            {i === visibleLines - 1 && !isDone && (
              <span style={{
                display: 'inline-block',
                width: '8px', height: '15px',
                background: 'var(--accent3)',
                marginLeft: '3px',
                animation: 'blink 0.9s step-end infinite',
                verticalAlign: 'text-bottom',
                borderRadius: '1px',
              }} />
            )}
          </div>
        ))}

        {/* Idle state before typing starts */}
        {!started && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: 'rgba(255,255,255,0.15)',
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
          }}>
            <span>$</span>
            <span style={{ animation: 'blink 0.9s step-end infinite' }}>▋</span>
          </div>
        )}

        {/* Scanline overlay for CRT feel */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          borderRadius: '0 0 14px 14px',
        }} />
      </div>
    </div>
  )
}

/* ─── Stat counter ────────────────────────────────── */
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref           = useRef<HTMLSpanElement>(null)
  const started       = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return
      started.current = true
      const duration = 1200
      const start    = performance.now()
      const tick     = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setVal(Math.round(eased * to))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to])

  return <span ref={ref}>{val}{suffix}</span>
}

/* ─── Main ────────────────────────────────────────── */
export default function About() {
  const { ref, inView } = useInView(0.15)

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      className="section"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px', height: '700px',
        background: 'radial-gradient(circle, rgba(79,110,247,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        opacity: inView ? 1 : 0,
        transition: 'opacity 1.2s ease',
      }} />

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
        }}>

          {/* ── Left: text ── */}
          <div style={{
            opacity:    inView ? 1 : 0,
            transform:  inView ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div className="section-label">About Me</div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 800, lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '28px',
            }}>
              I don't just build
              <br />
              <span style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>websites.</span>
              <br />
              I craft{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--accent3), var(--accent))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>experiences.</span>
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '20px', fontWeight: 300 }}>
              I'm a <span style={{ color: 'var(--text)' }}>Full Stack Developer</span> from India with a passion for
              turning complex ideas into beautifully simple, highly performant web applications.
              My craft lives where <span style={{ color: 'var(--accent)' }}>engineering precision</span> meets{' '}
              <span style={{ color: 'var(--accent2)' }}>creative vision</span>.
            </p>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '36px', fontWeight: 300 }}>
              From building <span style={{ color: 'var(--text)' }}>3D interactive portfolios</span> in Three.js
              to architecting <span style={{ color: 'var(--text)' }}>scalable REST APIs</span> with Node.js —
              I thrive on challenges that push the boundary of what's possible on the web.
            </p>

            {/* Animated stats row */}
            <div style={{
              display: 'flex', gap: '28px', marginBottom: '32px',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
            }}>
              {[
                { value: 2,  suffix: '+', label: 'Years exp.' },
                { value: 10, suffix: '+', label: 'Projects shipped' },
                { value: 99, suffix: '%', label: 'Coffee-powered' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.9rem',
                    fontWeight: 800, color: 'var(--accent)',
                    lineHeight: 1,
                  }}>
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    color: 'var(--text-dim)', letterSpacing: '0.1em',
                    textTransform: 'uppercase', marginTop: '4px',
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick facts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Based In', value: 'India 🇮🇳' },
                { label: 'Focus',    value: 'Full Stack' },
                { label: 'Education', value: 'B.C.A - Panjab University' },
                { label: 'Status',   value: '🟢 Open to Work' },
              ].map((fact, i) => (
                <div
                  key={fact.label}
                  style={{
                    padding: '14px 16px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
                    cursor: 'default',
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(12px)',
                    // stagger each fact card
                    transitionDelay: inView ? `${0.5 + i * 0.07}s` : '0s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--border-bright)'
                    e.currentTarget.style.transform   = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow   = '0 8px 24px rgba(0,0,0,0.25)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform   = 'translateY(0)'
                    e.currentTarget.style.boxShadow   = 'none'
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    {fact.label.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: terminal ── */}
          <div style={{
            opacity:    inView ? 1 : 0,
            transform:  inView ? 'translateX(0)' : 'translateX(40px)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}>
            <TiltCard>
              {/* ── Terminal only animates when inView ── */}
              <Terminal inView={inView} />
            </TiltCard>

            {/* Floating badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px',
              background: 'var(--surface)',
              border: '1px solid var(--border-bright)',
              borderRadius: '100px',
              marginTop: '20px', float: 'right',
              opacity: inView ? 1 : 0,
              transition: 'opacity 0.6s ease 0.8s',
              animation: inView ? 'floatBadge 3s ease-in-out infinite' : 'none',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent3)' }}>✦</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                ~2 yrs building cool stuff
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes lineAppear {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 4px #28c840; }
          50%       { box-shadow: 0 0 10px #28c840; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (max-width: 900px) {
          #about .container > div {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  )
}