import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Sparkles, Terminal, Laptop } from 'lucide-react'
import { motion } from 'framer-motion'
import BrandCenterpiece from './BrandCenterpiece'
import InteractiveGrid from './InteractiveGrid'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Premium spring-like ease Out (Linear style)
      },
    },
  }

  const floatVariants = (delay = 0, yOffset = 8, duration = 5) => ({
    animate: {
      y: [yOffset, -yOffset, yOffset],
      transition: {
        duration: duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: delay,
      },
    },
  })

  const pulseGlow = {
    animate: {
      opacity: [0.15, 0.3, 0.15],
      scale: [1, 1.05, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const getLetterDelay = (lineIndex, letterIndex) => {
    const lineDelays = [0.15, 0.95, 1.85] // base delay for each line
    return lineDelays[lineIndex] + letterIndex * 0.05
  }

  const renderLetters = (text, lineIndex) => {
    const isGradientLine = lineIndex === 2
    return Array.from(text).map((char, charIdx) => {
      const displayChar = char === ' ' ? '\u00A0' : char
      const style = isGradientLine ? {
        backgroundImage: 'linear-gradient(to right, #8B5CF6, #EC4899, #06B6D4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundSize: `${text.length * 100}% 100%`,
        backgroundPosition: `${(charIdx / (text.length - 1 || 1)) * 100}% 0`,
      } : {}

      return (
        <motion.span
          key={charIdx}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: getLetterDelay(lineIndex, charIdx),
          }}
          className="inline-block"
          style={style}
        >
          {displayChar}
        </motion.span>
      )
    })
  }

  const mockLines = [
    { text: 'const project = {', indent: 0, color: 'text-purple-400' },
    { text: "name: 'Pradarsh',", indent: 2, color: 'text-pink-300' },
    { text: "type: 'developer_showcase',", indent: 2, color: 'text-violet-300' },
    { text: "techStack: ['React', 'Supabase'],", indent: 2, color: 'text-indigo-300' },
    { text: 'published: true', indent: 2, color: 'text-emerald-300' },
    { text: '};', indent: 0, color: 'text-purple-400' },
  ]

  return (
    <section className="relative overflow-hidden bg-[#FAF9FD] pt-16 pb-20 lg:pt-24 lg:pb-28">

      {/* 1. INJECTED INTERACTIVE GRID */}
      <InteractiveGrid />

      {/* Premium Background mesh glows */}
      <motion.div
        variants={pulseGlow}
        animate="animate"
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-violet-200 to-purple-200 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        variants={pulseGlow}
        animate="animate"
        className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-pink-200 to-violet-100 rounded-full blur-[120px] pointer-events-none"
      />

      {/* 2. ADDED z-10 and pointer-events-none to the main wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* Left — text content */}
          {/* 3. ADDED pointer-events-auto so you can click the buttons */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start pointer-events-auto"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-primary-100/50 shadow-[0_4px_12px_rgba(139,92,246,0.03)] text-primary-700 text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary-500 animate-pulse" />
              The launchpad for developer projects
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4.2rem] font-black leading-[1.1] tracking-tight-premium text-[#0F172A] flex flex-col items-center lg:items-start gap-2">
              <span className="block">
                {renderLetters("Showcase.", 0)}
              </span>
              <span className="block">
                {renderLetters("Discover.", 1)}
              </span>
              <span className="block bg-gradient-to-r from-violet-600 via-primary-500 to-cyan-500 bg-clip-text text-transparent pb-1">
                {renderLetters("Get Inspired.", 2)}
              </span>
            </h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-gray-500 text-lg leading-relaxed max-w-lg font-medium"
            >
              Pradarsh is a curated playground for developers to host their creations,
              publish project case studies, and connect with other creators.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 pt-2 w-full sm:w-auto"
            >
              <Link
                to="/explore"
                className="btn-primary text-base px-7 py-3.5 shadow-[0_8px_30px_rgba(139,92,246,0.2)] h-[48px]"
              >
                Explore Projects
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <Link
                to="/register"
                className="btn-outline text-base px-7 py-3.5 h-[48px]"
              >
                Join the Community
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — Premium 3D Brand Centerpiece */}
          {/* 4. ADDED pointer-events-auto so hover animations on BrandCenterpiece work */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[400px] sm:min-h-[500px] lg:min-h-[550px] overflow-visible w-full mt-8 lg:mt-0 pointer-events-auto">
            {/* Soft background radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] bg-gradient-to-tr from-violet-500/10 via-pink-500/5 to-cyan-500/10 rounded-full blur-[70px] sm:blur-[100px] z-0 pointer-events-none" />

            {/* The Brand Centerpiece Container */}
            <div className="relative z-10 flex items-center justify-center w-full h-full max-w-[550px] aspect-square overflow-visible">
              <BrandCenterpiece />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}