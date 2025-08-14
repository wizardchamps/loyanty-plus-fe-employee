"use client"

import { Bell, Menu } from 'lucide-react'
import Link from "next/link" // Import Link
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Menu button and Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          {/* Logo - Always visible and clickable */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center transition-colors group-hover:bg-primary/90">
              <span className="text-primary-foreground font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-lg text-foreground transition-colors group-hover:text-primary">Loyalty CMS</span>
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="hidden sm:flex h-8 w-8">
            <Bell className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
