// Authentication related types
export interface LoginRequest {
  idToken: string
  method: "google" | "phone"
}

// OTP related types
export interface SendOtpRequest {
  email: string
}

export interface VerifyOtpRequest {
  email: string
  otpCode: string
  type: "EMAIL_VERIFICATION" | "PHONE_VERIFICATION" | "PASSWORD_RESET" | "LOGIN_VERIFICATION"
}

export interface SendOtpResponse {
  message: string
  otpId: string
}

// OTP Login request (following API docs)
export interface OtpLoginRequest {
  phoneNumber: string
  otpCode: string
}

// Refresh token types
export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string // New access token
  refreshToken?: string // New refresh token (optional)
}

export interface User {
  id: string
  email: string
  userCode: string
  firstName: string | null
  lastName: string | null
  fullName: string
  phoneNumber: string | null
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED"
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string
  updatedAt: string
  roles: Array<{
    id: string
    userId: string
    storeId: string | null
    role: string
    store: any | null
  }>
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Error types
export interface ApiError {
  message: string
  code?: string
  status?: number
}
