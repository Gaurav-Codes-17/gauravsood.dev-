import type { Metadata, Viewport } from 'next'
import { Space_Mono, Syne, Outfit } from 'next/font/google'
import './globals.css'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#04050d',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://gauravsood.dev'),
  title: {
    default: 'Gaurav Sood — Full Stack Developer & React Engineer',
    template: '%s | Gaurav Sood',
  },
  description:
    'Full Stack Developer specializing in React, Next.js, Three.js and Node.js. Building pixel-perfect, performant web experiences at the intersection of engineering and design.',
  keywords: [
    'Gaurav Sood',
    'Full Stack Developer',
    'React Developer',
    'Next.js Engineer',
    'Three.js',
    'WebGL',
    'Node.js',
    'TypeScript',
    'Frontend Developer',
    'Web Developer',
    'Portfolio',
    'UI/UX',
  ],
  authors: [{ name: 'Gaurav Sood', url: 'https://gauravsood.dev' }],
  creator: 'Gaurav Sood',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gauravsood.dev',
    siteName: 'Gaurav Sood Portfolio',
    title: 'Gaurav Sood — Full Stack Developer & React Engineer',
    description:
      'Full Stack Developer specializing in React, Next.js, Three.js and Node.js. Building pixel-perfect, performant web experiences.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Gaurav Sood — Full Stack Developer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaurav Sood — Full Stack Developer',
    description: 'Full Stack Developer specializing in React, Next.js, Three.js and Node.js.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  alternates: { canonical: 'https://gauravsood.dev' },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Gaurav Sood',
  url: 'https://gauravsood.dev',
  sameAs: ['https://github.com/Gaurav-Codes-17/', 'https://www.linkedin.com/in/gaurav-sood-1a345a163/'],
  jobTitle: 'Full Stack Developer',
  knowsAbout: ['React', 'Next.js', 'Three.js', 'Node.js', 'TypeScript', 'WebGL'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${syne.variable} ${outfit.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body>{children}</body>
    </html>
  )
}