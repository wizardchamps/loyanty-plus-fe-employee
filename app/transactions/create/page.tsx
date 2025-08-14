"use client"

import { Receipt } from 'lucide-react' // Changed from ReceiptText to Receipt
import { CreateTransactionForm } from "@/components/transactions/create-transaction-form"

export default function CreateTransactionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] to-[#EDE9FE] dark:from-background dark:to-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Receipt className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Create Transaction
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Record new loyalty transactions for your customers
          </p>
        </div>

        {/* Transaction Form */}
        <div className="max-w-2xl mx-auto">
          <CreateTransactionForm />
        </div>
      </div>
    </div>
  )
}
