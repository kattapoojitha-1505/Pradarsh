import { createContext, useContext, useEffect, useState } from 'react'
import { auth, syncWithBackend } from '../services/firebase'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)         // Firebase auth user
  const [profile, setProfile] = useState(null)   // Pradarsh profile from backend/Supabase
  const [loading, setLoading] = useState(true)   // Initial auth check loading

  useEffect(() => {
    // Firebase's listener fires once on mount with current state,
    // then again on every login/logout/token refresh.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const result = await syncWithBackend(firebaseUser)
          setProfile(result.user)
        } catch (err) {
          console.error('Failed to sync/fetch profile:', err)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (user) {
      try {
        const result = await syncWithBackend(user)
        setProfile(result.user)
      } catch (err) {
        console.error('Failed to refresh profile:', err)
      }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signOut,
    refreshProfile,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export default AuthContext