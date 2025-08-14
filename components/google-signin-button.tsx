"use client"
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Chrome, Loader2 } from 'lucide-react'
import { useGoogleOAuth } from '@/hooks/use-google-oauth'

interface GoogleSignInButtonProps {
  onSuccess?: (idToken: string) => void
  onError?: (error: any) => void
  disabled?: boolean
  className?: string
  useCustomButton?: boolean
}

export const GoogleSignInButton = ({
  onSuccess,
  onError,
  disabled = false,
  className = '',
  useCustomButton = true
}: GoogleSignInButtonProps) => {
  const { signInWithGoogle, renderGoogleButton, isLoading } = useGoogleOAuth()
  const googleButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!useCustomButton && googleButtonRef.current) {
      renderGoogleButton('google-signin-button')
    }
  }, [useCustomButton, renderGoogleButton])

  const handleClick = () => {
    if (useCustomButton) {
      signInWithGoogle()
    }
  }

  if (useCustomButton) {
    return (
      <Button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`w-full ${className}`}
        variant="outline"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in with Google...
          </>
        ) : (
          <>
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </>
        )}
      </Button>
    )
  }

  return (
    <div 
      ref={googleButtonRef}
      id="google-signin-button" 
      className={className}
    />
  )
}

export default GoogleSignInButton
