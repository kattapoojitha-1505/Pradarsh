import { Link } from 'react-router-dom'
import { Pencil, Calendar, ArrowRight, FolderKanban } from 'lucide-react'
import { motion } from 'framer-motion'
import ProjectActions from './ProjectActions'
import { formatDate, truncateText, getAvatarInitials, stringToColor } from '../../utils/helpers'

function ProjectRow({ project, onDeleted, index }) {
  const {
    id, title, description, category,
    thumbnail_url, status, created_at,
  } = project

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="group flex flex-col sm:flex-row items-start sm:items-center gap-4
        p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.01)]
        hover:shadow-[0_12px_30px_rgba(139,92,246,0.04)] hover:border-primary-100/40 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-100 via-primary-50 to-pink-50
            flex items-center justify-center">
            <span className="text-2xl font-black text-gradient opacity-20">
              {title?.[0]?.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/project/${id}`}
            className="font-bold text-gray-950 hover:text-primary-600 transition-colors truncate text-base leading-snug"
          >
            {title}
          </Link>
          {/* Status badge */}
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
            status === 'published'
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50'
              : 'bg-amber-50 text-amber-600 border-amber-100/50'
          }`}>
            {status}
          </span>
        </div>

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 max-w-xl">
          {truncateText(description, 100)}
        </p>

        <div className="flex flex-wrap items-center gap-3.5 text-[11px] text-gray-400 font-semibold">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400/80" /> {formatDate(created_at)}
          </span>
          {category && (
            <span className="px-2 py-0.5 rounded-full bg-primary-50/70 border border-primary-100/20 text-primary-600 font-semibold">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-center bg-gray-50/50 p-1.5 rounded-xl border border-gray-100/50 sm:bg-transparent sm:border-transparent sm:p-0">
        <Link
          to={`/edit/${id}`}
          title="Edit project"
          className="p-2 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50/50
            border border-transparent hover:border-primary-100/20 transition-all duration-200"
        >
          <Pencil className="w-4 h-4" />
        </Link>
        <ProjectActions
          projectId={id}
          projectTitle={title}
          onDeleted={onDeleted}
        />
      </div>
    </motion.div>
  )
}

export default function MyProjects({ projects, onDeleted, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100/50 relative overflow-hidden">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            <div className="w-full sm:w-28 h-20 bg-gray-100 rounded-xl flex-shrink-0 animate-pulse" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4.5 bg-gray-100 rounded-lg w-1/3 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded-lg w-5/6 animate-pulse" />
              <div className="h-3.5 bg-gray-100 rounded-lg w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 px-6 bg-white/60 backdrop-blur-md rounded-3xl border border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.01)] max-w-md mx-auto my-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-50 flex items-center justify-center mx-auto mb-5 shadow-inner border border-white/40">
          <FolderKanban className="w-7 h-7 text-primary-500" />
        </div>
        <h3 className="text-xl font-extrabold text-gray-955 mb-1 tracking-tight-premium">No projects yet</h3>
        <p className="text-gray-400 text-xs font-semibold mb-6 max-w-xs mx-auto leading-relaxed">
          Create, list, and showcase your developer portfolio and projects to the world.
        </p>
        <Link to="/publish" className="btn-primary inline-flex items-center gap-1.5 shadow-md">
          Publish Your First Project
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <ProjectRow
          key={project.id}
          project={project}
          onDeleted={onDeleted}
          index={index}
        />
      ))}
    </div>
  )
}