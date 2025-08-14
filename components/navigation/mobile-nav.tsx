"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Store, Users, BarChart3, Settings, Receipt } from 'lucide-react' // Changed from ReceiptText to Receipt
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: 'Store',
    href: '/store',
    icon: Store,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    name: 'New Txn', // Abbreviated for mobile
    href: '/transactions/create',
    icon: Receipt, // Changed from ReceiptText to Receipt
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="grid grid-cols-4 h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
