"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Calendar, CreditCard, Download, Edit, Heart, Home, Mail, Plus, Search, Settings, Share, Star, Trash2, TrendingUp, Users, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PurpleThemeShowcase() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Redirect to store page as the default
    router.replace('/store')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] to-[#EDE9FE] dark:from-background dark:to-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading...</p>
      </div>
    </div>
  )
}
