export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const CATEGORIES = [
  'Web Development',
  'Mobile Apps',
  'AI & Machine Learning',
  'Generative AI',
  'SaaS Products',
  'Portfolio',
  'Open Source',
  'Cyber Security',
  'Cloud Computing',
  'Dev Tools',
]

export const POPULAR_TECHNOLOGIES = [
  'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js',
  'Node.js', 'Express', 'FastAPI', 'Django', 'Flask',
  'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Supabase', 'Firebase',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'TailwindCSS', 'GraphQL', 'Redis', 'Unity', 'Flutter',
  'React Native', 'Swift', 'Kotlin', 'OpenAI', 'LangChain',
  'TensorFlow', 'PyTorch', 'Stripe', 'Vercel', 'Netlify',
]

export const PROJECT_STATUSES = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
}

export const ITEMS_PER_PAGE = 12
