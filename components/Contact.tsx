'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useIsMobile } from '@/lib/usePerformance'

const SOCIALS = [
  {
    label: 'Email', value: 'gaurav.codes.17@gmail.com', href: 'mailto:gaurav.codes.17@gmail.com',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>,
    color: '#4f6ef7',
  },
  {
    label: 'GitHub', value: 'Gaurav-Codes-17', href: 'https://github.com/Gaurav-Codes-17/',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>,
    color: '#e8eaf6',
  },
  {
    label: 'LinkedIn', value: 'gaurav-sood', href: 'https://www.linkedin.com/in/gaurav-sood-1a345a163/',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    color: '#0077b5',
  },
]

function MagneticButton({ status }: { status: string }) {
  const ref = useRef<HTMLButtonElement>(null)
  const isMobile = useIsMobile()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouse = (e: React.MouseEvent) => {
    if (isMobile || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35)
  }
  const reset = () => { x.set(0); y.set(0) }
  const isIdle = status === 'idle'

  return (
    <motion.button
      ref={ref} type="submit" disabled={!isIdle}
      onMouseMove={handleMouse} onMouseLeave={reset}
      style={{
        x: springX, y: springY, alignSelf: 'flex-start',
        padding: '16px 36px',
        background: status === 'sent'
          ? 'linear-gradient(135deg, #06d6a0, #00b894)'
          : 'linear-gradient(135deg, var(--accent), var(--accent2))',
        border: 'none', borderRadius: '14px', color: '#fff',
        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.98rem',
        cursor: isIdle ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', gap: '10px',
        boxShadow: status === 'sent'
          ? '0 0 40px rgba(6,214,160,0.35)'
          : '0 0 30px var(--glow), 0 0 60px var(--glow2)',
        position: 'relative', overflow: 'hidden',
        transition: 'background 0.4s ease, box-shadow 0.4s ease',
      }}
      whileHover={isIdle ? { scale: 1.04 } : {}}
      whileTap={isIdle ? { scale: 0.96 } : {}}
    >
      {isIdle && (
        <motion.div
          initial={{ x: '-120%', skewX: -20 }}
          whileHover={{ x: '220%' }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0, width: '50%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.span key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            Send Message
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
          </motion.span>
        )}
        {status === 'sending' && (
          <motion.span key="sending" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
            />
            Sending…
          </motion.span>
        )}
        {status === 'sent' && (
          <motion.span key="sent" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✓ Message Sent!
          </motion.span>
        )}
        {status === 'error' && (
          <motion.span key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            Try Again →
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function Field({ id, label, type = 'text', value, onChange, placeholder, required, multiline }: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string; required?: boolean; multiline?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const hasValue = value.length > 0

  const baseStyle: React.CSSProperties = {
    width: '100%', padding: '20px 18px 10px',
    background: 'rgba(7,9,18,0.6)',
    border: `1.5px solid ${focused ? 'var(--accent)' : hasValue ? 'var(--border-bright)' : 'var(--border)'}`,
    borderRadius: '12px', color: 'var(--text)',
    fontFamily: 'var(--font-body)', fontSize: '0.93rem',
    outline: 'none', transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    boxShadow: focused ? '0 0 0 3px rgba(79,110,247,0.1), 0 0 20px rgba(79,110,247,0.06)' : 'none',
    resize: multiline ? 'vertical' : undefined,
    minHeight: multiline ? '148px' : undefined,
  }

  return (
    <div style={{ position: 'relative' }}>
      <motion.label
        htmlFor={id}
        animate={{
          fontSize: focused || hasValue ? '0.62rem' : '0.88rem',
          top: focused || hasValue ? '8px' : '50%',
          y: focused || hasValue ? '0' : multiline ? '-300%' : '-50%',
          color: focused ? 'var(--accent)' : hasValue ? 'var(--text-muted)' : 'var(--text-dim)',
        }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', left: '18px', pointerEvents: 'none',
          fontFamily: 'var(--font-mono)', letterSpacing: '0.06em',
          zIndex: 1, top: multiline ? '18px' : '50%',
          transform: multiline ? 'none' : 'translateY(-50%)',
        }}
      >
        {label}{required && <span style={{ color: 'var(--accent4)', marginLeft: '3px' }}>*</span>}
      </motion.label>
      {multiline ? (
        <textarea id={id} rows={5} required={required} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={focused ? placeholder : ''}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...baseStyle, paddingTop: '28px' }} aria-required={required}
        />
      ) : (
        <input id={id} type={type} required={required} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={focused ? placeholder : ''}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={baseStyle} aria-required={required}
        />
      )}
    </div>
  )
}

function SocialCard({ item, index }: { item: typeof SOCIALS[number]; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.a
      href={item.href}
      target={item.href.startsWith('mailto') ? undefined : '_blank'}
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      whileHover={{ x: 6 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '16px 20px', borderRadius: '14px',
        background: hovered ? `${item.color}10` : 'rgba(11,13,26,0.5)',
        border: `1px solid ${hovered ? item.color + '35' : 'var(--border)'}`,
        textDecoration: 'none',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
      aria-label={`${item.label}: ${item.value}`}
    >
      <div style={{
        width: '42px', height: '42px', borderRadius: '11px', flexShrink: 0,
        background: `${item.color}15`, border: `1px solid ${item.color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: item.color,
        boxShadow: hovered ? `0 0 18px ${item.color}25` : 'none',
        transition: 'box-shadow 0.25s ease',
      }}>
        {item.icon}
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>
          {item.label}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: hovered ? item.color : 'var(--text)', transition: 'color 0.2s', fontWeight: 500 }}>
          {item.value}
        </p>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ marginLeft: 'auto', color: hovered ? item.color : 'var(--text-dim)', transition: 'color 0.2s, transform 0.2s', transform: hovered ? 'translateX(3px)' : '' }}>
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </motion.a>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1800))
    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 5000)
  }

  return (
    <section id="contact" className="section" style={{ position: 'relative', overflow: 'hidden' }} aria-labelledby="contact-heading">
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '450px',
          background: 'radial-gradient(ellipse, rgba(247,37,133,0.06) 0%, rgba(124,58,237,0.04) 40%, transparent 70%)',
        }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          <p className="section-label" style={{ justifyContent: 'center' }}>Get In Touch</p>
          <h2 id="contact-heading" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
            fontWeight: 800, color: 'var(--text)', lineHeight: 1.05, marginBottom: '18px', letterSpacing: '-0.02em',
          }}>
            Let's Build Something{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent4), var(--accent2), var(--accent))',
              backgroundSize: '200% 200%', WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              animation: 'gradient-shift 4s ease infinite',
            }}>
              Remarkable
            </span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '1rem', maxWidth: '460px', margin: '0 auto' }}>
            Open to freelance projects, full-time roles, and interesting collaborations.{' '}
            <span style={{ color: 'var(--accent3)' }}>I reply within 24 hours.</span>
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: '48px', alignItems: 'start' }}>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            style={{
              background: 'rgba(11,13,26,0.75)', border: '1px solid var(--border)',
              borderRadius: '24px', padding: 'clamp(28px, 5vw, 44px)',
              display: 'flex', flexDirection: 'column', gap: '28px',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
            }}
            aria-label="Contact form"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent3)', boxShadow: '0 0 10px var(--accent3)' }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                New Message
              </span>
            </div>

            <Field id="name" label="Your Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="John Appleseed" required />
            <Field id="email" label="Email Address" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="john@company.com" required />
            <Field id="message" label="Message" value={form.message} onChange={v => setForm(f => ({ ...f, message: v }))} placeholder="Tell me about your project, timeline, and budget…" required multiline />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <MagneticButton status={status} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                🔒 No spam. Ever.
              </p>
            </div>
          </motion.form>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Availability */}
            <div style={{ background: 'rgba(6,214,160,0.05)', border: '1px solid rgba(6,214,160,0.2)', borderRadius: '20px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <motion.div animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent3)', boxShadow: '0 0 12px var(--accent3)' }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--accent3)', letterSpacing: '0.12em' }}>
                  CURRENTLY AVAILABLE
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>
                Open to opportunities
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Looking for full-time roles or long-term freelance projects starting immediately.
              </p>
            </div>

            {/* Socials */}
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>
                Find me on
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {SOCIALS.map((s, i) => <SocialCard key={s.label} item={s} index={i} />)}
              </div>
            </div>

            {/* Response time badge */}
            <div style={{
              background: 'rgba(79,110,247,0.04)', border: '1px solid var(--border)',
              borderRadius: '16px', padding: '18px 22px',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: 'rgba(79,110,247,0.1)', border: '1px solid rgba(79,110,247,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '2px' }}>
                  Fast Response Time
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--text-dim)' }}>
                  Average reply within 24 hours
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  )
}