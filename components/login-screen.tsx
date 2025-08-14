"use client"
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Phone, Chrome } from 'lucide-react'
import { useSendOtp, useVerifyOtp, useGoogleLogin } from '@/hooks/use-auth-api'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [currentStep, setCurrentStep] = useState<'email' | 'otp'>('email')
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'google'>('email')

  const sendOtpMutation = useSendOtp()
  const verifyOtpMutation = useVerifyOtp()
  const googleLoginMutation = useGoogleLogin()

  const handleSendOtp = async () => {
    if (loginMethod === 'email' && email) {
      try {
        await sendOtpMutation.mutateAsync(email)
        setCurrentStep('otp')
      } catch (error) {
        console.error('Send OTP failed:', error)
      }
    } else if (loginMethod === 'phone' && phoneNumber) {
      // For phone login, we'll show OTP step directly
      // In a real app, you'd send OTP to the phone number
      setCurrentStep('otp')
    }
  }

  const handleVerifyOtp = async () => {
    if (loginMethod === 'email' && email && otpCode) {
      try {
        await verifyOtpMutation.mutateAsync({ email, otpCode })
      } catch (error) {
        console.error('Verify OTP failed:', error)
      }
    } else if (loginMethod === 'phone' && phoneNumber && otpCode) {
      // Handle phone OTP verification
      console.log('Phone OTP verification not yet implemented')
    }
  }

  const handleGoogleLogin = async () => {
    // In a real app, you would use Google OAuth to get the ID token
    // For demo purposes, we'll show an alert
    alert('Google OAuth integration required. Please implement Google OAuth to get ID token.')
  }

  const isLoading = sendOtpMutation.isPending || verifyOtpMutation.isPending || googleLoginMutation.isPending

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Employee Portal
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to access the employee dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Tabs value={loginMethod} onValueChange={(value) => {
              setLoginMethod(value as 'email' | 'phone' | 'google')
              setCurrentStep('email')
              setOtpCode('')
            }}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </TabsTrigger>
                <TabsTrigger value="google">
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                {currentStep === 'email' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleSendOtp}
                      disabled={!email || isLoading}
                    >
                      {sendOtpMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        'Send OTP'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otpCode">Enter OTP</Label>
                      <Input
                        id="otpCode"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength={6}
                        disabled={isLoading}
                      />
                      <p className="text-sm text-gray-600">
                        OTP sent to: {email}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep('email')}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        className="flex-1" 
                        onClick={handleVerifyOtp}
                        disabled={!otpCode || otpCode.length !== 6 || isLoading}
                      >
                        {verifyOtpMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify & Login'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="phone" className="space-y-4">
                {currentStep === 'email' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleSendOtp}
                      disabled={!phoneNumber || isLoading}
                    >
                      Send OTP
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneOtp">Enter OTP</Label>
                      <Input
                        id="phoneOtp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength={6}
                        disabled={isLoading}
                      />
                      <p className="text-sm text-gray-600">
                        OTP sent to: {phoneNumber}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep('email')}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        className="flex-1" 
                        onClick={handleVerifyOtp}
                        disabled={!otpCode || otpCode.length !== 6 || isLoading}
                      >
                        Verify & Login
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="google" className="space-y-4">
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      Click below to sign in with your Google account.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    className="w-full" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <Chrome className="mr-2 h-4 w-4" />
                    Sign in with Google
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter>
            <div className="text-center text-sm text-gray-600 w-full">
              <p>Employee Portal - Secure Access</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default LoginScreen
