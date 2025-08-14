import { useEffect } from 'react'
import { useGoogleLogin as useGoogleLoginMutation } from '@/hooks/use-auth-api'

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

declare global {
  interface Window {
    google: any
    googleSDKLoaded: boolean
  }
}

export const useGoogleOAuth = () => {
  const googleLoginMutation = useGoogleLoginMutation()

  // Initialize Google OAuth
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initializeGoogleOAuth = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        })
        window.googleSDKLoaded = true
      }
    }

    const handleCredentialResponse = (response: any) => {
      if (response.credential) {
        googleLoginMutation.mutate(response.credential)
      }
    }

    // Load Google Identity Services SDK if not already loaded
    if (!window.googleSDKLoaded) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = initializeGoogleOAuth
      document.head.appendChild(script)

      return () => {
        document.head.removeChild(script)
      }
    } else {
      initializeGoogleOAuth()
    }
  }, [googleLoginMutation])

  const signInWithGoogle = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt()
    } else {
      console.error('Google OAuth not initialized')
    }
  }

  const renderGoogleButton = (elementId: string) => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'outline',
          size: 'large',
          width: 200,
          text: 'sign_in_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      )
    }
  }

  return {
    signInWithGoogle,
    renderGoogleButton,
    isLoading: googleLoginMutation.isPending,
    error: googleLoginMutation.error,
  }
}
