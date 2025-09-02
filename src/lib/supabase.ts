import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  date_of_birth: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  recovery_start_date: string | null
  preferred_language: string
  timezone: string
  created_at: string
  updated_at: string
}

export interface RiskAssessment {
  id: string
  user_id: string
  years_of_use: number
  substance_type: string
  frequency: string
  stress_level: number
  sleep_quality: number
  support_system: string
  last_relapse: string
  risk_score: number
  recommendations: any
  created_at: string
}

export interface Appointment {
  id: string
  user_id: string
  provider_type: string
  provider_name: string | null
  appointment_date: string
  duration_minutes: number
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DailyCheckIn {
  id: string
  user_id: string
  check_in_date: string
  mood_score: number
  stress_level: number
  sleep_hours: number
  exercise_minutes: number
  craving_intensity: number
  notes: string | null
  triggers: any
  coping_strategies: any
  created_at: string
}

export interface ConsentForm {
  id: string
  user_id: string
  form_type: string
  contact_name: string
  contact_email: string | null
  contact_phone: string | null
  relationship: string | null
  signed_at: string | null
  signature_data: string | null
  status: string
  created_at: string
}

export interface ChatMessage {
  id: string
  user_id: string
  message: string
  is_user_message: boolean
  ai_response: string | null
  sentiment_score: number | null
  created_at: string
}