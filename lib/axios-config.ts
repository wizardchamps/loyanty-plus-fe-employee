import axios from 'axios'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management utilities
class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token'
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token'

  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  static setRefreshToken(refreshToken: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
  }

  static removeTokens(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const exp = payload.exp * 1000 // Convert to milliseconds
      return Date.now() >= exp
    } catch {
      return true
    }
  }
}

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = TokenManager.getRefreshToken()
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          const { accessToken, refreshToken: newRefreshToken } = response.data
          
          TokenManager.setToken(accessToken)
          if (newRefreshToken) {
            TokenManager.setRefreshToken(newRefreshToken)
          }

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        TokenManager.removeTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    // Handle different HTTP status codes
    switch (error.response?.status) {
      case 400:
        toast.error('Bad request. Please check your input.')
        break
      case 403:
        toast.error('Access denied. You do not have permission.')
        break
      case 404:
        toast.error('Resource not found.')
        break
      case 429:
        toast.error('Too many requests. Please try again later.')
        break
      case 500:
        toast.error('Server error. Please try again later.')
        break
      default:
        if (error.message === 'Network Error') {
          toast.error('Network error. Please check your connection.')
        } else if (error.code === 'ECONNABORTED') {
          toast.error('Request timeout. Please try again.')
        } else {
          toast.error('An unexpected error occurred.')
        }
    }

    return Promise.reject(error)
  }
)

// Auth API functions
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials)
    const { accessToken, refreshToken, user } = response.data
    
    TokenManager.setToken(accessToken)
    TokenManager.setRefreshToken(refreshToken)
    
    return { accessToken, refreshToken, user }
  },

  logout: async () => {
    const refreshToken = TokenManager.getRefreshToken()
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    TokenManager.removeTokens()
  },

  refreshToken: async () => {
    const refreshToken = TokenManager.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post('/auth/refresh', { refreshToken })
    const { accessToken, refreshToken: newRefreshToken } = response.data
    
    TokenManager.setToken(accessToken)
    if (newRefreshToken) {
      TokenManager.setRefreshToken(newRefreshToken)
    }
    
    return { accessToken, refreshToken: newRefreshToken }
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}

export { apiClient, TokenManager }
export default apiClient
