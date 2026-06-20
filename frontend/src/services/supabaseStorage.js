import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Storage-only client. Never call .auth.* on this — Firebase is the only auth system.
export const supabaseStorage = createClient(supabaseUrl, supabaseAnonKey)