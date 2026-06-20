import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
