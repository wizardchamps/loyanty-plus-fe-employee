"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomerCodeStep } from "./customer-code-step"
import { TransactionInfoStep } from "./transaction-info-step"
import { CustomerCodeFormData, TransactionInfoFormData } from "@/lib/validations"
import { CheckCircle, Circle } from 'lucide-react'
import { cn } from "@/lib/utils"

export function CreateTransactionForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [customerCodeData, setCustomerCodeData] = useState<CustomerCodeFormData | null>(null)
  const [transactionInfoData, setTransactionInfoData] = useState<TransactionInfoFormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCustomerCodeSubmit = (data: CustomerCodeFormData) => {
    setCustomerCodeData(data)
    setCurrentStep(2)
  }

  const handleTransactionInfoSubmit = async (data: TransactionInfoFormData) => {
    setIsSubmitting(true)
    setTransactionInfoData(data)

    const finalPayload = {
      customerCode: customerCodeData?.customerCode,
      ...data
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Final Transaction Payload:', finalPayload)
      alert('Transaction created successfully!')
      
      // Reset form after successful submission
      setCurrentStep(1)
      setCustomerCodeData(null)
      setTransactionInfoData(null)

    } catch (error) {
      console.error('Error creating transaction:', error)
      alert('Error creating transaction. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = (stepNum: number, title: string) => (
    <div className="flex items-center gap-2">
      {currentStep > stepNum ? (
        <CheckCircle className="h-5 w-5 text-primary" />
      ) : (
        <Circle className={cn("h-5 w-5", currentStep === stepNum ? "text-primary" : "text-muted-foreground")} />
      )}
      <span className={cn("font-medium", currentStep === stepNum ? "text-foreground" : "text-muted-foreground")}>
        {title}
      </span>
    </div>
  )

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Create New Transaction
        </CardTitle>
        <CardDescription>
          Follow the steps to record a new transaction for a customer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Step Indicators */}
        <div className="flex justify-center gap-4 mb-8">
          {renderStepIndicator(1, "Customer Code")}
          <div className="h-px w-8 bg-border self-center" />
          {renderStepIndicator(2, "Transaction Details")}
        </div>

        {/* Form Steps */}
        {currentStep === 1 && (
          <CustomerCodeStep onNext={handleCustomerCodeSubmit} defaultValues={customerCodeData || undefined} />
        )}
        {currentStep === 2 && (
          <TransactionInfoStep
            onBack={() => setCurrentStep(1)}
            onSubmit={handleTransactionInfoSubmit}
            isSubmitting={isSubmitting}
            defaultValues={transactionInfoData || undefined}
          />
        )}
      </CardContent>
    </Card>
  )
}
