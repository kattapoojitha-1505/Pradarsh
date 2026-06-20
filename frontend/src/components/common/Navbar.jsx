import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../../hooks/useAuth'

// --- IMPORT THE JPEG LOGO ---
// We go up two levels (../..) to get to 'src', then into 'assets'
import logoImg from '../../assets/logo.jpeg'
// -----------------------------

export default function Navbar() {
  const { isAuthenticated, profile, user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setDropdownOpen(false)
    navigate('/')
  }

  // Avatar initials fallback
  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarUrl = profile?.avatar_url

  const navLinkClass = ({ isActive }) =>
    `relative px-5 py-2 text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${isActive ? 'text-primary-600 bg-primary-50/70 border border-primary-100/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    }`

  const NavItem = ({ to, children, end = false }) => (
    <NavLink to={to} end={end} className={navLinkClass}>
      {({ isActive }) => (
        <>
          <span className="relative z-10">{children}</span>
          {isActive && (
            <motion.span
              layoutId="activeNavIndicator"
              className="absolute inset-0 bg-primary-50/70 border border-primary-100/20 rounded-full"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  )

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-100/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">

            {/* --- Jpeg Logo Image --- */}
            <img
              src={logoImg}
              alt="Pradarsh Logo"
              // Fixed square box so the logo can never push into the nav links
              className="h-9 w-9 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]"
            />
            {/* ---------------------- */}
            {/* Updated Logo/Brand Name */}
            <Link to="/" className="flex flex-col">
              <span className="text-xl font-bold text-primary-600 leading-tight">
                Pradarsh
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                Where Talent meets Visibility
              </span>
            </Link>
          </Link>

          {/* Desktop nav links — centered */}
          <div className="hidden md:flex items-center gap-1.5">
            <NavItem to="/" end>Home</NavItem>
            <NavItem to="/explore">Explore</NavItem>
            <NavItem to="/publish">Publish</NavItem>
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              /* Avatar dropdown */
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-200"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-primary-100"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">{getInitials(displayName)}</span>
                    </div>
                  )}
                  <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      {/* Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100/80 py-1.5 z-20 overflow-hidden"
                      >
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50/50 hover:text-primary-600 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary-500" />
                          Dashboard
                        </Link>
                        {profile?.username && (
                          <Link
                            to={`/developer/${profile.username}`}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50/50 hover:text-primary-600 transition-colors"
                          >
                            <User className="w-4 h-4 text-primary-500" />
                            My Profile
                          </Link>
                        )}
                        <div className="border-t border-gray-100/50 my-1" />
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary px-5 py-2"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
              <NavLink to="/explore" className={mobileNavLinkClass} onClick={() => setMobileOpen(false)}>Explore</NavLink>
              <NavLink to="/publish" className={mobileNavLinkClass} onClick={() => setMobileOpen(false)}>Publish</NavLink>

              <div className="border-t border-gray-100 pt-4 mt-3">
                {isAuthenticated ? (
                  <div className="space-y-1.5">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 rounded-xl hover:bg-gray-50"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary-500" /> Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 rounded-xl hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-accent-500"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}