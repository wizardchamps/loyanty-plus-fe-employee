"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Store, Users, Receipt, X } from 'lucide-react' // Changed from ReceiptText to Receipt
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: 'Store Information',
    href: '/store',
    icon: Store,
  },
  {
    name: 'User Management',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Create Transaction', // New navigation item
    href: '/transactions/create',
    icon: Receipt, // Changed from ReceiptText to Receipt
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:static md:z-auto"
      )}>
        {/* Mobile Close Button */}
        <div className="flex items-center justify-end p-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 md:pt-6">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Version - Sticky to bottom */}
        <div className="p-4 border-t border-border mt-auto">
          <div className="text-xs text-muted-foreground text-center">
            Version 1.0.0
          </div>
        </div>
      </aside>
    </>
  )
}
