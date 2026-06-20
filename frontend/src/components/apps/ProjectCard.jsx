import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { getAvatarInitials, truncateText, stringToColor } from '../../utils/helpers'

const MotionLink = motion(Link)

export default function ProjectCard({ project }) {
  const {
    id,
    title,
    description,
    category,
    technologies = [],
    thumbnail_url,
    author_name,
    author_username,
    author_avatar,
  } = project

  const initials = getAvatarInitials(author_name)
  const avatarGradient = stringToColor(author_name)
  const techsToShow = technologies.slice(0, 3)
  const extraTechs = technologies.length - 3

  return (
    <MotionLink
      to={`/project/${id}`}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="group block bg-white/85 backdrop-blur-md rounded-3xl border border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.06)] hover:border-primary-100/50 transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-50/50">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-100 via-primary-50 to-pink-50 flex items-center justify-center">
            <span className="text-4xl font-extrabold text-gradient opacity-20">
              {title?.[0]?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Category badge — top left */}
        {category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider
            bg-white/80 backdrop-blur-md text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-white/20">
            {category}
          </span>
        )}

        {/* Arrow link — top right (always visible, changes background on hover) */}
        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm
          flex items-center justify-center shadow-sm text-gray-700 group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-accent-500 group-hover:text-white transition-all duration-300">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title & description */}
        <div className="space-y-1">
          <h3 className="font-extrabold text-gray-950 text-base leading-snug group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
            {truncateText(description, 100)}
          </p>
        </div>

        {/* Tech tags */}
        {techsToShow.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {techsToShow.map((tech) => (
              <span key={tech} className="tech-tag text-[10px]">
                {tech}
              </span>
            ))}
            {extraTechs > 0 && (
              <span className="tech-tag text-[10px]">+{extraTechs}</span>
            )}
          </div>
        )}

        {/* Author row */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100/50 mt-auto">
          {author_avatar ? (
            <img
              src={author_avatar}
              alt={author_name}
              className="w-5.5 h-5.5 rounded-full object-cover ring-2 ring-gray-100/50"
            />
          ) : (
            <div className={`w-5.5 h-5.5 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center shadow-sm`}>
              <span className="text-white text-[8px] font-bold">{initials}</span>
            </div>
          )}
          <span className="text-[11px] text-gray-750 font-bold truncate">
            {author_name || 'Unknown Developer'}
          </span>
          <span className="text-[10px] text-primary-500 font-extrabold uppercase tracking-wider flex items-center gap-0.5 ml-auto group-hover:text-primary-600 transition-colors">
            View project &rarr;
          </span>
        </div>
      </div>
    </MotionLink>
  )
}
