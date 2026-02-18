'use client'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import TechStack from '@/components/TechStack'
import Experience from '@/components/Experience'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

const Cursor = dynamic(() => import('@/components/Cursor'), { ssr: false })

export default function Home() {
  return (
    <>
      <Background />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 5, minHeight: '100vh' }}
      >
        <Cursor />
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <TechStack />
        <Experience />
        <Contact />
        <Footer />
      </motion.main>
    </>
  )
}