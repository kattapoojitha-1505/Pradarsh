import { useState, useRef } from 'react'
import { X, Plus, Upload, Loader2 } from 'lucide-react'
import ThumbnailUpload from './ThumbnailUpload'
import uploadService from '../../services/uploadService'
import { CATEGORIES } from '../../utils/constants'
import { isValidUrl, parseTechArray } from '../../utils/helpers'

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  technologies: [],
  demo_url: '',
  thumbnail_url: '',
  screenshots: [],
  status: 'published',
}

export default function ProjectForm({ initialData = {}, onSubmit, submitLabel = 'Publish project', loading = false }) {
  const [form, setForm]           = useState({ ...EMPTY_FORM, ...initialData })
  const [techInput, setTechInput] = useState('')
  const [errors, setErrors]       = useState({})
  const [screenshotUploading, setScreenshotUploading] = useState(false)
  const screenshotRef = useRef(null)

  // ── Field change ─────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((er) => ({ ...er, [name]: '' }))
  }

  // ── Technology chips ──────────────────────────────────────────────────
  const addTech = () => {
    const trimmed = techInput.trim()
    if (!trimmed) return
    const newTechs = parseTechArray(trimmed)
    const unique = [...new Set([...form.technologies, ...newTechs])]
    setForm((f) => ({ ...f, technologies: unique }))
    setTechInput('')
  }

  const removeTech = (tech) => {
    setForm((f) => ({ ...f, technologies: f.technologies.filter((t) => t !== tech) }))
  }

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTech()
    }
  }

  // ── Screenshots ───────────────────────────────────────────────────────
  const handleScreenshots = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const remaining = 10 - form.screenshots.length
    if (remaining <= 0) {
      setErrors((er) => ({ ...er, screenshots: 'Maximum 10 screenshots allowed.' }))
      return
    }

    const toUpload = files.slice(0, remaining)
    setScreenshotUploading(true)
    setErrors((er) => ({ ...er, screenshots: '' }))

    try {
      const result = await uploadService.uploadScreenshots(toUpload)
      setForm((f) => ({ ...f, screenshots: [...f.screenshots, ...result.urls] }))
    } catch (err) {
      setErrors((er) => ({
        ...er,
        screenshots: err.response?.data?.detail || 'Screenshot upload failed.',
      }))
    } finally {
      setScreenshotUploading(false)
      if (screenshotRef.current) screenshotRef.current.value = ''
    }
  }

  const removeScreenshot = (idx) => {
    setForm((f) => ({ ...f, screenshots: f.screenshots.filter((_, i) => i !== idx) }))
  }

  // ── Validation ────────────────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title = 'Project title is required.'
    if (!form.description.trim()) e.description = 'Description is required.'
    if (!form.category)           e.category = 'Please select a category.'
    if (!form.thumbnail_url)      e.thumbnail_url = 'Thumbnail is required.'
    if (form.demo_url   && !isValidUrl(form.demo_url))    e.demo_url   = 'Enter a valid URL.'
    return e
  }

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Scroll to first error
      document.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Project title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Project title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Nebula Analytics"
          className={`input-base ${errors.title ? 'border-red-300 focus:ring-red-400' : ''}`}
        />
        {errors.title && <p className="field-error text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="One or two sentences that hook the reader."
          rows={4}
          className={`input-base resize-none ${errors.description ? 'border-red-300 focus:ring-red-400' : ''}`}
        />
        {errors.description && <p className="field-error text-xs text-red-500 mt-1">{errors.description}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Category <span className="text-red-400">*</span>
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={`input-base ${errors.category ? 'border-red-300 focus:ring-red-400' : ''}`}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="field-error text-xs text-red-500 mt-1">{errors.category}</p>}
      </div>

      {/* Technologies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Technologies
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={handleTechKeyDown}
            placeholder="React, TypeScript, Node.js"
            className="input-base flex-1"
          />
          <button
            type="button"
            onClick={addTech}
            className="px-3 py-2 rounded-xl border border-gray-200 text-gray-600
              hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add. Separate multiple with commas.</p>
        {form.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {form.technologies.map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                  bg-primary-100 text-primary-700"
              >
                {tech}
                <button type="button" onClick={() => removeTech(tech)} className="hover:text-primary-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* URL field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Live Demo URL
        </label>
        <input
          type="url"
          name="demo_url"
          value={form.demo_url}
          onChange={handleChange}
          placeholder="https://your-app.com"
          className={`input-base ${errors.demo_url ? 'border-red-300' : ''}`}
        />
        <p className="text-xs text-gray-400 mt-1">Provide a working deployment link to your project.</p>
        {errors.demo_url && <p className="field-error text-xs text-red-500 mt-1">{errors.demo_url}</p>}
      </div>

      {/* Thumbnail upload */}
      <div>
        <ThumbnailUpload
          value={form.thumbnail_url}
          onChange={(url) => {
            setForm((f) => ({ ...f, thumbnail_url: url }))
            setErrors((er) => ({ ...er, thumbnail_url: '' }))
          }}
        />
        {errors.thumbnail_url && (
          <p className="field-error text-xs text-red-500 mt-1">{errors.thumbnail_url}</p>
        )}
      </div>

      {/* Screenshot gallery */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Screenshot gallery
          <span className="text-gray-400 font-normal ml-1">(optional, max 10)</span>
        </label>

        {/* Existing screenshots */}
        {form.screenshots.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {form.screenshots.map((url, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-gray-100 group">
                <img src={url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeScreenshot(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white
                    flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload area */}
        {form.screenshots.length < 10 && (
          <div
            onClick={() => screenshotRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2
              border-dashed border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-50/30
              cursor-pointer transition-all duration-200 py-8"
          >
            {screenshotUploading ? (
              <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-gray-400" />
            )}
            <p className="text-xs text-gray-500">
              {screenshotUploading ? 'Uploading…' : 'Click to add screenshots'}
            </p>
          </div>
        )}

        <input
          ref={screenshotRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleScreenshots}
          className="hidden"
        />
        {errors.screenshots && <p className="field-error text-xs text-red-500 mt-1">{errors.screenshots}</p>}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
        <div className="flex gap-3">
          {['published', 'draft'].map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={s}
                checked={form.status === s}
                onChange={handleChange}
                className="accent-primary-500"
              />
              <span className="text-sm text-gray-700 capitalize">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || screenshotUploading}
        className="w-full py-3.5 rounded-xl text-white font-semibold text-base
          bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600
          disabled:opacity-60 disabled:cursor-not-allowed shadow-glow hover:shadow-glow-pink
          transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? 'Publishing…' : submitLabel}
      </button>
    </form>
  )
}
