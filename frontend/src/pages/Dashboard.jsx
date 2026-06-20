import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, BarChart3, Globe, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import MyProjects from '../components/dashboard/MyProjects'
import projectService from '../services/projectService'
import useAuth from '../hooks/useAuth'
import { getAvatarInitials, stringToColor } from '../utils/helpers'

export default function Dashboard() {
  const { user, profile } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyProjects = async () => {
      setLoading(true)
      try {
        const data = await projectService.getMyProjects()
        setProjects(data || [])
      } catch (err) {
        console.error("Failed to fetch projects:", err)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchMyProjects()
  }, [])

  const handleDeleted = (deletedId) => {
    setProjects((prev) => prev.filter((p) => p.id !== deletedId))
  }

  // Robust display name logic: 
  // Prioritizes DB profile, then Email, then default
  const displayName = profile?.full_name || user?.displayName || user?.email?.split('@')[0] || 'Developer'
  const initials = getAvatarInitials(displayName)
  const avatarGradient = stringToColor(displayName)

  const publishedCount = projects.filter((p) => p.status === 'published').length
  const draftCount = projects.filter((p) => p.status === 'draft').length

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9FD]">
      <Navbar />

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8"
      >
        {/* Header row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100/60"
        >
          <div className="flex items-center gap-4">
            {/* Avatar now pulls directly from your Supabase profile data */}
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary-100/50 shadow-md"
              />
            ) : (
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center ring-2 ring-primary-100/50 shadow-md`}>
                <span className="text-white font-black text-2xl">{initials}</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Workspace Dashboard</h1>
              <p className="text-gray-400 text-xs font-semibold mt-0.5">
                {displayName} ·{' '}
                <span className="text-primary-600">{publishedCount} published</span>
                {draftCount > 0 && ` · ${draftCount} draft`}
              </p>
            </div>
          </div>

          <Link to="/publish" className="btn-primary self-start sm:self-auto shadow-md">
            <Plus className="w-4 h-4" />
            Publish New Project
          </Link>
        </motion.div>

        {/* Stats strip */}
        {!loading && projects.length > 0 && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Projects', value: projects.length, color: 'text-violet-600', bgColor: 'bg-violet-50/50', icon: BarChart3 },
              { label: 'Published', value: publishedCount, color: 'text-emerald-600', bgColor: 'bg-emerald-50/50', icon: Globe },
              { label: 'Drafts', value: draftCount, color: 'text-amber-600', bgColor: 'bg-amber-50/50', icon: FileText },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/80 p-5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</div>
                    <div className={`text-3xl font-black ${stat.color} tracking-tight`}>{stat.value}</div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <MyProjects projects={projects} loading={loading} onDeleted={handleDeleted} />
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  )
}