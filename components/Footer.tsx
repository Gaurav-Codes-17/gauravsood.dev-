'use client'
import { motion } from 'framer-motion'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '40px 0',
      background: 'var(--bg2)',
    }}
      role="contentinfo"
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
          © {year} <span style={{ color: 'var(--accent)' }}>Gaurav Sood</span>. Built with Next.js & ♥
        </p>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {[
            { href: 'https://github.com/Gaurav-Codes-17/', label: 'GitHub' },
            { href: 'https://www.linkedin.com/in/gaurav-sood-1a345a163/', label: 'LinkedIn' },
          ].map(link => (
            <motion.a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
              whileHover={{ color: 'var(--accent)', y: -2 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.2s' }}
              aria-label={link.label}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  )
}