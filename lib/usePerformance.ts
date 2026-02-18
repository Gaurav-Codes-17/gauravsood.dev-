'use client'
import { useState, useEffect } from 'react'

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reducedMotion
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

export function useIsLowEnd(): boolean {
  const [isLowEnd, setIsLowEnd] = useState(false)
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const hasLowMemory = (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4
    const hasSlowConnection = (navigator as any).connection?.effectiveType === '2g' || (navigator as any).connection?.effectiveType === '3g'
    setIsLowEnd(isMobile || hasLowMemory || hasSlowConnection)
  }, [])
  return isLowEnd
}