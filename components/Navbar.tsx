'use client'
import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#tech', label: 'Tech' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (href: string) => {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
          padding: '0 40px',
          transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
          background: scrolled ? 'rgba(4,5,13,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '68px',
        }}>
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={e => { e.preventDefault(); scrollTo('#home') }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
            aria-label="Gaurav Sood - Home"
          >
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px var(--glow)',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>G</span>
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)',
            }}>
              Gaurav<span style={{ color: 'var(--accent)' }}>.</span>
            </span>
          </motion.a>

          {/* Desktop links */}
          <ul style={{ display: 'flex', gap: '4px', listStyle: 'none', alignItems: 'center' }}
            role="list" className="nav-desktop">
            {NAV_LINKS.map(link => {
              const id = link.href.replace('#', '')
              const isActive = active === id
              return (
                <li key={link.href}>
                  <motion.a
                    href={link.href}
                    onClick={e => { e.preventDefault(); scrollTo(link.href) }}
                    whileHover={{ color: 'var(--text)' }}
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 500,
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                      textDecoration: 'none', padding: '6px 14px', borderRadius: '8px',
                      position: 'relative', transition: 'color 0.2s',
                      background: isActive ? 'rgba(79,110,247,0.08)' : 'transparent',
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        style={{
                          position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)',
                          width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)',
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </motion.a>
                </li>
              )
            })}
          </ul>

          {/* CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <motion.a
              href="mailto:your@email.com"
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px var(--glow)' }}
              whileTap={{ scale: 0.96 }}
              className="nav-cta"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '0.84rem', fontWeight: 600,
                color: '#fff', textDecoration: 'none', padding: '8px 18px', borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                transition: 'box-shadow 0.3s ease', letterSpacing: '0.01em',
              }}
            >
              Hire Me
            </motion.a>

            {/* Hamburger — mobile only */}
            <motion.button
              onClick={() => setMenuOpen(o => !o)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle mobile menu"
              aria-expanded={menuOpen}
              className="hamburger"
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                display: 'none', flexDirection: 'column', gap: '5px',
                padding: '8px',
              }}
            >
              {[0, 1, 2].map(i => (
                <motion.span key={i} style={{ display: 'block', width: '22px', height: '2px', background: 'var(--text)', borderRadius: '2px' }}
                  animate={{
                    rotate: menuOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                    y: menuOpen ? (i === 0 ? 7 : i === 2 ? -7 : 0) : 0,
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                  transition={{ duration: 0.25 }}
                />
              ))}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 850,
              background: 'rgba(4,5,13,0.97)', backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '8px',
            }}
            role="dialog" aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={e => { e.preventDefault(); scrollTo(link.href) }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 8vw, 2.8rem)',
                  fontWeight: 700, color: 'var(--text)', textDecoration: 'none',
                  padding: '8px 24px', letterSpacing: '-0.02em',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* AnimatePresence import fix */}
      <style jsx>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hamburger { display: flex !important; }
          .nav-cta { display: none !important; }
        }
      `}</style>
    </>
  )
}

// Need AnimatePresence from framer-motion - already imported via components
// This file re-exports for convenience
import { AnimatePresence } from 'framer-motion'