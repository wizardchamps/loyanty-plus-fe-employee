import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '@/services'
import { LoginResponse, User, SendOtpResponse, RefreshTokenResponse } from '@/types/auth'
import { apiClient } from '@/services/api-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

// Query keys for caching
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

// Send OTP mutation
export const useSendOtp = () => {
  return useMutation({
    mutationFn: (email: string) => AuthService.sendOtp(email),
    retry: (failureCount, error: any) => {
      // Only retry on network errors or 5xx server errors
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 2
    },
    onSuccess: (data: SendOtpResponse) => {
      toast.success(`OTP sent to your email successfully! OTP ID: ${data.otpId}`)
    },
    onError: (error: any) => {
      const message = error?.message || 'Failed to send OTP. Please try again.'
      toast.error(message)
      console.error('Send OTP error:', error)
    },
  })
}

// Verify OTP mutation
export const useVerifyOtp = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: ({ email, otpCode }: { email: string; otpCode: string }) => 
      AuthService.verifyOtp(email, otpCode),
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 2
    },
    onSuccess: (data: LoginResponse) => {
      // Store auth data
      login(data.user, data.accessToken, data.refreshToken)
      
      // Initialize API client
      apiClient.initializeTokens(data.accessToken, data.refreshToken)
      
      // Clear any cached auth data and refetch
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      
      toast.success('Login successful!')
      router.push('/welcome')
    },
    onError: (error: any) => {
      const message = error?.message || 'Invalid OTP. Please try again.'
      toast.error(message)
      console.error('Verify OTP error:', error)
    },
  })
}

// Google OAuth login mutation
export const useGoogleLogin = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (idToken: string) => AuthService.loginWithGoogle(idToken),
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 2
    },
    onSuccess: (data: LoginResponse) => {
      // Store auth data
      login(data.user, data.accessToken, data.refreshToken)
      
      // Initialize API client
      apiClient.initializeTokens(data.accessToken, data.refreshToken)
      
      // Clear any cached auth data and refetch
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      
      toast.success('Google login successful!')
      router.push('/welcome')
    },
    onError: (error: any) => {
      const message = error?.message || 'Google login failed. Please try again.'
      toast.error(message)
      console.error('Google login error:', error)
    },
  })
}

// Phone login mutation
export const usePhoneLogin = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { login } = useAuthStore()

  return useMutation({
    mutationFn: (idToken: string) => AuthService.loginWithPhone(idToken),
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 2
    },
    onSuccess: (data: LoginResponse) => {
      // Store auth data
      login(data.user, data.accessToken, data.refreshToken)
      
      // Initialize API client
      apiClient.initializeTokens(data.accessToken, data.refreshToken)
      
      // Clear any cached auth data and refetch
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      
      toast.success('Phone login successful!')
      router.push('/welcome')
    },
    onError: (error: any) => {
      const message = error?.message || 'Phone login failed. Please try again.'
      toast.error(message)
      console.error('Phone login error:', error)
    },
  })
}

// Refresh token mutation
export const useRefreshToken = () => {
  const { setToken, setRefreshToken, refreshToken } = useAuthStore()

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }
      return AuthService.refreshToken(refreshToken)
    },
    onSuccess: (data: RefreshTokenResponse) => {
      setToken(data.accessToken)
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken)
      }
      // Update API client
      apiClient.setToken(data.accessToken)
      if (data.refreshToken) {
        apiClient.setRefreshToken(data.refreshToken)
      }
      console.log('Token refreshed successfully')
    },
    onError: (error: any) => {
      console.error('Token refresh failed:', error)
    },
  })
}

// Profile query
export const useProfile = () => {
  const { token, refreshToken, isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: AuthService.getProfile,
    enabled: !!token && isAuthenticated, // Only run if user has a token and is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors - let the interceptor handle token refresh
      if (error.status === 401) {
        return false
      }
      return failureCount < 3
    },
  })
}

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient()
  const { logout: logoutStore } = useAuthStore()
  return useMutation({
    mutationFn: AuthService.logout,
    retry: (failureCount, error: any) => {
      // Only retry logout on network errors, not on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false
      }
      return failureCount < 1 // Only retry once for logout
    },
    onSuccess: () => {
      // Clear all auth data
      logoutStore()
      apiClient.clearTokens()
      queryClient.clear()
      toast.success('Logged out successfully')
    },
    onError: (error: any) => {
      console.warn('Logout API call failed:', error)
      // Still proceed with local logout
      logoutStore()
      apiClient.clearTokens()
      queryClient.clear()
      toast.success('Logged out successfully')
    },
  })
}

// Auth hook for components
export const useAuth = () => {
  return useAuthStore()
}
