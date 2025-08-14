"use client"

import { Bell, Menu, User, ChevronDown } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogoutButton } from "@/components/logout-button"
import { useAuthContext } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { apiUser, isAuthenticated } = useAuthContext()

  const getUserInitials = () => {
    if (apiUser?.fullName) {
      return apiUser.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase()
    }
    if (apiUser?.email) {
      return apiUser.email.substring(0, 2).toUpperCase()
    }
    return 'JD'
  }

  const getUserDisplayName = () => {
    if (apiUser?.fullName) {
      return apiUser.fullName
    }
    if (apiUser?.firstName || apiUser?.lastName) {
      return `${apiUser.firstName || ''} ${apiUser.lastName || ''}`.trim()
    }
    return apiUser?.email || 'User'
  }

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
            <span className="font-bold text-lg text-foreground transition-colors group-hover:text-primary">
              Loyalty CMS
            </span>
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          
          {/* Notification button - only show when authenticated */}
          {isAuthenticated && (
            <Button variant="outline" size="icon" className="hidden sm:flex h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
          )}

          {/* User menu - only show when authenticated */}
          {isAuthenticated && apiUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">{apiUser.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">{apiUser.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Status: {apiUser.status}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="p-0">
                  <LogoutButton 
                    variant="ghost" 
                    className="w-full justify-start px-2 py-1.5 h-auto font-normal" 
                    showConfirmDialog={false}
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Fallback avatar when not authenticated */
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </header>
  )
}
