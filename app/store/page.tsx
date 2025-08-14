"use client"

import { Store } from 'lucide-react'
import { BasicInformationForm } from "@/components/basic-information-form"
import { LoyaltySettingsForm } from "@/components/loyalty-settings-form"

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] to-[#EDE9FE] dark:from-background dark:to-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Store className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Store Information
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage your store details and loyalty program settings
          </p>
        </div>

        {/* Forms */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Basic Information Form */}
          <div className="order-1">
            <BasicInformationForm />
          </div>

          {/* Loyalty Settings Form */}
          <div className="order-2">
            <LoyaltySettingsForm />
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-primary mb-2">
            Important Information
          </h3>
          <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <li>• Changes to loyalty settings will apply to new transactions only</li>
            <li>• Store image should be square (1:1 ratio) for best display</li>
            <li>• Address information is used for customer location services</li>
            <li>• Rounding settings affect how points are calculated and displayed</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
