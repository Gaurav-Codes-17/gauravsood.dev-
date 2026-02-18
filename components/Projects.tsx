'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useIsMobile } from '@/lib/usePerformance'

type Project = {
  id: string
  title: string
  tagline: string
  description: string
  longDescription: string
  highlights: string[]
  tech: string[]
  color: string
  accent: string
  github?: string
  live?: string
  audioSrc?: string
  year: string
  category: string
  badge?: string
  preview?: string
  screenshots?: string[]   // multiple snapshots for carousel
  previewVideo?: string
  internal?: boolean
}

/*
 * ─── HOW TO ADD SCREENSHOTS ──────────────────────────────────────────────────
 *
 * 1. Drop your screenshot files into /public/previews/
 *    e.g.  /public/previews/onslog-1.png
 *          /public/previews/onslog-2.png
 *          /public/previews/onslog-3.png
 *
 * 2. Add them to the `screenshots` array for the matching project below.
 *    Order matters — first item shows first.
 *
 * 3. They auto-rotate every 3.2s on hover (card) and immediately (modal).
 *    The dots at the bottom let users jump to any slide manually.
 *
 * TIP: Ideal screenshot size is 1280×800px (16:10). Any size works but
 *      wider screenshots look best in the Mac browser frame.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const PROJECTS: Project[] = [
  {
    id: 'onslog',
    title: 'Onslog',
    tagline: 'Full enterprise platform built from zero for a real client.',
    description:
      'Designed and engineered the entire frontend and internal business software for Onslog — covering client quotations, RBAC access control, job tracking, and shipment management.',
    longDescription:
      'Onslog is a production SaaS platform I built end-to-end for the company I currently work at. Starting from a blank repo, I architected the frontend, designed the component system, and implemented four major internal tools that the team uses daily. This is live, real software that a business depends on.',
    highlights: [
      '📋 Client Quotation Engine — dynamic quote builder with PDF export and approval workflow',
      '🔐 RBAC Access Control — role-based permissions across Admin, Manager, and Staff tiers',
      '📦 Job Tracking Dashboard — real-time status pipeline from inquiry to delivery',
      '🚢 Shipment Management — end-to-end logistics tracking with status updates and history',
      '🏗️ Built the full frontend architecture from scratch with scalable component structure',
      '⚡ Integrated with backend APIs, handled complex form state, and built reusable UI system',
    ],
    tech: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'REST API', 'RBAC', 'Zustand'],
    color: 'rgba(6,214,160,0.07)',
    accent: '#06d6a0',
    live: 'https://onslog.com',
    audioSrc: '/audio/onslog.mp3',
    preview: '/previews/onslog.png',
    screenshots: [
      '/previews/onslog.png',
      '/previews/onslog-2.png',
      '/previews/onslog-3.png',
      '/previews/onslog-4.png',
    ],
    year: '2024–25',
    category: 'Enterprise',
    badge: 'Production',
    internal: true,
  },
  {
    id: 'zenfeed',
    title: 'ZenFeed',
    tagline: 'Real-time social media app with auth and live feeds.',
    description:
      'A production-deployed social media platform featuring real-time feeds, full authentication, follow/unfollow system, post interactions, and optimistic UI state management.',
    longDescription:
      'ZenFeed is a full-stack social media application I built to push my real-time and auth skills into production. It handles live feed updates, user authentication with protected routes, follow graphs, post creation/deletion, likes, and comments — all with smooth optimistic updates so the UI never feels slow.',
    highlights: [
      '⚡ Real-time feed updates — new posts appear live without page refresh',
      '🔒 Full authentication — signup, login, protected routes, session management',
      '👥 Follow / unfollow system with personalized feed filtering',
      '❤️ Post interactions — likes, comments, and optimistic UI updates',
      '📱 Fully responsive — mobile-first layout that works on all screen sizes',
      '🚀 Deployed to Vercel — live and publicly accessible right now',
    ],
    tech: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'NextAuth', 'Zustand'],
    color: 'rgba(79,110,247,0.07)',
    accent: '#4f6ef7',
    live: 'https://zenfeed-app.vercel.app',
    audioSrc: '/audio/zenfeed.mp3',
    preview: '/previews/zenfeed.png',
    screenshots: [
      '/previews/zenfeed.png',
      '/previews/zenfeed-2.png',
      '/previews/zenfeed-3.png',
    ],
    year: '2024',
    category: 'Full Stack',
    badge: 'Live',
  },
]

/* ─── Screenshot Carousel ─────────────────────────── */
function ScreenshotCarousel({ screenshots, accent, autoPlay, inView }: {
  screenshots: string[]; accent: string; autoPlay: boolean; inView: boolean
}) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev]       = useState<number | null>(null)
  const [dir,  setDir]        = useState<1 | -1>(1)
  const [userPaused, setUserPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((idx: number, direction: 1 | -1 = 1) => {
    setPrev(current); setDir(direction); setCurrent(idx)
  }, [current])

  // ── KEY FIX: only auto-advance when the card is actually in the viewport
  useEffect(() => {
    if (!autoPlay || !inView || userPaused || screenshots.length < 2) return
    timerRef.current = setTimeout(() => goTo((current + 1) % screenshots.length, 1), 3400)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, autoPlay, inView, userPaused, screenshots.length, goTo])

  const handleDot = (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setUserPaused(false)
    goTo(i, i > current ? 1 : -1)
  }

  if (screenshots.length === 0) return null

  const canPlay = autoPlay && inView && !userPaused

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>

      {/* ── Slides ── */}
      {screenshots.map((src, i) => {
        const isCurrent = i === current
        const isPrev    = i === prev
        if (!isCurrent && !isPrev) return null
        return (
          <div key={src} style={{
            position: 'absolute', inset: 0,
            transform: isCurrent ? 'translateX(0)' : `translateX(${dir * -105}%)`,
            opacity: isCurrent ? 1 : 0,
            transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease',
            willChange: 'transform, opacity',
            overflow: 'hidden',
          }}>
            <img
              src={src}
              alt={`Screenshot ${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain', background: '#07080f', display: 'block',
                // Ken Burns: slow zoom while slide is active and playing
                transform: isCurrent && canPlay ? 'scale(1.04)' : 'scale(1)',
                transition: isCurrent && canPlay ? 'transform 3.4s ease-out' : 'transform 0.5s ease',
              }}
            />
            {/* Reveal shimmer on slide-in */}
            {isCurrent && (
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.055) 50%, transparent 60%)',
                animation: 'shimmerSlide 0.7s ease forwards',
              }} />
            )}
          </div>
        )
      })}

      {/* ── Dots ── */}
      {screenshots.length > 1 && (
        <div onClick={e => e.stopPropagation()} style={{
          position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '5px', alignItems: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
          padding: '5px 10px', borderRadius: '100px', zIndex: 10,
        }}>
          {screenshots.map((_, i) => (
            <button key={i} onClick={() => handleDot(i)} aria-label={`Go to screenshot ${i + 1}`}
              style={{
                width: i === current ? '20px' : '6px', height: '6px',
                borderRadius: '100px', border: 'none', padding: 0,
                cursor: 'pointer', flexShrink: 0,
                background: i === current ? accent : 'rgba(255,255,255,0.28)',
                boxShadow: i === current ? `0 0 8px ${accent}80` : 'none',
                transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.25s, box-shadow 0.25s',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Slide counter (top-right) ── */}
      {screenshots.length > 1 && (
        <div style={{
          position: 'absolute', top: '8px', right: '10px', zIndex: 10,
          fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.45)',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          padding: '2px 7px', borderRadius: '100px',
        }}>
          {current + 1} / {screenshots.length}
        </div>
      )}

      {/* ── Progress bar (bottom edge) ── */}
      {screenshots.length > 1 && canPlay && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.06)', zIndex: 10 }}>
          <div key={`${current}-bar`} style={{
            height: '100%', borderRadius: '0 2px 2px 0',
            background: `linear-gradient(90deg, ${accent}, ${accent}80)`,
            animation: 'slideProgress 3.4s linear forwards',
          }} />
        </div>
      )}
    </div>
  )
}

/* ─── Mac Browser Frame ───────────────────────────── */
function MacBrowserFrame({ preview, screenshots, previewVideo, accent, title, isHovered, eager = false, inView = true }: {
  preview?: string; screenshots?: string[]; previewVideo?: string; accent: string; title: string; isHovered: boolean; eager?: boolean; inView?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const allScreenshots = screenshots && screenshots.length > 0
    ? screenshots
    : preview ? [preview] : []

  useEffect(() => {
    if (!videoRef.current) return
    if (isHovered) videoRef.current.play().catch(() => {})
    else { videoRef.current.pause(); videoRef.current.currentTime = 0 }
  }, [isHovered])

  const hasMedia = allScreenshots.length > 0 || previewVideo
  const slug = title.toLowerCase().replace(/\s+/g, '-')

  // FIX: In eager/modal mode, skip the 3D motion wrapper entirely — no rotateX/Y, no filter transitions
  const frameContent = (
    <div style={{
      background: 'rgba(24,26,38,0.97)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: '11px',
      overflow: 'hidden',
      // FIX: Use a static drop-shadow in modal instead of animated filter
      filter: eager
        ? `drop-shadow(0 28px 55px ${accent}28)`
        : undefined,
    }}>
      {/* Title bar */}
      <div style={{
        height: '32px',
        background: 'linear-gradient(180deg, rgba(55,57,72,0.95) 0%, rgba(38,40,54,0.95) 100%)',
        borderBottom: '1px solid rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div key={i} style={{
              width: '11px', height: '11px', borderRadius: '50%',
              background: isHovered ? c : 'rgba(255,255,255,0.12)',
              // FIX: Remove box-shadow animation in eager mode
              boxShadow: (!eager && isHovered) ? `0 0 5px ${c}70` : 'none',
              transition: eager ? 'none' : 'all 0.3s ease',
            }} />
          ))}
        </div>
        <div style={{
          flex: 1, maxWidth: '260px', margin: '0 auto', height: '18px',
          borderRadius: '4px', background: 'rgba(0,0,0,0.28)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', padding: '0 7px', gap: '5px',
        }}>
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none"
            stroke={isHovered ? '#28c840' : 'rgba(255,255,255,0.18)'} strokeWidth="2.5"
            style={{ flexShrink: 0 }}>
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '8px',
            color: isHovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)',
            whiteSpace: 'nowrap', overflow: 'hidden', letterSpacing: '0.02em',
          }}>
            {isHovered
              ? (title === 'Onslog' ? 'onslog.com' : `zenfeed-app.vercel.app`)
              : 'gauravsood.dev'}
          </span>
        </div>
        <div style={{ width: '44px' }} />
      </div>

      {/* Content area */}
      <div style={{
        position: 'relative', aspectRatio: '16/10',
        background: hasMedia ? '#080910' : `linear-gradient(135deg, ${accent}08, rgba(6,7,16,1) 65%)`,
        overflow: 'hidden',
      }}>
        {previewVideo ? (
          <video ref={videoRef} src={previewVideo} muted loop playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : allScreenshots.length > 0 ? (
          <ScreenshotCarousel
            screenshots={allScreenshots}
            accent={accent}
            autoPlay={isHovered || eager}
            inView={inView}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <div style={{ width: '82%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                {[45, 55, 35].map((w, i) => <div key={i} style={{ height: '7px', width: `${w}%`, borderRadius: '3px', background: `${accent}${isHovered ? '22' : '10'}` }} />)}
              </div>
              {[100, 80, 90, 65, 75].map((w, i) => (
                <div key={i} style={{ height: i === 0 ? '36px' : '8px', width: `${w}%`, borderRadius: i === 0 ? '7px' : '3px', background: i === 0 ? `${accent}14` : 'rgba(255,255,255,0.04)', border: i === 0 ? `1px solid ${accent}20` : 'none' }} />
              ))}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {[28, 28].map((w, i) => <div key={i} style={{ height: '26px', width: `${w}%`, borderRadius: '5px', background: i === 0 ? `${accent}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${i === 0 ? accent + '35' : 'rgba(255,255,255,0.05)'}` }} />)}
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: `${accent}45`, letterSpacing: '0.1em' }}>
              📌 /public/previews/{slug}.png
            </p>
          </div>
        )}

        {/* FIX: Skip shine animation entirely in modal (eager) mode */}
        {!eager && (
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? '220%' : '-60%' }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: 0, left: '-55%', width: '38%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.045), transparent)', transform: 'skewX(-14deg)', pointerEvents: 'none' }}
          />
        )}
      </div>
    </div>
  )

  // FIX: In modal (eager) mode, render plain div — no Framer motion 3D wrapper
  if (eager) {
    return (
      <div style={{ width: '100%', willChange: 'auto' }}>
        {frameContent}
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '50px', pointerEvents: 'none', zIndex: -1, background: `linear-gradient(180deg, ${accent}06 0%, transparent 100%)`, filter: 'blur(3px)', transform: 'scaleY(-1)', opacity: 0.3, borderRadius: '0 0 11px 11px' }} />
      </div>
    )
  }

  return (
    <motion.div
      animate={{ rotateX: isHovered ? 0 : 6, rotateY: isHovered ? 0 : -3, y: isHovered ? -8 : 0, scale: isHovered ? 1.02 : 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        transformStyle: 'preserve-3d', transformOrigin: 'center bottom', width: '100%',
        filter: isHovered
          ? `drop-shadow(0 28px 55px ${accent}28) drop-shadow(0 0 0 1px ${accent}18)`
          : 'drop-shadow(0 16px 36px rgba(0,0,0,0.55))',
        transition: 'filter 0.5s ease',
      }}
    >
      {frameContent}
      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '50px', pointerEvents: 'none', zIndex: -1, background: `linear-gradient(180deg, ${accent}06 0%, transparent 100%)`, filter: 'blur(3px)', transform: 'scaleY(-1)', opacity: isHovered ? 0.5 : 0.15, transition: 'opacity 0.4s ease', borderRadius: '0 0 11px 11px' }} />
    </motion.div>
  )
}

/* ─── Project Card ────────────────────────────────── */
function ProjectCard({ project, onClick, index }: { project: Project; onClick: () => void; index: number }) {
  const isMobile = useIsMobile()
  const [hovered, setHovered] = useState(false)
  const [cardInView, setCardInView] = useState(false)   // ← tracks real scroll visibility
  const cardRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 140, damping: 18 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 140, damping: 18 })

  // ── IntersectionObserver so the carousel only plays when scrolled into view
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setCardInView(entry.isIntersecting),
      { threshold: 0.25 }   // at least 25% visible before starting
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }, [isMobile, mx, my])

  const onMouseLeave = useCallback(() => { mx.set(0); my.set(0); setHovered(false) }, [mx, my])

  const badgeColor: Record<string, string> = {
    Production: '#06d6a0',
    Live: '#4f6ef7',
    'Open Source': '#f72585',
  }
  const bColor = project.badge ? (badgeColor[project.badge] || '#4f6ef7') : project.accent

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={() => setHovered(true)}
      onClick={onClick}
      role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`View details for ${project.title}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.99 }}
      style={{
        rotateX: isMobile ? 0 : rotX,
        rotateY: isMobile ? 0 : rotY,
        transformStyle: 'preserve-3d',
        cursor: 'pointer', position: 'relative',
        background: hovered
          ? `linear-gradient(145deg, ${project.color.replace('0.07', '0.14')}, rgba(7,9,18,0.96))`
          : 'rgba(10,12,22,0.82)',
        border: `1px solid ${hovered ? project.accent + '45' : 'rgba(100,120,255,0.1)'}`,
        borderRadius: '22px', padding: '26px',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '22px',
        backdropFilter: 'blur(8px)',
        boxShadow: hovered
          ? `0 24px 64px ${project.accent}16, 0 0 0 1px ${project.accent}12`
          : '0 4px 24px rgba(0,0,0,0.3)',
        transition: 'background 0.4s ease, border-color 0.35s ease, box-shadow 0.35s ease',
      }}
    >
      <div style={{ perspective: '900px' }}>
        <MacBrowserFrame
          preview={project.preview}
          screenshots={project.screenshots}
          previewVideo={project.previewVideo}
          accent={project.accent}
          title={project.title}
          isHovered={hovered}
          inView={cardInView}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem', color: project.accent, letterSpacing: '0.14em', textTransform: 'uppercase', background: `${project.accent}14`, padding: '3px 9px', borderRadius: '100px', border: `1px solid ${project.accent}28` }}>
              {project.category}
            </span>
            {project.badge && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: bColor, background: `${bColor}12`, border: `1px solid ${bColor}30`, padding: '3px 9px', borderRadius: '100px', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: bColor, boxShadow: `0 0 6px ${bColor}`, display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                {project.badge}
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem', color: 'var(--text-dim)' }}>{project.year}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {project.audioSrc && <span title="Voice intro available" style={{ fontSize: '0.8rem', opacity: 0.55 }}>🎙️</span>}
            {project.live && !project.internal && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{ color: 'var(--text-dim)', transition: 'color 0.2s', display: 'flex' }}
                onMouseEnter={e => (e.currentTarget.style.color = project.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                aria-label="Live site">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{ color: 'var(--text-dim)', transition: 'color 0.2s', display: 'flex' }}
                onMouseEnter={e => (e.currentTarget.style.color = project.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                aria-label="GitHub repo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 700, color: 'var(--text)', marginBottom: '6px', lineHeight: 1.15 }}>
          {project.title}
        </h3>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: project.accent, marginBottom: '10px', letterSpacing: '0.02em', opacity: 0.85 }}>
          {project.tagline}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {project.tech.slice(0, 5).map(t => (
            <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(100,120,255,0.12)', borderRadius: '5px', padding: '3px 8px', letterSpacing: '0.04em' }}>{t}</span>
          ))}
          {project.tech.length > 5 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-dim)', padding: '3px 4px' }}>+{project.tech.length - 5}</span>
          )}
        </div>
      </div>

      <motion.div
        animate={{ scaleX: hovered ? 1 : 0.25, opacity: hovered ? 1 : 0.35 }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${project.accent}, ${project.accent}30)`, borderRadius: '0 0 22px 22px', transformOrigin: 'left' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18 }}
            style={{ position: 'absolute', bottom: '16px', right: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: project.accent, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Explore
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Voice Player ────────────────────────────────── */
function VoicePlayer({ audioSrc, accent }: { audioSrc: string; accent: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasError, setHasError] = useState(false)

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play().catch(() => setHasError(true)); setPlaying(true) }
  }
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  if (hasError) return (
    <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span>🎙️</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--text-dim)' }}>
        Add voice file at <code style={{ color: accent }}>{audioSrc}</code>
      </span>
    </div>
  )

  return (
    <div style={{ background: `${accent}10`, border: `1px solid ${accent}25`, borderRadius: '14px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <audio ref={audioRef} src={audioSrc}
        onTimeUpdate={() => { if (audioRef.current) setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0) }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => { setPlaying(false); setProgress(0) }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <motion.button onClick={toggle} whileTap={{ scale: 0.9 }} aria-label={playing ? 'Pause' : 'Play'}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, ${accent}99)`, border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 20px ${accent}35` }}>
          {playing
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}><path d="M5 3l14 9-14 9z"/></svg>}
        </motion.button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: accent, letterSpacing: '0.1em' }}>🎙️ VOICE INTRO</span>
            {playing && <div className="audio-bar" aria-hidden="true">{[...Array(4)].map((_, i) => <span key={i} style={{ background: accent }} />)}</div>}
          </div>
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', cursor: 'pointer' }}
            onClick={e => { if (!audioRef.current) return; const r = e.currentTarget.getBoundingClientRect(); audioRef.current.currentTime = ((e.clientX - r.left) / r.width) * audioRef.current.duration }}>
            <div style={{ height: '100%', borderRadius: '2px', background: accent, width: `${progress}%`, transition: 'width 0.1s linear' }} />
          </div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', flexShrink: 0 }}>{duration ? fmt(duration) : '--:--'}</span>
      </div>
    </div>
  )
}

/* ─── Project Modal ───────────────────────────────── */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      // FIX: Reduced blur from 18px → 6px — this is the single biggest perf win
      // backdrop-filter blur is GPU-composited but still expensive at high values
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(3,4,12,0.88)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
        // FIX: Promote overlay to its own composite layer
        willChange: 'opacity',
      }}
      role="dialog" aria-modal="true" aria-label={`Project: ${project.title}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        // FIX: Faster, simpler easing — less work for the main thread on open
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(10,12,22,0.98)',
          border: `1px solid ${project.accent}28`,
          borderRadius: '26px',
          maxWidth: '740px', width: '100%', maxHeight: '90vh',
          overflowY: 'auto', position: 'relative',
          // FIX: Replaced `0 0 100px` spread with cheaper multi-layer shadow
          boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${project.accent}15`,
          // FIX: GPU-promote the modal panel itself
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
        }}
      >
        {/* Mac preview — eager=true disables all motion inside */}
        <div style={{ padding: '28px 28px 0', background: `linear-gradient(180deg, ${project.accent}07 0%, transparent 100%)`, borderRadius: '26px 26px 0 0' }}>
          <MacBrowserFrame
            preview={project.preview}
            screenshots={project.screenshots}
            previewVideo={project.previewVideo}
            accent={project.accent}
            title={project.title}
            isHovered={true}
            eager={true}
          />
        </div>

        {/* Content */}
        <div style={{ padding: 'clamp(22px, 4vw, 38px)' }}>
          <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
            aria-label="Close" style={{ position: 'absolute', top: '18px', right: '18px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </motion.button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: project.accent, background: `${project.accent}14`, padding: '4px 12px', borderRadius: '100px', border: `1px solid ${project.accent}28` }}>
              {project.category}
            </span>
            {project.badge && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#06d6a0', background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.25)', padding: '4px 12px', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#06d6a0', boxShadow: '0 0 6px #06d6a0', display: 'inline-block' }} />
                {project.badge}
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)' }}>{project.year}</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.3rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '6px', lineHeight: 1.1 }}>
            {project.title}
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: project.accent, marginBottom: '16px', opacity: 0.85 }}>
            {project.tagline}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.93rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '24px' }}>
            {project.longDescription}
          </p>

          {/* Highlights — FIX: removed per-item motion stagger, use CSS animation instead */}
          {project.highlights && (
            <div style={{ marginBottom: '26px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
                What I Built
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {project.highlights.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5,
                      padding: '10px 14px',
                      background: `${project.accent}07`, border: `1px solid ${project.accent}18`,
                      borderRadius: '10px', borderLeft: `3px solid ${project.accent}60`,
                      // FIX: CSS animation instead of Framer stagger — much cheaper
                      opacity: 0,
                      animation: `fadeSlideIn 0.3s ease forwards`,
                      animationDelay: `${i * 0.04}s`,
                    }}
                  >
                    {h}
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.audioSrc && (
            <div style={{ marginBottom: '26px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>Hear about this project</p>
              <VoicePlayer audioSrc={project.audioSrc} accent={project.accent} />
            </div>
          )}

          <div style={{ marginBottom: '26px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>Tech Stack</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.tech.map(t => (
                <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: project.accent, background: `${project.accent}10`, border: `1px solid ${project.accent}28`, borderRadius: '8px', padding: '5px 12px' }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {project.github && (
              <motion.a href={project.github} target="_blank" rel="noopener noreferrer"
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 22px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 500 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                View Code
              </motion.a>
            )}
            {project.live && (
              <motion.a href={project.live} target="_blank" rel="noopener noreferrer"
                whileHover={{ y: -2, boxShadow: `0 0 28px ${project.accent}35` }} whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 22px', borderRadius: '10px', background: `linear-gradient(135deg, ${project.accent}, ${project.accent}bb)`, border: 'none', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, transition: 'box-shadow 0.3s ease' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {project.internal ? 'Visit Site' : 'Live Demo'}
              </motion.a>
            )}
            {project.internal && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 18px', borderRadius: '10px', background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.18)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#06d6a0' }}>
                🔒 Internal tools demo on request
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main ────────────────────────────────────────── */
export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '64px' }}
        >
          <p className="section-label">Featured Work</p>
          <h2 id="projects-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 }}>
            Projects I've{' '}
            <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent3))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Shipped
            </span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', marginTop: '12px', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Two production projects — one enterprise client build, one personal full-stack app.
            <br />Hover to preview · click to dive deeper · 🎙️ voice intro inside.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))',
          gap: '32px',
          perspective: '1400px',
        }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} index={i} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <style>{`
        @keyframes pulse-dot {
          0%,100% { box-shadow: 0 0 4px currentColor; }
          50%      { box-shadow: 0 0 10px currentColor; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes shimmerSlide {
          from { transform: translateX(-100%); opacity: 1; }
          to   { transform: translateX(200%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}