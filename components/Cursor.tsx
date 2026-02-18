'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [label, setLabel] = useState('')

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const springX = useSpring(mouseX, { stiffness: 500, damping: 35 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 35 })
  const trailX = useSpring(mouseX, { stiffness: 120, damping: 22 })
  const trailY = useSpring(mouseY, { stiffness: 120, damping: 22 })

  useEffect(() => {
    // Only show on desktop with fine pointer
    if (!window.matchMedia('(pointer: fine)').matches) return

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX); mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const down = () => setClicking(true)
    const up = () => setClicking(false)
    const leave = () => setVisible(false)
    const enter = () => setVisible(true)

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.documentElement.addEventListener('mouseleave', leave)
    document.documentElement.addEventListener('mouseenter', enter)

    // Track interactive elements
    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('a, button, [role="button"], [data-magnetic]') as HTMLElement | null
      if (el) {
        setHovered(true)
        setLabel(el.getAttribute('data-cursor-label') || '')
      } else {
        setHovered(false)
        setLabel('')
      }
    }
    document.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.documentElement.removeEventListener('mouseleave', leave)
      document.documentElement.removeEventListener('mouseenter', enter)
      document.removeEventListener('mouseover', onOver)
    }
  }, [mouseX, mouseY, visible])

  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return null

  return (
    <>
      {/* Trail dot */}
      <motion.div
        aria-hidden="true"
        style={{
          x: trailX, y: trailY,
          position: 'fixed', zIndex: 9999,
          width: hovered ? '40px' : '8px', height: hovered ? '40px' : '8px',
          borderRadius: '50%',
          background: hovered ? 'transparent' : 'var(--accent)',
          border: hovered ? '1px solid var(--accent)' : 'none',
          opacity: visible ? (hovered ? 0.5 : 0.3) : 0,
          pointerEvents: 'none',
          translateX: '-50%', translateY: '-50%',
          transition: 'width 0.25s ease, height 0.25s ease, opacity 0.3s ease, background 0.25s ease',
        }}
      />

      {/* Main cursor dot */}
      <motion.div
        aria-hidden="true"
        style={{
          x: springX, y: springY,
          position: 'fixed', zIndex: 10000,
          width: clicking ? '6px' : hovered ? '10px' : '8px',
          height: clicking ? '6px' : hovered ? '10px' : '8px',
          borderRadius: '50%',
          background: hovered ? 'var(--accent3)' : 'var(--accent)',
          opacity: visible ? 1 : 0,
          pointerEvents: 'none',
          translateX: '-50%', translateY: '-50%',
          boxShadow: hovered ? '0 0 12px var(--accent3)' : '0 0 8px var(--accent)',
          transition: 'width 0.15s ease, height 0.15s ease, background 0.2s ease, box-shadow 0.2s ease',
        }}
      />

      {/* Label */}
      {label && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          aria-hidden="true"
          style={{
            x: springX, y: springY,
            position: 'fixed', zIndex: 9999,
            translateX: '16px', translateY: '-50%',
            pointerEvents: 'none',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px', padding: '4px 10px',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            color: 'var(--accent3)', letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </motion.div>
      )}
    </>
  )
}