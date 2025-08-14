"use client"

import { Store } from 'lucide-react'
import { BasicInformationForm } from "@/components/basic-information-form"
import { LoyaltySettingsForm } from "@/components/loyalty-settings-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useStores, useSettings } from "@/hooks/use-loyalty-data"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function StorePage() {
  const { data: stores, isLoading: storesLoading, error: storesError } = useStores()
  const { data: settings, isLoading: settingsLoading, error: settingsError } = useSettings()

  const currentStore = stores?.[0] // Assuming single store for now

  if (storesLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] to-[#EDE9FE] dark:from-background dark:to-background pb-20 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Page Header */}
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Loading Forms */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (storesError || settingsError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] to-[#EDE9FE] dark:from-background dark:to-background pb-20 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          <Alert className="border-destructive">
            <AlertDescription>
              Error loading store data: {(storesError || settingsError)?.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

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

        {/* Store Stats */}
        {currentStore && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{currentStore.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">Total Customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{currentStore.totalTransactions}</div>
                <p className="text-xs text-muted-foreground">Total Transactions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{currentStore.totalPoints.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total Points Issued</p>
              </CardContent>
            </Card>
          </div>
        )}

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
