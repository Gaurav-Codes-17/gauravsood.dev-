'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MacMockupProps {
  url: string
  children: ReactNode
  screenHeight?: number
  glowColor?: string
}

export default function MacMockup({ url, children, screenHeight = 320, glowColor = 'rgba(102,126,234,0.25)' }: MacMockupProps) {
  return (
    <motion.div
      whileHover={{ y: -10, rotateX: 2 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="mac-wrap w-full"
    >
      <div
        className="relative"
        style={{ filter: `drop-shadow(0 60px 80px rgba(0,0,0,0.8)) drop-shadow(0 0 60px ${glowColor})` }}
      >
        {/* Monitor body */}
        <div className="mac-body">
          <div className="mac-notch" />

          {/* Screen */}
          <div className="mac-screen-wrap" style={{ height: screenHeight }}>
            {/* Title bar */}
            <div className="mac-titlebar">
              <div className="mac-dot mac-dot-r" />
              <div className="mac-dot mac-dot-y" />
              <div className="mac-dot mac-dot-g" />

              {/* URL bar */}
              <div className="mac-url-bar">
                <div className="mac-url-dot" />
                <span className="mac-url-text">{url}</span>
              </div>

              {/* Right icons */}
              <div className="ml-auto flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="w-4 h-4 rounded-sm" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>
            </div>

            {/* Screen content */}
            <div className="mac-content" style={{ height: screenHeight - 36, overflow: 'hidden' }}>
              {children}
            </div>
          </div>
        </div>

        {/* Reflection */}
        <div
          className="absolute top-3 left-4 right-4 h-1/3 rounded-t-lg pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
            borderRadius: '12px 12px 0 0',
          }}
        />

        {/* Stand neck */}
        <div className="mac-stand-neck" style={{ width: '12%', margin: '0 auto' }} />

        {/* Stand base */}
        <div className="mac-stand-base" style={{ width: '40%', margin: '0 auto' }} />
      </div>
    </motion.div>
  )
}