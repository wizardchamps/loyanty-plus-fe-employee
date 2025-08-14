"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { User, QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrScannerModal } from "@/components/ui/qr-scanner-modal"
import { customerCodeSchema, type CustomerCodeFormData } from "@/lib/validations"

interface CustomerCodeStepProps {
  onNext: (data: CustomerCodeFormData) => void
  defaultValues?: CustomerCodeFormData
}

export function CustomerCodeStep({ onNext, defaultValues }: CustomerCodeStepProps) {
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerCodeFormData>({
    resolver: yupResolver(customerCodeSchema),
    defaultValues: defaultValues,
  })

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
      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="customerCode" className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Customer Code *
          </Label>
          <div className="flex gap-2">
            <Input
              id="customerCode"
              {...register("customerCode")}
              placeholder="Enter customer's unique code"
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                errors.customerCode ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsQrScannerOpen(true)}
              className="h-10 w-10 flex-shrink-0"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
          {errors.customerCode && <p className="text-sm text-destructive">{errors.customerCode.message}</p>}
          <p className="text-sm text-muted-foreground">
            This could be a loyalty ID, phone number, or email. You can also scan a QR code.
          </p>
        </div>

        <Button type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
          Next: Transaction Details
        </Button>
      </form>

      <QrScannerModal isOpen={isQrScannerOpen} onClose={() => setIsQrScannerOpen(false)} onScan={handleQrScan} />
    </>
  )
}
