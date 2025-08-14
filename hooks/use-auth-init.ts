import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useProfile } from '@/hooks/use-auth-api'
import { apiClient } from '@/services'

/**
 * Hook to initialize authentication state and handle redirects
 * Should be used at the app root level
 */
export const useAuthInit = () => {
  const { token, refreshToken, user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  // Initialize API client with stored tokens
  useEffect(() => {
    if (token) {
      apiClient.initializeTokens(token, refreshToken)
    }
  }, [token, refreshToken])

  // Fetch profile if we have a token but no user data
  const { 
    data: profileData, 
    error: profileError, 
    isLoading: profileLoading 
  } = useProfile()

  // Update user data when profile is fetched
  useEffect(() => {
    if (profileData && !user) {
      useAuthStore.getState().setUser(profileData)
    }
  }, [profileData, user])

  // Handle profile fetch errors (token might be invalid)
  useEffect(() => {
    if (profileError && token && !profileLoading) {
      console.error('Failed to load profile after token refresh:', profileError)
      logout()
    }
  }, [profileError, token, logout, profileLoading])

  // Handle automatic redirects with better logic to prevent infinite loops
  useEffect(() => {
    // Don't redirect if we're still loading profile data
    if (profileLoading) return;

    const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/signup') || pathname === '/'
    const isProtectedRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/settings') || pathname?.startsWith('/users') || pathname?.startsWith('/analytics') || pathname?.startsWith('/transactions') || pathname?.startsWith('/store')

    // Only redirect if we're confident about the auth state
    const hasValidTokens = !!(token && user);
    const shouldBeAuthenticated = isAuthenticated && hasValidTokens;

    console.log('Redirect check:', {
      pathname,
      isAuthenticated,
      hasValidTokens,
      shouldBeAuthenticated,
      profileLoading,
      isAuthRoute,
      isProtectedRoute
    });

    // Case 1: User is authenticated and on auth pages -> redirect to dashboard
    if (shouldBeAuthenticated && isAuthRoute) {
      console.log('Redirecting authenticated user to dashboard');
      router.push('/dashboard');
    }

    // Case 2: User is not authenticated and on protected pages -> redirect to login
    if (!shouldBeAuthenticated && isProtectedRoute) {
      console.log('Redirecting unauthenticated user to login');
      router.push('/login');
    }
  }, [isAuthenticated, user, token, pathname, router, profileLoading])

  return {
    isAuthenticated,
    user,
    isLoading: profileLoading,
    hasInitialized: !!token || !profileLoading
  }
}
