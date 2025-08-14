"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Store, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: 'Store Information',
    href: '/store',
    icon: Store,
  },
  // Add more navigation items here as your app grows
  // {
  //   name: 'Customers',
  //   href: '/customers',
  //   icon: Users,
  // },
]

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
