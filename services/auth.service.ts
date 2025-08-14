import { apiClient } from './api-client'
import { LoginRequest, LoginResponse, User, SendOtpRequest, SendOtpResponse, VerifyOtpRequest, RefreshTokenRequest, RefreshTokenResponse } from '@/types/auth'

export class AuthService {
  // Login with Google ID token
  static async loginWithGoogle(idToken: string): Promise<LoginResponse> {
    const payload: LoginRequest = {
      idToken,
      method: 'google'
    }
    // Your API returns the data directly, not wrapped in success/data
    const response = await apiClient.post<LoginResponse>('/login/google', payload)
    return response
  }

  // Login with phone number
  static async loginWithPhone(idToken: string): Promise<LoginResponse> {
    const payload: LoginRequest = {
      idToken,
      method: 'phone'
    }
    const response = await apiClient.post<LoginResponse>('/login/phone', payload)
    return response
  }

  // Send OTP to email
  static async sendOtp(email: string): Promise<SendOtpResponse> {
    const payload: SendOtpRequest = {
      email
    }
    const response = await apiClient.post<SendOtpResponse>('/auth/send-otp', payload)
    return response
  }

  // Verify OTP and login
  static async verifyOtp(email: string, otpCode: string): Promise<LoginResponse> {
    const payload: VerifyOtpRequest = {
      email,
      otpCode,
      type: 'LOGIN_VERIFICATION'
    }
    const response = await apiClient.post<LoginResponse>('/auth/verify-otp', payload)
    return response
  }

  // Refresh access token
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const payload: RefreshTokenRequest = {
      refreshToken
    }
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', payload)
    return response
  }

  // Get user profile
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/profile')
    return response
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.warn('Logout API call failed:', error)
      // Continue with local logout even if API call fails
    }
  }
}

export default AuthService
