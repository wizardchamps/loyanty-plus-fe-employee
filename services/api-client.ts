import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiError, RefreshTokenRequest, RefreshTokenResponse } from '@/types/auth'

class ApiClient {
  private instance: AxiosInstance
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private isRefreshing: boolean = false
  private failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: any) => void
  }> = []

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && !config.url?.includes('/auth/refresh')) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle errors and token refresh
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          code: error.response?.data?.code || error.code,
          status: error.response?.status,
        }

        // Handle 401 errors with automatic token refresh
        if (error.response?.status === 401 && !originalRequest._retry && this.refreshToken) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return this.instance(originalRequest)
            }).catch(err => Promise.reject(err))
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const refreshResponse = await this.instance.post<RefreshTokenResponse>('/auth/refresh', {
              refreshToken: this.refreshToken
            })

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data

            // Update tokens
            this.setToken(newAccessToken)
            if (newRefreshToken) {
              this.setRefreshToken(newRefreshToken)
            }

            // Update localStorage
            if (typeof window !== 'undefined') {
              const authStorage = localStorage.getItem('auth-storage')
              if (authStorage) {
                const authData = JSON.parse(authStorage)
                authData.state.token = newAccessToken
                if (newRefreshToken) {
                  authData.state.refreshToken = newRefreshToken
                }
                localStorage.setItem('auth-storage', JSON.stringify(authData))
              }
            }

            // Process failed queue
            this.processQueue(null, newAccessToken)

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return this.instance(originalRequest)

          } catch (refreshError) {
            // Refresh failed - redirect to login
            this.processQueue(refreshError, null)
            this.clearTokens()
            
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth-storage')
              window.location.href = '/login'
            }
            
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        // For other errors or if no refresh token available
        if (error.response?.status === 401) {
          this.clearTokens()
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage')
            window.location.href = '/login'
          }
        }

        return Promise.reject(apiError)
      }
    )
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(token!)
      }
    })
    
    this.failedQueue = []
  }

  setToken(token: string) {
    this.accessToken = token
  }

  setRefreshToken(token: string) {
    this.refreshToken = token
  }

  clearToken() {
    this.accessToken = null
  }

  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
  }

  // Initialize tokens from storage (call this on app startup)
  initializeTokens(accessToken: string | null, refreshToken: string | null) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config)
    return response.data
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient()
export default apiClient
