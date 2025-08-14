"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { DollarSign, FileText, Hash, Loader2 } from 'lucide-react' // Removed Tag icon

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// Removed Select imports
import { transactionInfoSchema, type TransactionInfoFormData } from "@/lib/validations"
import { CustomerLookupResponse } from "@/lib/types"

interface TransactionInfoStepProps {
  onBack: () => void
  onNext: (data: TransactionInfoFormData) => void
  isSubmitting?: boolean
  defaultValues?: TransactionInfoFormData
  customerData?: CustomerLookupResponse
}

export function TransactionInfoStep({ onBack, onNext, isSubmitting = false, defaultValues, customerData }: TransactionInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TransactionInfoFormData>({
    resolver: yupResolver(transactionInfoSchema) as any,
    defaultValues: defaultValues
  })

  const handleNext = (data: TransactionInfoFormData) => {
    onNext(data)
  }

  // Removed transactionType watch

  return (
    <div className="space-y-6">
      {/* Customer Information Display */}
      {customerData && (
        <div className="bg-muted/50 p-4 rounded-lg border">
          <h3 className="font-semibold text-sm mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">Name:</span>
              <p className="text-muted-foreground">{customerData.customer.fullName}</p>
            </div>
            <div>
              <span className="font-medium">Store Code:</span>
              <p className="text-muted-foreground">{customerData.membership.userStoreCode}</p>
            </div>
            <div>
              <span className="font-medium">Phone:</span>
              <p className="text-muted-foreground">{customerData.customer.phoneNumber}</p>
            </div>
            <div>
              <span className="font-medium">Points Balance:</span>
              <p className="text-muted-foreground">{customerData.membership.pointsBalance} points</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleNext as any)} className="space-y-6">
      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Amount *
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            {...register('amount')}
            placeholder="0.00"
            className={`pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              errors.amount ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Description
        </Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="e.g., Purchase of items, Refund for order #123"
          className={`min-h-[80px] ${
            errors.description ? 'border-destructive focus-visible:ring-destructive' : ''
          }`}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Transaction Type - REMOVED */}
      {/*
      <div className="space-y-2">
        <Label htmlFor="transactionType" className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          Transaction Type *
        </Label>
        <Select
          value={transactionType}
          onValueChange={(value: TransactionType) => setValue('transactionType', value)}
        >
          <SelectTrigger className={`w-full ${errors.transactionType ? 'border-destructive focus-visible:ring-destructive' : ''}`}>
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TransactionType).map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.transactionType && (
          <p className="text-sm text-destructive">{errors.transactionType.message}</p>
        )}
      </div>
      */}

      {/* External Transaction ID */}
      <div className="space-y-2">
        <Label htmlFor="externalTransactionId" className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-primary" />
          External Transaction ID
        </Label>
        <Input
          id="externalTransactionId"
          {...register('externalTransactionId')}
          placeholder="Optional: Reference ID from your POS/system"
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            errors.externalTransactionId ? 'border-destructive focus-visible:ring-destructive' : ''
          }`}
        />
        {errors.externalTransactionId && (
          <p className="text-sm text-destructive">{errors.externalTransactionId.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Transaction'
          )}
        </Button>
      </div>
    </form>
    </div>
  )
}
