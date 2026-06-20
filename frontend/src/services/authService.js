import api from './api'

const authService = {
  /**
   * Get profile from backend API.
   */
  async getMyProfile() {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  /**
   * Update profile via backend API.
   */
  async updateMyProfile(profileData) {
    const response = await api.put('/auth/me', profileData)
    return response.data.data
  },

  /**
   * Get a public developer profile by username.
   */
  async getPublicProfile(username) {
    const response = await api.get(`/auth/profile/${username}`)
    return response.data.data
  },
}

export default authService