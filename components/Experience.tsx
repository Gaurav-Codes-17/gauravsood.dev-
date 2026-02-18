'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type Experience = {
  role: string; company: string; period: string; description: string; tech: string[]; current?: boolean
}

const EXPERIENCES: Experience[] = [
  {
    role: 'Full Stack Developer',
    company: 'Your Company',
    period: '2023 – Present',
    current: true,
    description: 'Building scalable web applications with Next.js and Node.js. Led frontend architecture decisions, implemented real-time features with WebSockets, and reduced load times by 60% through code splitting and caching strategies.',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis'],
  },
  {
    role: 'Frontend Developer',
    company: 'Previous Company',
    period: '2022 – 2023',
    description: 'Developed component libraries and design systems used by 5+ product teams. Integrated Three.js visualizations and improved accessibility scores from 62 to 98 across core products.',
    tech: ['React', 'Three.js', 'Tailwind CSS', 'Storybook'],
  },
  {
    role: 'React Developer Intern',
    company: 'Startup Name',
    period: '2022',
    description: 'Built customer-facing features, collaborated directly with designers to implement pixel-perfect UIs, and shipped a reusable drag-and-drop interface using React DnD.',
    tech: ['React', 'JavaScript', 'SCSS', 'REST API'],
  },
]

function TimelineItem({ exp, index }: { exp: Experience; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1])
  const x = useTransform(scrollYProgress, [0, 0.5], [index % 2 === 0 ? -30 : 30, 0])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x, display: 'flex', gap: '32px', position: 'relative' }}
    >
      {/* Timeline line + dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 400, delay: index * 0.1 }}
          style={{
            width: '14px', height: '14px', borderRadius: '50%',
            background: exp.current ? 'var(--accent3)' : 'var(--accent)',
            border: `2px solid ${exp.current ? 'var(--accent3)' : 'var(--accent)'}`,
            boxShadow: exp.current ? '0 0 16px var(--accent3)' : '0 0 12px var(--glow)',
            flexShrink: 0, marginTop: '4px',
          }}
        />
        {index < EXPERIENCES.length - 1 && (
          <div style={{ width: '1px', flex: 1, background: 'var(--border)', marginTop: '8px' }} />
        )}
      </div>

      {/* Content */}
      <motion.div
        whileHover={{ x: 4 }}
        style={{
          background: 'rgba(11,13,26,0.6)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '24px 28px',
          marginBottom: index < EXPERIENCES.length - 1 ? '32px' : '0',
          flex: 1, transition: 'border-color 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)' }}>
              {exp.role}
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--accent)', marginTop: '2px' }}>
              {exp.company}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {exp.current && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent3)',
                background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.25)',
                padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.1em',
              }}>
                CURRENT
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
              {exp.period}
            </span>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '16px' }}>
          {exp.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {exp.tech.map(t => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '60px' }}
        >
          <p className="section-label">Career</p>
          <h2 id="experience-heading" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800, color: 'var(--text)', lineHeight: 1.1,
          }}>
            Work{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent3), var(--accent))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Experience
            </span>
          </h2>
        </motion.div>

        <div style={{ maxWidth: '700px' }}>
          {EXPERIENCES.map((exp, i) => (
            <TimelineItem key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}