'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useIsMobile } from '@/lib/usePerformance'

type Tech = {
  name: string
  icon: string
  color: string
  category: string
  years: number       // years of experience
  tag: string         // e.g. "Daily Driver", "Expert", "Proficient"
  description: string // one-liner about your use of this tech
}

const TECH_STACK: Tech[] = [
  // Frontend
  { name: 'React', icon: '⚛️', color: '#61dafb', category: 'Frontend', years: 2, tag: 'Daily Driver', description: 'SPAs, SSR, complex state management' },
  { name: 'Next.js', icon: '▲', color: '#a8b4ff', category: 'Frontend', years: 2, tag: 'Daily Driver', description: 'App router, RSC, API routes, ISR' },
  { name: 'TypeScript', icon: 'TS', color: '#3178c6', category: 'Frontend', years: 2, tag: 'Expert', description: 'Generics, utility types, strict mode' },
  { name: 'Tailwind', icon: '🌊', color: '#38bdf8', category: 'Frontend', years: 2, tag: 'Expert', description: 'Custom design systems & plugins' },
  { name: 'Framer Motion', icon: '✦', color: '#bb4fe8', category: 'Frontend', years: 1, tag: 'Proficient', description: 'Spring physics, layout animations' },
  // 3D / Creative
  { name: 'Three.js', icon: '△', color: '#88ccff', category: '3D / Creative', years: 1, tag: 'Proficient', description: 'Custom shaders, scene composition' },
  { name: 'WebGL', icon: '◼', color: '#ff6b6b', category: '3D / Creative', years: 1, tag: 'Exploring', description: 'GLSL, buffers, raw GPU pipelines' },
  { name: 'GSAP', icon: '◎', color: '#88ce02', category: '3D / Creative', years: 1, tag: 'Proficient', description: 'ScrollTrigger, timeline animations' },
  // Backend
  { name: 'Node.js', icon: '⬡', color: '#68a063', category: 'Backend', years: 2, tag: 'Expert', description: 'REST APIs, microservices, streams' },
  { name: 'GraphQL', icon: '◈', color: '#e535ab', category: 'Backend', years: 1, tag: 'Proficient', description: 'Schema design, resolvers, Apollo' },
  { name: 'PostgreSQL', icon: '🐘', color: '#336791', category: 'Backend', years: 2, tag: 'Proficient', description: 'Query optimization, Prisma ORM' },
  { name: 'Redis', icon: '⚡', color: '#dc382d', category: 'Backend', years: 1, tag: 'Proficient', description: 'Caching, pub/sub, rate limiting' },
  // DevOps
  { name: 'Docker', icon: '🐳', color: '#2496ed', category: 'DevOps', years: 1, tag: 'Proficient', description: 'Multi-stage builds, compose stacks' },
  { name: 'AWS', icon: '☁️', color: '#ff9900', category: 'DevOps', years: 1, tag: 'Exploring', description: 'EC2, S3, Lambda, RDS deployments' },
  { name: 'Git', icon: '🌿', color: '#f05032', category: 'DevOps', years: 2, tag: 'Expert', description: 'Branching strategies, CI/CD flows' },
]

const CATEGORIES = ['All', 'Frontend', '3D / Creative', 'Backend', 'DevOps']

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Daily Driver': { bg: 'rgba(6,214,160,0.12)', text: '#06d6a0', border: 'rgba(6,214,160,0.3)' },
  'Expert':       { bg: 'rgba(79,110,247,0.12)', text: '#4f6ef7', border: 'rgba(79,110,247,0.3)' },
  'Proficient':   { bg: 'rgba(247,160,37,0.12)', text: '#f7a025', border: 'rgba(247,160,37,0.3)' },
  'Exploring':    { bg: 'rgba(247,37,133,0.12)', text: '#f72585', border: 'rgba(247,37,133,0.3)' },
}

/* ─── Orbiting dot ring (decorative) ─────────────── */
function OrbitRing({ color, size, years }: { color: string; size: number; years: number }) {
  const dots = Math.min(years * 3, 8)
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        {Array.from({ length: dots }).map((_, i) => {
          const angle = (i / dots) * 360
          const rad = (angle * Math.PI) / 180
          const r = size / 2 - 4
          return (
            <div key={i} style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: '4px', height: '4px',
              borderRadius: '50%',
              background: color,
              opacity: 0.4 + (i / dots) * 0.6,
              transform: `translate(calc(-50% + ${Math.cos(rad) * r}px), calc(-50% + ${Math.sin(rad) * r}px))`,
              boxShadow: `0 0 6px ${color}`,
            }} />
          )
        })}
      </motion.div>
      {/* Inner glow circle */}
      <div style={{
        position: 'absolute', inset: '8px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        border: `1px solid ${color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem',
      }} />
    </div>
  )
}

/* ─── Hexagonal Tech Card ─────────────────────────── */
function TechCard({ tech, index }: { tech: Tech; index: number }) {
  const isMobile = useIsMobile()
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 })
  const rotY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 })
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['10%', '90%'])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['10%', '90%'])
  const tagStyle = TAG_COLORS[tech.tag] || TAG_COLORS['Proficient']

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const resetMouse = () => { mouseX.set(0); mouseY.set(0) }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { resetMouse(); setHovered(false) }}
      onMouseEnter={() => setHovered(true)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: isMobile ? 0 : rotX,
        rotateY: isMobile ? 0 : rotY,
        transformStyle: 'preserve-3d',
        position: 'relative',
        background: hovered
          ? `linear-gradient(135deg, ${tech.color}12 0%, rgba(11,13,26,0.95) 60%)`
          : 'rgba(11,13,26,0.85)',
        border: `1px solid ${hovered ? tech.color + '45' : 'rgba(100,120,255,0.1)'}`,
        borderRadius: '20px',
        padding: '22px',
        cursor: 'default',
        overflow: 'hidden',
        transition: 'background 0.4s ease, border-color 0.4s ease',
        boxShadow: hovered
          ? `0 0 40px ${tech.color}12, 0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 ${tech.color}15`
          : '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Glare */}
      {!isMobile && (
        <motion.div
          style={{
            position: 'absolute', inset: 0, borderRadius: '20px',
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.055) 0%, transparent 55%)`,
            pointerEvents: 'none', zIndex: 0, opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Corner grid lines (decorative) */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, right: 0,
        width: '80px', height: '80px',
        backgroundImage: `linear-gradient(${tech.color}15 1px, transparent 1px), linear-gradient(90deg, ${tech.color}15 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
        maskImage: 'radial-gradient(circle at top right, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(circle at top right, black 0%, transparent 70%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
        borderRadius: '0 20px 0 0',
      }} />

      {/* Top row: orbit icon + tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Orbit ring with icon inside */}
          <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
            <motion.div
              animate={hovered ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 6, repeat: hovered ? Infinity : 0, ease: 'linear' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              {Array.from({ length: Math.min(tech.years * 3, 8) }).map((_, i, arr) => {
                const angle = (i / arr.length) * 360
                const rad = (angle * Math.PI) / 180
                const r = 20
                return (
                  <div key={i} style={{
                    position: 'absolute', left: '50%', top: '50%',
                    width: '3px', height: '3px', borderRadius: '50%',
                    background: tech.color,
                    opacity: hovered ? 0.3 + (i / arr.length) * 0.7 : 0,
                    transition: 'opacity 0.4s ease',
                    transform: `translate(calc(-50% + ${Math.cos(rad) * r}px), calc(-50% + ${Math.sin(rad) * r}px))`,
                    boxShadow: `0 0 5px ${tech.color}`,
                  }} />
                )
              })}
            </motion.div>
            {/* Icon circle */}
            <div style={{
              position: 'absolute', inset: '6px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${tech.color}20 0%, ${tech.color}08 100%)`,
              border: `1px solid ${tech.color}${hovered ? '50' : '20'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: tech.icon.length > 2 ? '0.6rem' : '0.9rem',
              fontWeight: 700, color: tech.color,
              fontFamily: 'var(--font-mono)',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              boxShadow: hovered ? `0 0 14px ${tech.color}35, inset 0 0 8px ${tech.color}10` : 'none',
            }}>
              <span aria-hidden="true">{tech.icon}</span>
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.2 }}>
              {tech.name}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-dim)', letterSpacing: '0.08em', marginTop: '2px' }}>
              {tech.years}yr{tech.years !== 1 ? 's' : ''} experience
            </p>
          </div>
        </div>

        {/* Tag badge */}
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: tagStyle.text, background: tagStyle.bg,
          border: `1px solid ${tagStyle.border}`,
          padding: '3px 8px', borderRadius: '6px',
          flexShrink: 0,
          transition: 'all 0.3s ease',
          boxShadow: hovered ? `0 0 12px ${tagStyle.text}20` : 'none',
        }}>
          {tech.tag}
        </span>
      </div>

      {/* Description */}
      <motion.p
        animate={{ opacity: hovered ? 1 : 0.55, y: hovered ? 0 : 3 }}
        transition={{ duration: 0.25 }}
        style={{
          fontFamily: 'var(--font-body)', fontSize: '0.78rem',
          color: 'var(--text-muted)', lineHeight: 1.5,
          position: 'relative', zIndex: 1,
          marginBottom: '14px',
        }}
      >
        {tech.description}
      </motion.p>

      {/* Bottom: animated color pulse bar */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Activity
          </span>
        </div>

        {/* Segmented dot track */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const filled = i < Math.round((tech.years / 2) * 12)
            return (
              <motion.div
                key={i}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  flex: 1, height: '3px', borderRadius: '2px',
                  background: filled
                    ? hovered ? tech.color : `${tech.color}70`
                    : 'rgba(255,255,255,0.07)',
                  boxShadow: filled && hovered ? `0 0 6px ${tech.color}50` : 'none',
                  transition: 'background 0.3s ease, box-shadow 0.3s ease',
                }}
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Floating category pill ─────────────────────── */
function CategoryBtn({ cat, active, onClick }: { cat: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'relative',
        fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em',
        padding: '8px 18px', borderRadius: '100px', cursor: 'pointer',
        border: `1px solid ${active ? 'var(--accent)' : 'rgba(100,120,255,0.15)'}`,
        background: active ? 'rgba(79,110,247,0.14)' : 'rgba(11,13,26,0.7)',
        color: active ? 'var(--accent)' : 'var(--text-dim)',
        transition: 'all 0.25s ease',
        boxShadow: active ? '0 0 20px rgba(79,110,247,0.2)' : 'none',
        backdropFilter: 'blur(8px)',
      }}
    >
      {active && (
        <motion.div
          layoutId="cat-pill"
          style={{
            position: 'absolute', inset: 0, borderRadius: '100px',
            background: 'rgba(79,110,247,0.1)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
    </motion.button>
  )
}

/* ─── Main Section ───────────────────────────────── */
export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? TECH_STACK
    : TECH_STACK.filter(t => t.category === activeCategory)

  return (
    <section id="tech" className="section" style={{ position: 'relative', overflow: 'hidden' }} aria-labelledby="tech-heading">

      {/* Ambient background glow */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '20%', left: '-5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(247,37,133,0.05) 0%, transparent 70%)',
        }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '48px' }}
        >
          <p className="section-label">Skills & Tools</p>
          <h2 id="tech-heading" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800, color: 'var(--text)', lineHeight: 1.1, marginBottom: '12px',
          }}>
            My Tech{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent2), var(--accent4))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Arsenal
            </span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Hover any card to see the tech come alive.
          </p>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px' }}>
            {Object.entries(TAG_COLORS).map(([tag, style]) => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.text, boxShadow: `0 0 8px ${style.text}` }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {CATEGORIES.map(cat => (
            <CategoryBtn key={cat} cat={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '16px',
              perspective: '1000px',
            }}
          >
            {filtered.map((tech, i) => (
              <TechCard key={tech.name} tech={tech} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}