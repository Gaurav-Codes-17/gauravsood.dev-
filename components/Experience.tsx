'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Project = {
  name: string
  url?: string
  description: string
}

type Experience = {
  role: string
  company: string
  period: string
  description: string
  tech: string[]
  current?: boolean
  accent: string
  accentRgb: string
  icon: string
  projects?: Project[]
}

const EXPERIENCES: Experience[] = [
  {
    role: 'Full Stack Developer',
    company: 'Learning Phase',
    period: '2022',
    description:
      'Built multiple personal and client projects from the ground up while learning full-stack development. Focused on React frontends, Node.js backends, authentication flows, and real-world application architecture.',
    tech: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'REST API' , 'Next.js' , 'Three.js' , 'Framer Motion' , 'GSAP',
            'Figma' , 'Tailwind CSS' , 'TypeScript'  , 'Docker' , 'Deployment' , 'Github' , 'Microservices'
    ],
    accent: '#a78bfa',
    accentRgb: '167,139,250',
    icon: '🚀',
    projects: [
      { name: 'Bizztunes', url: 'https://bizztunes.in', description: 'Music platform for businesses' },
      { name: 'ZenFeed', url: 'https://zenfeed-app.vercel.app', description: 'Social media platform specially designed for Genz' },
      { name: 'Authentication Flow', description: 'JWT-based login, refresh tokens, and protected routes' },
      { name: 'REST API Architecture', description: 'Express + MongoDB CRUD structure with validation' },
      { name: 'Reusable React Components', description: 'Common UI components used across apps' },
      { name: 'State Management', description: 'Handled async data and global state patterns' },
      { name: 'Deployment Setup', description: 'Production-ready build and environment configuration' },
    ],
  },
  {
    role: 'Backend Developer & UI/UX Designer',
    company: 'Cito Cabs',
    period: 'Feb 2025 – Dec 2025',
    accent: '#fbbf24',
    accentRgb: '251,191,36',
    icon: '🚕',
    description:
      'cooperated with seniors to built scalable ride-hailing infrastructure with real-time driver tracking via WebSockets. Designed the full product UI in Figma and implemented Redis caching that cut API response times significantly.',
    tech: ['JavaScript', 'Node.js', 'MongoDB', 'Redis', 'Express.js', 'PostgreSQL', 'Figma', 'Canva'],
    projects: [
    { name: 'Driver Tracking System', description: 'Real-time driver location updates using WebSockets' },
    { name: 'Ride Booking API', description: 'RESTful booking flow with Redis-based caching' },
    { name: 'UI/UX Design', description: 'Designed end-to-end product UI and user flows in Figma' },
    { name: 'Social Media Creatives', description: 'Designed marketing graphics and short promotional videos' },
  ]
  },
  {
    role: 'Full Stack Developer',
    company: 'ONS Logistics Ind Pvt Ltd',
    period: 'Jan 2026 – Present',
    current: true,
    accent: '#34d399',
    accentRgb: '52,211,153',
    icon: '🏢',
    description:
      'Architecting and shipping the entire Onslog SaaS platform — client quotations, RBAC access control, job tracking, and shipment management. Sole frontend engineer responsible for every pixel.',
    tech: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Cloudinary', 'Brevo'],
    projects: [
    { name: 'ONS Logistics', url: 'https://onslog.com', description: 'Multi-tenant logistics SaaS handling quotations, jobs, and shipments' },
    { name: 'Quotation Workflow', description: 'End-to-end quotation creation, approval, and PDF export flow' },
    { name: 'RBAC System', description: 'Role-based access across Admin, Manager, and Staff users' },
    { name: 'Admin Dashboard', description: 'Operational dashboards with filters, tables, and analytics' },
    { name: 'Client Dashboard', description: 'Operational dashboards with all the related jobs and quotation with proper kyc verification of the clients ' },
  ]
  },
]

function ExternalIcon({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function ProjectsPopover({ exp, visible }: { exp: Experience; visible: boolean }) {
  if (!exp.projects?.length) return null
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 14, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 8, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            left: '780px',
            top: '0px',
            width: '268px',
            zIndex: 100,
            pointerEvents: 'all',
          }}
        >
          {/* Connecting line */}
          <div style={{
            position: 'absolute', top: '32px', left: '-780px',
            width: '774px', height: '1px',
            background: `linear-gradient(90deg, transparent 0%, rgba(${exp.accentRgb},0.25) 40%, rgba(${exp.accentRgb},0.6) 100%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ height: '1px', flex: 1, background: `linear-gradient(90deg, ${exp.accent}, transparent)` }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.57rem',
              color: exp.accent, letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>Contributions</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {exp.projects.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.055, duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {p.url ? (
                  <a
                    href={p.url} target="_blank" rel="noopener noreferrer"
                    className="proj-link"
                    data-rgb={exp.accentRgb}
                    style={{
                      display: 'block', textDecoration: 'none', padding: '10px 13px',
                      background: `rgba(${exp.accentRgb}, 0.12)`,
                      border: `1px solid rgba(${exp.accentRgb}, 0.4)`,
                      borderLeft: `3px solid ${exp.accent}`,
                      borderRadius: '10px', cursor: 'pointer',
                      transition: 'background 0.2s, transform 0.2s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = `rgba(${exp.accentRgb}, 0.22)`
                      el.style.transform = 'translateX(3px)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.background = `rgba(${exp.accentRgb}, 0.12)`
                      el.style.transform = 'translateX(0)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{p.name}</span>
                      <ExternalIcon color={exp.accent} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(220,220,240,0.8)', lineHeight: 1.45, display: 'block' }}>{p.description}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem', color: exp.accent, marginTop: '4px', display: 'block', opacity: 0.85 }}>
                      {p.url.replace('https://', '')}
                    </span>
                  </a>
                ) : (
                  <div style={{
                    padding: '10px 13px',
                    background: `rgba(${exp.accentRgb}, 0.07)`,
                    border: `1px solid rgba(${exp.accentRgb}, 0.22)`,
                    borderLeft: `3px solid rgba(${exp.accentRgb}, 0.55)`,
                    borderRadius: '10px',
                  }}>
                    <div style={{ marginBottom: '3px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 700, color: '#e8e8f8' }}>{p.name}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(200,200,225,0.7)', lineHeight: 1.45, display: 'block' }}>{p.description}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TimelineItem({
  exp, index, openIndex, setOpenIndex,
}: {
  exp: Experience; index: number; openIndex: number | null; setOpenIndex: (i: number | null) => void
}) {
  const isLast = index === EXPERIENCES.length - 1
  const isOpen = openIndex === index

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', gap: '0', position: 'relative' }}
      onMouseEnter={() => setOpenIndex(index)}
    >
      {/* Left col */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        width: '80px', flexShrink: 0, paddingTop: '20px', position: 'relative',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
          color: isOpen ? exp.accent : 'rgba(210,210,235,0.55)',
          letterSpacing: '0.05em', marginBottom: '10px',
          textAlign: 'center', lineHeight: 1.6, whiteSpace: 'pre-line',
          transition: 'color 0.4s ease',
        }}>
          {exp.period.replace(' – ', '\n–\n')}
        </span>

        {/* Dot */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', flexShrink: 0, position: 'relative', zIndex: 2,
          background: isOpen ? `rgba(${exp.accentRgb}, 0.25)` : `rgba(${exp.accentRgb}, 0.14)`,
          border: `2px solid ${isOpen ? exp.accent : `rgba(${exp.accentRgb}, 0.45)`}`,
          boxShadow: isOpen
            ? `0 0 0 5px rgba(${exp.accentRgb},0.12), 0 0 36px rgba(${exp.accentRgb},0.5)`
            : exp.current
              ? `0 0 18px rgba(${exp.accentRgb},0.35), 0 0 0 3px rgba(${exp.accentRgb},0.08)`
              : `0 0 12px rgba(${exp.accentRgb},0.2)`,
          transform: isOpen ? 'scale(1.15)' : 'scale(1)',
          transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          {exp.icon}
          {isOpen && (
            <div style={{
              position: 'absolute', inset: '-6px', borderRadius: '18px',
              border: `1.5px solid rgba(${exp.accentRgb}, 0.45)`,
              animation: 'ringPulse 1.8s ease-out infinite',
              pointerEvents: 'none',
            }} />
          )}
        </div>

        <ProjectsPopover exp={exp} visible={isOpen} />

        {!isLast && (
          <div style={{
            position: 'relative', flex: 1, width: '2px',
            marginTop: '10px', overflow: 'hidden', minHeight: '40px',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.08)' }} />
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(180deg, ${exp.accent}90, transparent)`,
                transformOrigin: 'top',
              }}
            />
          </div>
        )}
      </div>

      {/* Card */}
      <div style={{ flex: 1, paddingLeft: '24px', paddingBottom: isLast ? 0 : '48px' }}>
        <div style={{
          borderRadius: '20px',
          padding: '26px 28px',
          position: 'relative',
          overflow: 'hidden',
          /* Strong visible background — never disappears */
          background: isOpen
            ? `linear-gradient(135deg, rgba(${exp.accentRgb},0.14) 0%, rgb(22,24,40) 55%)`
            : 'rgb(22,24,40)',
          /* Vivid border always visible */
          border: isOpen
            ? `1.5px solid rgba(${exp.accentRgb}, 0.6)`
            : `1.5px solid rgba(${exp.accentRgb}, 0.25)`,
          /* Strong shadow so card lifts off the page */
          boxShadow: isOpen
            ? `0 24px 70px rgba(${exp.accentRgb},0.2), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(${exp.accentRgb},0.15)`
            : `0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)`,
          transition: 'all 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>

          {/* Top-left accent corner strip */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: isOpen ? '120px' : '60px', height: '3px',
            background: `linear-gradient(90deg, ${exp.accent}, transparent)`,
            borderRadius: '20px 0 0 0',
            transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          }} />

          {/* Ambient glow top-right */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '220px', height: '220px', borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${exp.accentRgb},${isOpen ? '0.2' : '0.07'}) 0%, transparent 70%)`,
            pointerEvents: 'none',
            transition: 'all 0.5s ease',
          }} />

          {/* CURRENT badge */}
          {exp.current && (
            <div style={{
              position: 'absolute', top: '18px', right: '18px', zIndex: 3,
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              color: exp.accent, letterSpacing: '0.12em',
              background: `rgba(${exp.accentRgb},0.15)`,
              border: `1px solid rgba(${exp.accentRgb},0.45)`,
              padding: '4px 11px', borderRadius: '100px',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: exp.accent, flexShrink: 0,
                animation: 'pulseDot 2s ease-in-out infinite',
              }} />
              CURRENT
            </div>
          )}

          {/* Role */}
          <div style={{ marginBottom: '14px', paddingRight: exp.current ? '106px' : 0, position: 'relative', zIndex: 2 }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.18rem',
              fontWeight: 800,
              /* Always bright white */
              color: '#ffffff',
              lineHeight: 1.2, marginBottom: '6px',
            }}>
              {exp.role}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.73rem',
                /* Always full accent color */
                color: exp.accent,
                fontWeight: 700,
              }}>
                {exp.company}
              </span>
              <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(200,200,230,0.3)', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.63rem',
                /* Legible period — not too dim */
                color: 'rgba(200,205,230,0.65)',
              }}>
                {exp.period}
              </span>
            </div>
          </div>

          {/* Description — always bright */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.89rem',
            /* Strong readable color always */
            color: 'rgba(230,230,250,0.92)',
            lineHeight: 1.82, marginBottom: '18px', position: 'relative', zIndex: 2,
          }}>
            {exp.description}
          </p>

          {/* Tech chips — always visible */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', position: 'relative', zIndex: 2 }}>
            {exp.tech.map(t => (
              <span key={t} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.61rem',
                color: isOpen ? exp.accent : 'rgba(210,215,240,0.8)',
                background: isOpen ? `rgba(${exp.accentRgb},0.15)` : 'rgba(255,255,255,0.08)',
                border: `1px solid ${isOpen ? `rgba(${exp.accentRgb},0.45)` : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '6px', padding: '4px 10px', letterSpacing: '0.04em',
                transition: 'color 0.4s ease, background 0.4s ease, border-color 0.4s ease',
              }}>{t}</span>
            ))}
          </div>

          {/* Hint */}
          {exp.projects?.length ? (
            <div style={{
              marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px',
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? 'translateY(4px)' : 'none',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              pointerEvents: 'none', position: 'relative', zIndex: 2,
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke={`rgba(${exp.accentRgb},0.55)`} strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.59rem',
                color: `rgba(${exp.accentRgb},0.55)`, letterSpacing: '0.07em',
              }}>
                hover to reveal all my contributions →
              </span>
            </div>
          ) : null}

          {/* Bottom accent bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '2.5px',
            background: `linear-gradient(90deg, ${exp.accent}, rgba(${exp.accentRgb},0.08))`,
            borderRadius: '0 0 20px 20px',
            transform: isOpen ? 'scaleX(1)' : 'scaleX(0)',
            opacity: isOpen ? 1 : 0,
            transformOrigin: 'left',
            transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease',
          }} />
        </div>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(e.target as Node)) {
        setOpenIndex(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section"
      aria-labelledby="experience-heading"
      style={{ position: 'relative', overflow: 'visible' }}
    >
      <div style={{
        position: 'absolute', top: '40%', left: '55%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', transform: 'translate(-50%,-50%)',
      }} />

      <div className="container" style={{ overflow: 'visible' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '64px' }}
        >
          <p className="section-label">Career</p>
          <h2 id="experience-heading" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800, color: '#ffffff', lineHeight: 1.1,
          }}>
            Work{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent3), var(--accent))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Experience
            </span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', color: 'rgba(210,215,240,0.72)',
            marginTop: '12px', fontSize: '0.93rem', lineHeight: 1.65,
          }}>
            From self-taught experiments to production systems used daily.
          </p>
        </motion.div>

        <div style={{ maxWidth: '680px', position: 'relative', overflow: 'visible' }}>
          {EXPERIENCES.map((exp, i) => (
            <TimelineItem
              key={i} exp={exp} index={i}
              openIndex={openIndex} setOpenIndex={setOpenIndex}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px currentColor; }
          50%       { opacity: 0.7; box-shadow: 0 0 18px currentColor; }
        }
        @keyframes ringPulse {
          0%   { transform: scale(1);   opacity: 0.65; }
          100% { transform: scale(1.75); opacity: 0; }
        }
      `}</style>
    </section>
  )
}