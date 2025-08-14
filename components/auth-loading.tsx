"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/auth-provider'

interface AuthLoadingProps {
  message?: string
  className?: string
}

export const AuthLoading = ({ 
  message = "Checking authentication...", 
  className = "" 
}: AuthLoadingProps) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen space-y-4 ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  )
}

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const ProtectedRoute = ({
  children,
  fallback = <AuthLoading message="Redirecting to login..." />
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're not loading and user is not authenticated
    if (!loading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return <AuthLoading />
  }

  // If not authenticated, show fallback while redirecting
  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  // User is authenticated, render children
  return <>{children}</>
}
