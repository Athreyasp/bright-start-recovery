import { createContext, useContext, useEffect, useState } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react'
import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import { useToast } from '@/hooks/use-toast'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: any // Clerk user object
  profile: Profile | null
  session: any
  loading: boolean
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  supabaseUserId: string | null // The UUID we use for Supabase operations
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Function to generate a consistent UUID from Clerk user ID
const generateSupabaseUserId = (clerkUserId: string): string => {
  // Create a consistent UUID by hashing the Clerk user ID
  // This ensures the same Clerk user always gets the same UUID
  const encoder = new TextEncoder()
  const data = encoder.encode(clerkUserId)
  
  // Simple hash to create UUID-like string
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data[i]
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Convert to UUID format
  const hex = Math.abs(hash).toString(16).padStart(8, '0')
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-a${hex.slice(0, 3)}-${hex.slice(0, 12).padStart(12, '0')}`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerkAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isLoaded && user) {
      // Generate consistent UUID for this Clerk user
      const generatedUserId = generateSupabaseUserId(user.id)
      setSupabaseUserId(generatedUserId)
      
      // Fetch or create profile
      fetchOrCreateProfile(generatedUserId, user)
    } else if (isLoaded && !user) {
      setProfile(null)
      setSupabaseUserId(null)
    }
  }, [user, isLoaded])

  const fetchOrCreateProfile = async (userId: string, clerkUser: any) => {
    try {
      // Try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError)
        return
      }

      if (existingProfile) {
        setProfile(existingProfile)
      } else {
        // Create new profile for this user
        const newProfile = {
          user_id: userId,
          full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.primaryEmailAddress?.emailAddress || 'User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
          toast({
            title: "Profile Creation Error",
            description: "Failed to create user profile. Please try again.",
            variant: "destructive"
          })
        } else {
          setProfile(createdProfile)
          toast({
            title: "Welcome to QuitBuddy!",
            description: "Your profile has been created successfully.",
          })
        }
      }
    } catch (error) {
      console.error('Error in fetchOrCreateProfile:', error)
    }
  }

  const signOut = async () => {
    await clerkSignOut()
    setProfile(null)
    setSupabaseUserId(null)
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    })
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!supabaseUserId) {
      return { error: new Error('No user ID available') }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', supabaseUserId)

      if (error) {
        toast({
          title: "Update Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive"
        })
        return { error }
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates } : null)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      return { error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error }
    }
  }

  const value = {
    user,
    profile,
    session: user ? { user } : null,
    loading: !isLoaded,
    signOut,
    updateProfile,
    supabaseUserId
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}