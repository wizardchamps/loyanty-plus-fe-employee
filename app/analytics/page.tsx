import { BarChart3 } from 'lucide-react'

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Users, CreditCard, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useAnalytics } from "@/hooks/use-loyalty-data"

export default function AnalyticsPage() {
  const { data: analytics, isLoading, error } = useAnalytics()

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="text-lg font-semibold">Error loading analytics</p>
              <p className="text-sm text-muted-foreground mt-2">
                {error instanceof Error ? error.message : 'Failed to load analytics data'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p>No analytics data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your loyalty program performance and customer engagement
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <TrendingUp className="h-4 w-4 mr-1" />
          +{analytics.monthlyGrowth}% this month
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Users
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {analytics.totalUsers.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                <ArrowUpRight className="h-3 w-3" />
                12%
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Total Transactions
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {analytics.totalTransactions.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                <ArrowUpRight className="h-3 w-3" />
                8%
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Points Earned
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {analytics.totalPointsEarned.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
                <ArrowUpRight className="h-3 w-3" />
                15%
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Avg Points/User
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {analytics.averagePointsPerUser}
              </div>
              <div className="flex items-center text-xs text-orange-600 dark:text-orange-400">
                <ArrowDownRight className="h-3 w-3" />
                3%
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Spenders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Top Customers
            </CardTitle>
            <CardDescription>
              Highest loyalty point earners this month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topSpenders.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{user.loyaltyPoints} pts</div>
                  <Badge variant="outline" className="text-xs">
                    {user.tier}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Points Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Points Overview
            </CardTitle>
            <CardDescription>
              Points activity and redemption statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {analytics.totalPointsEarned.toLocaleString()}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Points Earned
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {analytics.totalPointsRedeemed.toLocaleString()}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  Points Redeemed
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="font-medium">{analytics.activeUsers} / {analytics.totalUsers}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(analytics.activeUsers / analytics.totalUsers) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">Redemption Rate</span>
                <span className="font-medium">
                  {((analytics.totalPointsRedeemed / analytics.totalPointsEarned) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(analytics.totalPointsRedeemed / analytics.totalPointsEarned) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
