"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Loader2, Store } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { basicInfoSchema, type BasicInfoFormData } from "@/lib/validations"

export function BasicInformationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<BasicInfoFormData>({
    resolver: yupResolver(basicInfoSchema),
    defaultValues: {
      name: '',
      address: '',
      image: null
    }
  })

  const imageValue = watch('image')

  const onSubmit = async (data: BasicInfoFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Basic Information submitted:', {
        name: data.name,
        address: data.address,
        image: data.image ? data.image.name : null
      })
      
      // Here you would typically send the data to your API
      alert('Basic information saved successfully!')
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error saving basic information. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          Basic Information
        </CardTitle>
        <CardDescription>
          Update your store's basic information and branding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Store Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Store Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter your store name"
              className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                errors.name ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Store Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Store Address *</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Enter your complete store address"
              className={`min-h-[100px] ${
                errors.address ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          {/* Store Image */}
          <div className="space-y-2">
            <Label>Store Image</Label>
            <FileUpload
              value={imageValue}
              onChange={(file) => setValue('image', file)}
              error={errors.image?.message}
            />
            <p className="text-sm text-muted-foreground">
              Upload your store logo or image. This will be displayed to customers.
            </p>
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
              'Save Basic Information'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
