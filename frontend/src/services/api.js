import axios from 'axios'
import { auth } from './firebase'
import { signOut } from 'firebase/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser
    if (currentUser) {
      const idToken = await currentUser.getIdToken()
      config.headers.Authorization = `Bearer ${idToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut(auth)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api