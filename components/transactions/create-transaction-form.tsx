"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomerCodeStep } from "./customer-code-step"
import { TransactionInfoStep } from "./transaction-info-step"
import { CustomerCodeFormData, TransactionInfoFormData } from "@/lib/validations"
import { CheckCircle, Circle } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useCreateTransaction } from "@/hooks/use-loyalty-data"
import { CreateTransactionData, CustomerLookupResponse } from "@/lib/types"

export function CreateTransactionForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [customerCodeData, setCustomerCodeData] = useState<CustomerCodeFormData & { customerData?: CustomerLookupResponse } | null>(null)
  const [transactionInfoData, setTransactionInfoData] = useState<TransactionInfoFormData | null>(null)
  
  const createTransactionMutation = useCreateTransaction()

  const handleCustomerCodeSubmit = (data: CustomerCodeFormData & { customerData?: CustomerLookupResponse }) => {
    setCustomerCodeData(data)
    setCurrentStep(2)
  }

  const handleTransactionInfoSubmit = async (data: TransactionInfoFormData) => {
    if (!customerCodeData?.customerCode) {
      console.error('Customer code is required')
      return
    }

    const transactionData: CreateTransactionData = {
      customerCode: customerCodeData.customerCode,
      type: data.type as 'earn' | 'redeem',
      amount: data.amount,
      description: data.description || '',
    }

    try {
      await createTransactionMutation.mutateAsync(transactionData)
      
      // Reset form after successful submission
      setCurrentStep(1)
      setCustomerCodeData(null)
      setTransactionInfoData(null)

    } catch (error) {
      console.error('Error creating transaction:', error)
      // Error handling is done in the hook with toast notifications
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
                    <CustomerCodeStep 
            onNext={handleCustomerCodeSubmit} 
            defaultValues={customerCodeData ? { customerCode: customerCodeData.customerCode } : undefined} 
          />
        )}
        {currentStep === 2 && (
                    <TransactionInfoStep 
            onNext={handleTransactionInfoSubmit} 
            onBack={() => setCurrentStep(1)} 
            defaultValues={transactionInfoData || undefined}
            customerData={customerCodeData?.customerData}
          />
        )}
      </CardContent>
    </Card>
  )
}
