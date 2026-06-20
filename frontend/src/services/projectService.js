import api from './api'

const projectService = {
  /**
   * List published projects with pagination.
   */
  async getProjects(page = 1, limit = 12) {
    const response = await api.get('/projects', { params: { page, limit } })
    return response.data
  },

  /**
   * Get a single project by ID.
   */
  async getProjectById(id) {
    const response = await api.get(`/projects/${id}`)
    return response.data.data
  },

  /**
   * Create a new project.
   */
  async createProject(projectData) {
    const response = await api.post('/projects', projectData)
    return response.data.data
  },

  /**
   * Update a project by ID.
   */
  async updateProject(id, projectData) {
    const response = await api.put(`/projects/${id}`, projectData)
    return response.data.data
  },

  /**
   * Delete a project by ID.
   */
  async deleteProject(id) {
    const response = await api.delete(`/projects/${id}`)
    return response.data
  },

  /**
   * Get the current user's own projects.
   */
  async getMyProjects() {
    const response = await api.get('/projects/my')
    return response.data.data
  },

  /**
   * Get published projects for a developer by username.
   */
  async getProjectsByUsername(username) {
    const response = await api.get(`/projects/user/${username}`)
    return response.data.data
  },

  /**
   * Get live platform stats (total projects, developers, categories).
   */
  async getStats() {
    const response = await api.get('/projects/stats')
    return response.data.data
  },

  /**
   * Search and filter projects.
   * @param {Object} params - { q, category, technologies, page, limit }
   */
  async searchProjects(params = {}) {
    const urlParams = new URLSearchParams()
    if (params.page) urlParams.append('page', params.page)
    if (params.limit) urlParams.append('limit', params.limit)
    if (params.q) urlParams.append('q', params.q)
    if (params.category) urlParams.append('category', params.category)
    if (params.technologies && Array.isArray(params.technologies)) {
      params.technologies.forEach((tech) => {
        urlParams.append('technologies', tech)
      })
    }
    const response = await api.get(`/search?${urlParams.toString()}`)
    return response.data
  },
}

export default projectService
