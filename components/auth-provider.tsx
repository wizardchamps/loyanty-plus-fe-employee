"use client"
import { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useProfile } from '@/hooks/use-auth-api'
import { apiClient } from '@/services/api-client'
import { User } from '@/types/auth'

interface AuthContextType {
  apiUser: User | null
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  apiUser: null,
  loading: true,
  isAuthenticated: false,
})

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, refreshToken, user, logout, isAuthenticated } = useAuthStore()

  // Initialize API client with tokens
  useEffect(() => {
    if (token) {
      apiClient.initializeTokens(token, refreshToken)
    }
  }, [token, refreshToken])

  // Fetch user profile when authenticated
  const {
    data: apiUser,
    isLoading: loading,
    error,
  } = useProfile()

  // Update store with API user data
  useEffect(() => {
    if (apiUser && (!user || user.id !== apiUser.id)) {
      useAuthStore.getState().setUser(apiUser)
    }
  }, [apiUser, user])

  // Handle profile fetch errors
  useEffect(() => {
    if (error && isAuthenticated) {
      console.error('Profile fetch error:', error)
      // Don't logout immediately on error - let interceptor handle token refresh
      // Only logout if it's definitely an auth issue and not a network problem
      if (error.status === 401 && !refreshToken) {
        logout()
      }
    }
  }, [error, isAuthenticated, refreshToken, logout])

  return (
    <AuthContext.Provider
      value={{
        apiUser: apiUser || user,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
