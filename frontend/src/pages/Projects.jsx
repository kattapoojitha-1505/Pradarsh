import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import SearchBar from '../components/apps/SearchBar'
import FilterPanel from '../components/apps/FilterPanel'
import ProjectGrid from '../components/apps/ProjectGrid'
import projectService from '../services/projectService'
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { ITEMS_PER_PAGE } from '../utils/constants'

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams()

  // State — driven by URL search params for shareable links
  const [query, setQuery]         = useState(searchParams.get('q') || '')
  const [category, setCategory]   = useState(searchParams.get('category') || '')
  const [techs, setTechs]         = useState(
    searchParams.getAll('technologies') || []
  )
  const [page, setPage]           = useState(Number(searchParams.get('page')) || 1)

  const [projects, setProjects]   = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

  // Fetch projects whenever filters change
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
      }
      if (query) params.q = query
      if (category) params.category = category
      // Note: We omit passing technologies to the backend to avoid the SQL type operator error (42883)
      // on the text[] column, and handle strict technology filtering client-side.

      const result = await projectService.searchProjects(params)
      const fetchedProjects = result.data || []
      setProjects(fetchedProjects)

      if (techs.length > 0) {
        const filtered = fetchedProjects.filter((project) => {
          const projectTechs = project.technologies || project.techStack || []
          return techs.every((tech) =>
            projectTechs.some((t) => t.toLowerCase() === tech.toLowerCase())
          )
        })
        setTotal(filtered.length)
      } else {
        setTotal(result.pagination?.total || 0)
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err)
      setProjects([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [query, category, techs, page])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // Sync state changes back to URL
  useEffect(() => {
    const params = {}
    if (query) params.q = query
    if (category) params.category = category
    techs.forEach((t) => {
      params.technologies = params.technologies ? [...params.technologies, t] : [t]
    })
    if (page > 1) params.page = page
    setSearchParams(params, { replace: true })
  }, [query, category, techs, page])

  const handleQueryChange = (val) => {
    setQuery(val)
    setPage(1)
  }

  const handleCategoryChange = (val) => {
    setCategory(val)
    setPage(1)
  }

  const handleTechsChange = (val) => {
    setTechs(val)
    setPage(1)
  }

  // Strict client-side technology filtering
  const filteredProjects = projects.filter((project) => {
    if (techs && techs.length > 0) {
      const projectTechs = project.technologies || project.techStack || []
      const hasAllTechs = techs.every((tech) =>
        projectTechs.some((t) => t.toLowerCase() === tech.toLowerCase())
      )
      if (!hasAllTechs) return false
    }
    return true
  })

  // Console validation during development
  useEffect(() => {
    console.log(
      'Selected Filters:',
      { category, technologies: techs, query },
      'Matched Count:',
      filteredProjects.length
    )
  }, [category, techs, query, filteredProjects.length])

  const getLetterDelay = (lineIndex, letterIndex) => {
    const lineDelays = [0.15, 0.75]
    return lineDelays[lineIndex] + letterIndex * 0.05
  }

  const renderLetters = (text, lineIndex) => {
    const isGradientLine = lineIndex === 1
    return Array.from(text).map((char, charIdx) => {
      const displayChar = char === ' ' ? '\u00A0' : char
      const style = isGradientLine ? {
        backgroundImage: 'linear-gradient(to right, #7C3AED, #8B5CF6, #EC4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundSize: `${text.length * 100}% 100%`,
        backgroundPosition: `${(charIdx / (text.length - 1 || 1)) * 100}% 0`,
      } : {}

      return (
        <motion.span
          key={charIdx}
          initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FD]">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full"
      >

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-990 leading-tight tracking-tight-premium">
            <span className="inline-block">
              {renderLetters("Explore", 0)}
            </span>
            {'\u00A0'}
            <span className="inline-block bg-gradient-to-r from-violet-600 via-primary-500 to-accent-500 bg-clip-text text-transparent pb-0.5">
              {renderLetters("developer projects", 1)}
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-semibold">
            Search across projects, developers and technologies.{' '}
            {!loading && total > 0 && (
              <span className="font-bold text-gray-700">{total} projects and counting.</span>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="mb-5">
          <SearchBar value={query} onChange={handleQueryChange} />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterPanel
            selectedCategory={category}
            selectedTechs={techs}
            onCategoryChange={handleCategoryChange}
            onTechsChange={handleTechsChange}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <ProjectGrid projects={[]} loading={true} />
        ) : filteredProjects.length > 0 ? (
          <ProjectGrid projects={filteredProjects} loading={false} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/60 backdrop-blur-md rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] max-w-xl mx-auto mt-6">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center mb-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)]">
              <SlidersHorizontal className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No projects match your selected filters.</h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6">
              Try adjusting your category or technology selections.
            </p>
            <button
              onClick={() => {
                setCategory('')
                setTechs([])
                setQuery('')
                setPage(1)
              }}
              className="px-6 py-3 rounded-full text-[10px] font-extrabold uppercase tracking-wider
                bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-[0_4px_12px_rgba(139,92,246,0.18)]
                hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(139,92,246,0.3)] transition-all duration-300 ease-out"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50
                disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                    page === pageNum
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50
                disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.main>

      <Footer />
    </div>
  )
}
