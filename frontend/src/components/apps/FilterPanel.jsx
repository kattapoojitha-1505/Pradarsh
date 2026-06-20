import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import { CATEGORIES, POPULAR_TECHNOLOGIES } from '../../utils/constants'

export default function FilterPanel({ selectedCategory, selectedTechs, onCategoryChange, onTechsChange }) {
  const [techDropdownOpen, setTechDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTechDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleTech = (tech) => {
    const current = selectedTechs || []
    const updated = current.includes(tech)
      ? current.filter((t) => t !== tech)
      : [...current, tech]
    onTechsChange(updated)
  }

  const removeTech = (tech) => {
    onTechsChange((selectedTechs || []).filter((t) => t !== tech))
  }

  return (
    <div className="space-y-3">
      {/* Category chips */}
      <div className="flex flex-wrap gap-x-4 gap-y-3">
        {/* All */}
        <button
          onClick={() => onCategoryChange('')}
          className={`px-[22px] py-[11px] rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 ease-out ${
            !selectedCategory
              ? 'bg-gradient-to-r from-primary-600 to-accent-500 border-transparent text-white shadow-[0_4px_12px_rgba(139,92,246,0.15)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(139,92,246,0.25)]'
              : 'bg-white border-gray-200 text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(139,92,246,0.15)]'
          }`}
        >
          All
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(selectedCategory === cat ? '' : cat)}
            className={`px-[22px] py-[11px] rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 ease-out ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-primary-600 to-accent-500 border-transparent text-white shadow-[0_4px_12px_rgba(139,92,246,0.15)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(139,92,246,0.25)]'
                : 'bg-white border-gray-200 text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(139,92,246,0.15)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Technology filter dropdown */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setTechDropdownOpen(!techDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium
              border border-gray-200 bg-white text-gray-600 hover:border-primary-300
              hover:text-primary-600 transition-all duration-150"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Technologies
            {selectedTechs?.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full font-bold">
                {selectedTechs.length}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${techDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {techDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-card-hover border border-gray-100 z-30 p-3">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Popular Technologies</p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {POPULAR_TECHNOLOGIES.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      (selectedTechs || []).includes(tech)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active tech chips */}
        {(selectedTechs || []).map((tech) => (
          <span
            key={tech}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
              bg-primary-100 text-primary-700"
          >
            {tech}
            <button
              onClick={() => removeTech(tech)}
              className="hover:text-primary-900 ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Clear all filters */}
        {((selectedTechs?.length > 0) || selectedCategory) && (
          <button
            onClick={() => { onCategoryChange(''); onTechsChange([]) }}
            className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
