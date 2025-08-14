"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/auth-provider'
import { AuthLoading } from '@/components/auth-loading'
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Shield, LogIn } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  fallback = <AuthLoading message="Redirecting to login..." />
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, apiUser } = useAuthContext()
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
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h2 className="text-lg font-semibold">Authentication Required</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  You need to be logged in to access this page.
                </p>
              </div>
              <Button 
                onClick={() => router.push('/login')}
                className="w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check role permissions if required
  if (requiredRoles.length > 0 && apiUser) {
    // Check if user has any of the required roles
    const userRoles = apiUser.roles?.map(role => role.role) || []
    const hasRequiredRole = requiredRoles.some(reqRole => userRoles.includes(reqRole))
    
    if (!hasRequiredRole) {
      return (
        <div className="container mx-auto p-6 space-y-6">
          <Alert className="max-w-md mx-auto border-destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Access Denied</strong>
              <br />
              You don't have the required permissions to view this page.
              <br />
              Required roles: {requiredRoles.join(', ')}
              <br />
              Your roles: {userRoles.join(', ') || 'None'}
            </AlertDescription>
          </Alert>
        </div>
      )
    }
  }

  // User is authenticated and authorized, render children
  return <>{children}</>
}

// HOC version for page-level protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[]
) {
  const ProtectedComponent = (props: P) => {
    return (
      <ProtectedRoute requiredRoles={requiredRoles}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }

  ProtectedComponent.displayName = `withAuth(${Component.displayName || Component.name})`
  
  return ProtectedComponent
}

export default ProtectedRoute
