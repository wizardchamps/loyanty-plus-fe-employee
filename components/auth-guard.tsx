"use client"
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { apiClient } from '@/services/api-client'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token, refreshToken, user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Initialize API client with tokens
    if (token) {
      apiClient.initializeTokens(token, refreshToken)
    }

    // Define route types
    const publicRoutes = ['/login', '/signup']
    const protectedRoutes = ['/dashboard', '/settings', '/users', '/analytics', '/transactions', '/store']

    const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route))
    const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route))

    // Determine auth status more reliably
    const hasValidAuth = !!(token && user && isAuthenticated)

    console.log('AuthGuard check:', {
      pathname,
      hasValidAuth,
      isPublicRoute,
      isProtectedRoute,
      token: !!token,
      user: !!user,
      isAuthenticated
    })

    // Auth logic
    if (!hasValidAuth && isProtectedRoute) {
      // User is not authenticated but trying to access protected route
      console.log('Redirecting to login - not authenticated')
      router.replace('/login')
    } else if (hasValidAuth && isPublicRoute) {
      // User is authenticated but trying to access public route (login/signup)
      console.log('Redirecting to dashboard - already authenticated')
      router.replace('/dashboard')
    }

    setIsCheckingAuth(false)
  }, [token, refreshToken, user, isAuthenticated, pathname, router])

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <>{children}</>
}
