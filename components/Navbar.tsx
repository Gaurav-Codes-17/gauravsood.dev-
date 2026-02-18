'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'

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

  useMotionValueEvent(scrollY, 'change', v => setScrolled(v > 40))

  /* Active section observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )

    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const scrollTo = (href: string) => {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      {/* ───────── NAVBAR ───────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          inset: '0 0 auto 0',
          zIndex: 900,
          padding: '0 40px',
          background: scrolled ? 'rgba(4,5,13,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
          transition: 'all 0.35s ease',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            height: '68px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={e => {
              e.preventDefault()
              scrollTo('#home')
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 0 20px var(--glow)',
              }}
            >
              <span style={{ color: '#fff', fontWeight: 800 }}>G</span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>
              Gaurav<span style={{ color: 'var(--accent)' }}>.</span>
            </span>
          </motion.a>

          {/* Desktop Links */}
          <ul className="nav-desktop" style={{ display: 'flex', gap: 6, listStyle: 'none' }}>
            {NAV_LINKS.map(link => {
              const id = link.href.replace('#', '')
              const isActive = active === id
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={e => {
                      e.preventDefault()
                      scrollTo(link.href)
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      background: isActive ? 'rgba(79,110,247,0.08)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a
              href="mailto:gaurav.codes.17@gmail.com"
              className="nav-cta"
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.84rem',
                fontWeight: 600,
              }}
            >
              Hire Me
            </a>

            {/* Hamburger */}
            <button
              className="hamburger"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'none',
                flexDirection: 'column',
                gap: 5,
                padding: 8,
              }}
            >
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  animate={{
                    rotate: menuOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                    y: menuOpen ? (i === 0 ? 7 : i === 2 ? -7 : 0) : 0,
                    opacity: menuOpen && i === 1 ? 0 : 1,
                  }}
                  transition={{ duration: 0.25 }}
                  style={{
                    width: 22,
                    height: 2,
                    background: 'var(--text)',
                    borderRadius: 2,
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ───────── MOBILE MENU ───────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 850,
              background: 'rgba(4,5,13,0.97)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
            role="dialog"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={e => {
                  e.preventDefault()
                  scrollTo(link.href)
                }}
                style={{
                  fontSize: 'clamp(1.8rem, 8vw, 2.8rem)',
                  fontWeight: 700,
                  color: 'var(--text)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive rules */}
      <style jsx>{`
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
          .nav-cta {
            display: none !important;
          }
          .hamburger {
            display: flex !important;
          }
        }
      `}</style>
    </>
  )
}
