import { createContext, useContext } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react'

interface AuthContextType {
  user: any
  profile: any
  session: any
  loading: boolean
  signOut: () => Promise<void>
  updateProfile: (updates: any) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerkAuth()

  const signOut = async () => {
    await clerkSignOut()
  }

  const updateProfile = async (updates: any) => {
    try {
      if (user) {
        const updateData: any = {}
        if (updates.full_name) {
          updateData.firstName = updates.full_name?.split(' ')[0]
          updateData.lastName = updates.full_name?.split(' ').slice(1).join(' ')
        }
        // Note: Phone number updates require separate API call to Clerk
        await user.update(updateData)
      }
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  // Create a profile object from Clerk user data
  const profile = user ? {
    full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    phone: user.primaryPhoneNumber?.phoneNumber || '',
    email: user.primaryEmailAddress?.emailAddress || '',
    date_of_birth: null,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    recovery_start_date: null,
  } : null

  const value = {
    user,
    profile,
    session: user ? { user } : null,
    loading: !isLoaded,
    signOut,
    updateProfile
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