"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Loader2, Settings, DollarSign, RotateCcw } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { loyaltySettingsSchema, type LoyaltySettingsFormData } from "@/lib/validations"

export function LoyaltySettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LoyaltySettingsFormData>({
    resolver: yupResolver(loyaltySettingsSchema),
    defaultValues: {
      moneyPerPoint: 1.00,
      rounding: false
    }
  })

  const roundingValue = watch('rounding')

  const onSubmit = async (data: LoyaltySettingsFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Loyalty Settings submitted:', data)
      
      // Here you would typically send the data to your API
      alert('Loyalty settings saved successfully!')
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error saving loyalty settings. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Loyalty Settings
        </CardTitle>
        <CardDescription>
          Configure how your loyalty program calculates and awards points
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Money Per Point */}
          <div className="space-y-2">
            <Label htmlFor="moneyPerPoint" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Money Per Point *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="moneyPerPoint"
                type="number"
                step="0.01"
                min="0.01"
                max="1000"
                {...register('moneyPerPoint')}
                placeholder="1.00"
                className={`pl-12 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  errors.moneyPerPoint ? 'border-destructive focus-visible:ring-destructive' : ''
                }`}
              />
            </div>
            {errors.moneyPerPoint && (
              <p className="text-sm text-destructive">{errors.moneyPerPoint.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Amount of money customers need to spend to earn 1 loyalty point
            </p>
          </div>

          {/* Rounding Setting */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="rounding" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-primary" />
                  Rounding
                </Label>
                <p className="text-sm text-muted-foreground">
                  Round points to the nearest whole number when calculating rewards
                </p>
              </div>
              <Switch
                id="rounding"
                checked={roundingValue}
                onCheckedChange={(checked) => setValue('rounding', checked)}
              />
            </div>
            
            {/* Example calculation */}
            <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Example Calculation:</h4>
              <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <p>Customer spends: $12.50</p>
                <p>Money per point: ${watch('moneyPerPoint') || 1.00}</p>
                <p>Points earned: {roundingValue 
                  ? Math.round(12.50 / (watch('moneyPerPoint') || 1.00))
                  : (12.50 / (watch('moneyPerPoint') || 1.00)).toFixed(2)
                } points</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Loyalty Settings'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
