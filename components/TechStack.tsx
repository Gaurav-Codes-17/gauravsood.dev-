'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useIsMobile } from '@/lib/usePerformance'

type Tech = {
  name: string
  icon: string
  color: string
  category: string
  years: number
  tag: string
  description: string
}

const TECH_STACK: Tech[] = [
  { name: 'React', icon: '⚛️', color: '#61dafb', category: 'Frontend', years: 2, tag: 'Daily Driver', description: 'SPAs, SSR, complex state management' },
  { name: 'Next.js', icon: '▲', color: '#a8b4ff', category: 'Frontend', years: 2, tag: 'Daily Driver', description: 'App router, RSC, API routes, ISR' },
  { name: 'TypeScript', icon: 'TS', color: '#3178c6', category: 'Frontend', years: 2, tag: 'Expert', description: 'Generics, utility types, strict mode' },
  { name: 'Javascript', icon: 'JS', color: '#F0DB4F', category: 'Frontend', years: 2, tag: 'Daily Driver', description: 'ES6, async/await, generators' },
  { name: 'Tailwind', icon: '🌊', color: '#38bdf8', category: 'Frontend', years: 2, tag: 'Expert', description: 'Custom design systems & plugins' },
  { name: 'Framer Motion', icon: '✦', color: '#bb4fe8', category: 'Frontend', years: 1, tag: 'Proficient', description: 'Spring physics, layout animations' },
  { name: 'Three.js', icon: '△', color: '#88ccff', category: '3D / Creative', years: 1, tag: 'Proficient', description: 'Custom shaders, scene composition' },
  { name: 'WebGL', icon: '◼', color: '#ff6b6b', category: '3D / Creative', years: 1, tag: 'Exploring', description: 'GLSL, buffers, raw GPU pipelines' },
  { name: 'GSAP', icon: '◎', color: '#88ce02', category: '3D / Creative', years: 1, tag: 'Proficient', description: 'ScrollTrigger, timeline animations' },
  { name: 'Node.js', icon: '⬡', color: '#68a063', category: 'Backend', years: 2, tag: 'Expert', description: 'REST APIs, microservices, streams' },
  { name: 'GraphQL', icon: '◈', color: '#e535ab', category: 'Backend', years: 1, tag: 'Proficient', description: 'Schema design, resolvers, Apollo' },
  { name: 'PostgreSQL', icon: '🐘', color: '#336791', category: 'Database', years: 1, tag: 'Proficient', description: 'Query optimization, Prisma ORM' },
  { name: 'MongoDB', icon: '🍃', color: '#00ed64', category: 'Database', years: 2, tag: 'Daily Driver', description: 'Pagination and optimized queries' },
  { name: 'Redis', icon: '⚡', color: '#D82C20', category: 'Backend', years: 1, tag: 'Proficient', description: 'Caching, pub/sub, rate limiting' },
  { name: 'Docker', icon: '🐳', color: '#2496ed', category: 'DevOps', years: 0.2, tag: 'Exploring', description: 'Multi-stage builds, compose stacks' },
  { name: 'AWS', icon: '☁️', color: '#ff9900', category: 'DevOps', years: 0.3, tag: 'Exploring', description: 'EC2, S3, Lambda, RDS deployments' },
  { name: 'Git', icon: '🌿', color: '#F1502F', category: 'DevOps', years: 2, tag: 'Expert', description: 'Branching strategies, CI/CD flows' },
]

const CATEGORIES = ['All', 'Frontend', '3D / Creative', 'Backend', 'DevOps', 'Database']

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Daily Driver': { bg: 'rgba(6,214,160,0.15)',   text: '#06d6a0', border: 'rgba(6,214,160,0.4)' },
  'Expert':       { bg: 'rgba(79,110,247,0.15)',  text: '#7b9fff', border: 'rgba(79,110,247,0.4)' },
  'Proficient':   { bg: 'rgba(247,160,37,0.15)',  text: '#f7a025', border: 'rgba(247,160,37,0.4)' },
  'Exploring':    { bg: 'rgba(247,37,133,0.15)',  text: '#f72585', border: 'rgba(247,37,133,0.4)' },
}





/* ─── Tech Card ──────────────────────────────────── */
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

  const experienceLabel =
  tech.years >= 1
    ? `${tech.years}yr${tech.years !== 1 ? 's' : ''}`
    : `${Math.max(1, Math.round(tech.years * 12))}mo`;


  // Parse color to rgb for dynamic use
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r},${g},${b}`
  }
  const rgb = tech.color.startsWith('#') ? hexToRgb(tech.color) : '100,120,255'

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
        /* Solid background — never disappears */
        background: hovered
          ? `linear-gradient(135deg, rgba(${rgb},0.14) 0%, rgb(20,22,38) 60%)`
          : 'rgb(20,22,38)',
        /* Always-visible colored border */
        border: hovered
          ? `1.5px solid rgba(${rgb},0.65)`
          : `1.5px solid rgba(${rgb},0.28)`,
        borderRadius: '20px',
        padding: '22px',
        cursor: 'default',
        overflow: 'hidden',
        boxShadow: hovered
          ? `0 20px 60px rgba(${rgb},0.2), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(${rgb},0.15)`
          : `0 4px 28px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
        transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {/* Top accent strip — always visible, expands on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: hovered ? '100px' : '48px', height: '2.5px',
        background: `linear-gradient(90deg, ${tech.color}, transparent)`,
        borderRadius: '20px 0 0 0',
        transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      }} />

      {/* Ambient glow top-right */}
      <div style={{
        position: 'absolute', top: '-50px', right: '-50px',
        width: '180px', height: '180px', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${rgb},${hovered ? '0.18' : '0.06'}) 0%, transparent 70%)`,
        pointerEvents: 'none',
        transition: 'all 0.5s ease',
      }} />

      {/* Corner grid (decorative) */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, right: 0,
        width: '80px', height: '80px',
        backgroundImage: `linear-gradient(rgba(${rgb},0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(${rgb},0.12) 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
        maskImage: 'radial-gradient(circle at top right, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(circle at top right, black 0%, transparent 70%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
        borderRadius: '0 20px 0 0',
      }} />

      {/* Glare */}
      {!isMobile && (
        <motion.div
          style={{
            position: 'absolute', inset: 0, borderRadius: '20px',
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.06) 0%, transparent 55%)`,
            pointerEvents: 'none', zIndex: 0,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Top row: icon + name + tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* Icon with orbit dots */}
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
                    opacity: hovered ? 0.4 + (i / arr.length) * 0.6 : 0,
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
              background: `radial-gradient(circle, rgba(${rgb},0.2) 0%, rgba(${rgb},0.08) 100%)`,
              border: `1.5px solid rgba(${rgb},${hovered ? '0.6' : '0.35'})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: tech.icon.length > 2 ? '0.6rem' : '0.9rem',
              fontWeight: 700, color: tech.color,
              fontFamily: 'var(--font-mono)',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              boxShadow: hovered
                ? `0 0 16px rgba(${rgb},0.4), inset 0 0 8px rgba(${rgb},0.1)`
                : `0 0 8px rgba(${rgb},0.15)`,
            }}>
              <span aria-hidden="true">{tech.icon}</span>
            </div>
          </div>

          <div>
            {/* Name — always full white */}
            <p style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '0.97rem', color: '#ffffff', lineHeight: 1.2,
            }}>
              {tech.name}
            </p>
            {/* Years — visible always */}
            <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              color: hovered ? tech.color : 'rgba(190,195,230,0.6)',
              letterSpacing: '0.08em',
              marginTop: '2px',
              transition: 'color 0.35s ease',
            }}
          >
            {experienceLabel} experience
          </p>
          </div>
        </div>

        {/* Tag badge — always visible */}
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: tagStyle.text,
          background: tagStyle.bg,
          border: `1px solid ${tagStyle.border}`,
          padding: '3px 9px', borderRadius: '6px',
          flexShrink: 0,
          boxShadow: hovered ? `0 0 14px ${tagStyle.text}30` : 'none',
          transition: 'box-shadow 0.3s ease',
        }}>
          {tech.tag}
        </span>
      </div>

      {/* Description — always readable */}
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '0.79rem',
        /* Strong resting color */
        color: hovered ? 'rgba(235,238,255,0.95)' : 'rgba(210,215,240,0.78)',
        lineHeight: 1.55,
        position: 'relative', zIndex: 1,
        marginBottom: '16px',
        transition: 'color 0.35s ease',
      }}>
        {tech.description}
      </p>

      {/* Activity bar */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            /* Always readable label */
            color: 'rgba(190,195,230,0.6)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            Activity
          </span>
        </div>
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
                  /* Filled segments always visible, brighter on hover */
                  background: filled
                    ? hovered ? tech.color : `rgba(${rgb},0.55)`
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: filled && hovered ? `0 0 8px rgba(${rgb},0.6)` : 'none',
                  transition: 'background 0.35s ease, box-shadow 0.35s ease',
                }}
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Category Filter Button ─────────────────────── */
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
        border: `1.5px solid ${active ? 'rgba(79,110,247,0.7)' : 'rgba(200,210,255,0.18)'}`,
        background: active ? 'rgba(79,110,247,0.18)' : 'rgba(20,22,38,0.9)',
        /* Always legible text */
        color: active ? '#7b9fff' : 'rgba(200,210,240,0.75)',
        transition: 'all 0.25s ease',
        boxShadow: active ? '0 0 22px rgba(79,110,247,0.25)' : '0 2px 12px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {active && (
        <motion.div
          layoutId="cat-pill"
          style={{
            position: 'absolute', inset: 0, borderRadius: '100px',
            background: 'rgba(79,110,247,0.12)',
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

      {/* Ambient bg glows */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '20%', left: '-5%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-5%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(247,37,133,0.06) 0%, transparent 70%)',
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
            fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginBottom: '12px',
          }}>
            My Tech{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent2), var(--accent4))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Arsenal
            </span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', color: 'rgba(210,215,240,0.75)',
            fontSize: '0.9rem', lineHeight: 1.6,
          }}>
            Hover any card to see the tech come alive.
          </p>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginTop: '20px' }}>
            {Object.entries(TAG_COLORS).map(([tag, style]) => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: style.text, boxShadow: `0 0 8px ${style.text}`,
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                  /* Legend text always legible */
                  color: 'rgba(200,210,240,0.75)',
                  letterSpacing: '0.08em',
                }}>
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