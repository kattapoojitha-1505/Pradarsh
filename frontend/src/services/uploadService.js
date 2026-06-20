import { auth } from './firebase'

// Ensure we point to your live Hugging Face backend
const API_URL = import.meta.env.VITE_API_URL || 'https://m-prabhath-pradarsh-api.hf.space'

const uploadService = {
  async uploadThumbnail(file) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')
    const token = await user.getIdToken()

    const formData = new FormData()
    formData.append('file', file) // Matches @router.post("/thumbnail") -> file: UploadFile

    const response = await fetch(`${API_URL}/uploads/thumbnail`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.detail || 'Thumbnail upload failed')
    }

    return await response.json()
  },

  async uploadScreenshots(files) {
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')
    const token = await user.getIdToken()

    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }

    const response = await fetch(`${API_URL}/uploads/screenshots`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.detail || 'Screenshot upload failed')
    }

    const responseJson = await response.json()
    return responseJson.data 
  },
}

export default uploadService