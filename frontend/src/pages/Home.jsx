import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import FAQ from '../components/home/FAQ'
import Categories from '../components/home/Categories'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FD]">
      <Navbar />

      <main className="flex-1">
        {/* Hero section */}
        <Hero />

        {/* Live stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Stats />
        </motion.div>

        {/* Categories section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          <Categories />
        </motion.div>

        {/* CTA Banner */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.12 }}
          className="py-4 pb-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-cta px-8 py-14 text-center shadow-[0_15px_50px_rgba(139,92,246,0.15)]">
              {/* Decorative blobs */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Sub-label */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider">
                  Start Building
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight-premium">
                  Ready to showcase<br className="hidden sm:block" /> your work?
                </h2>

                <p className="text-white/80 text-base max-w-md mx-auto">
                  Publish your project, build your portfolio, and get discovered
                  by the developer community.
                </p>

                <div className="pt-2">
                  <Link
                    to="/publish"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-gray-900
                      bg-white hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-xl
                      hover:-translate-y-0.5"
                  >
                    Publish Your Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ section Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        >
          <FAQ />
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
