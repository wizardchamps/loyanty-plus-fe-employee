"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { User, QrCode, Loader2, CheckCircle, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { QrScannerModal } from "@/components/ui/qr-scanner-modal"
import { customerCodeSchema, type CustomerCodeFormData } from "@/lib/validations"
import { useCustomerLookup } from "@/hooks/use-loyalty-data"
import { CustomerLookupResponse } from "@/lib/types"

interface CustomerCodeStepProps {
  onNext: (data: CustomerCodeFormData & { customerData?: CustomerLookupResponse }) => void
  defaultValues?: CustomerCodeFormData
}

export function CustomerCodeStep({ onNext, defaultValues }: CustomerCodeStepProps) {
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)
  const [customerData, setCustomerData] = useState<CustomerLookupResponse | null>(null)
  const [lookupError, setLookupError] = useState<string | null>(null)
  
  const customerLookupMutation = useCustomerLookup()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerCodeFormData>({
    resolver: yupResolver(customerCodeSchema),
    defaultValues: defaultValues,
  })

  const customerCode = watch("customerCode")

  // Determine search parameters based on customer code format
  const determineSearchParams = (code: string) => {
    const trimmedCode = code.trim()
    
    // Check if it's an email
    if (trimmedCode.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedCode)) {
      return { email: trimmedCode }
    }
    
    // Check if it's a phone number (starts with +, contains only digits, spaces, hyphens, parentheses)
    if (/^[\+]?[\s]*[(]?[\d\s\-\(\)]{10,}$/.test(trimmedCode)) {
      return { phoneNumber: trimmedCode.replace(/[\s\-\(\)]/g, '') }
    }
    
    // Default to user store code
    return { userStoreCode: trimmedCode }
  }

  const handleLookupCustomer = async (data: CustomerCodeFormData) => {
    if (!data.customerCode?.trim()) {
      setLookupError("Please enter a customer code")
      return
    }

    setLookupError(null)
    setCustomerData(null)

    try {
      // For demo purposes, using a mock store ID
      // In real implementation, get this from user's context/store selection
      const MOCK_STORE_ID = "550e8400-e29b-41d4-a716-446655440000"
      
      const searchParams = determineSearchParams(data.customerCode)
      
      const response = await customerLookupMutation.mutateAsync({
        storeId: MOCK_STORE_ID,
        ...searchParams
      })
      
      setCustomerData(response)
      
      // Proceed to next step with customer data
      onNext({ ...data, customerData: response })
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Customer not found or not a member of this store"
      setLookupError(errorMessage)
    }
  }

  const handleQrScan = (result: string) => {
    // Extract customer code from QR result
    // Assuming the QR code contains just the customer code
    // You can modify this logic based on your QR code format
    let customerCode = result.trim()

    // If QR contains JSON or other format, parse it here
    try {
      const parsed = JSON.parse(result)
      if (parsed.customerCode) {
        customerCode = parsed.customerCode
      } else if (parsed.code) {
        customerCode = parsed.code
      }
    } catch {
      // If not JSON, use the raw result as customer code
      customerCode = result.trim()
    }

    setValue("customerCode", customerCode)
  }

  return (
    <>
      <div className="space-y-6">
        <form onSubmit={handleSubmit(handleLookupCustomer)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customerCode" className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Customer Code *
            </Label>
            <div className="flex gap-2">
              <Input
                id="customerCode"
                {...register("customerCode")}
                placeholder="Enter customer's code, email, or phone number"
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  errors.customerCode ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
                disabled={customerLookupMutation.isPending}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setIsQrScannerOpen(true)}
                className="h-10 w-10 flex-shrink-0"
                disabled={customerLookupMutation.isPending}
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
            {errors.customerCode && <p className="text-sm text-destructive">{errors.customerCode.message}</p>}
            <p className="text-sm text-muted-foreground">
              Enter a store customer code, email address, or phone number. You can also scan a QR code.
            </p>
          </div>

          {/* Lookup Error */}
          {lookupError && (
            <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{lookupError}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={customerLookupMutation.isPending || !customerCode?.trim()}
          >
            {customerLookupMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Looking up customer...
              </>
            ) : (
              "Next: Transaction Details"
            )}
          </Button>
        </form>

        {/* Customer Information Display */}
        {customerData && (
          <Card className="mt-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-5 w-5" />
                Customer Found
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100">Customer Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {customerData.customer.fullName}</p>
                    <p><span className="font-medium">Email:</span> {customerData.customer.email}</p>
                    <p><span className="font-medium">Phone:</span> {customerData.customer.phoneNumber}</p>
                    <p><span className="font-medium">Store Code:</span> {customerData.membership.userStoreCode}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100">Loyalty Status</h4>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Points Balance:</span> 
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        {customerData.membership.pointsBalance} pts
                      </Badge>
                    </p>
                    <p><span className="font-medium">Tier:</span> {customerData.membership.tier}</p>
                    <p><span className="font-medium">Total Earned:</span> {customerData.membership.totalPointsEarned} pts</p>
                    <p><span className="font-medium">Total Redeemed:</span> {customerData.membership.totalPointsRedeemed} pts</p>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              {customerData.recentTransactions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Recent Transactions</h4>
                  <div className="space-y-2">
                    {customerData.recentTransactions.slice(0, 2).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center text-sm p-2 bg-green-100 dark:bg-green-900 rounded">
                        <div>
                          <span className="font-medium">{transaction.description}</span>
                          <p className="text-xs text-green-700 dark:text-green-300">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${transaction.amount}</p>
                          {transaction.pointsEarned > 0 && (
                            <p className="text-xs text-green-600 dark:text-green-400">+{transaction.pointsEarned} pts</p>
                          )}
                          {transaction.pointsRedeemed > 0 && (
                            <p className="text-xs text-red-600 dark:text-red-400">-{transaction.pointsRedeemed} pts</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <QrScannerModal isOpen={isQrScannerOpen} onClose={() => setIsQrScannerOpen(false)} onScan={handleQrScan} />
    </>
  )
}
