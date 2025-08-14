"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'
import { useLogout } from '@/hooks/use-auth-api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showIcon?: boolean
  showConfirmDialog?: boolean
}

export const LogoutButton = ({
  variant = 'outline',
  size = 'default',
  className = '',
  showIcon = true,
  showConfirmDialog = true
}: LogoutButtonProps) => {
  const [open, setOpen] = useState(false)
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate()
    setOpen(false)
  }

  const LogoutButtonContent = (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={logoutMutation.isPending}
      onClick={showConfirmDialog ? () => setOpen(true) : handleLogout}
    >
      {logoutMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        showIcon && <LogOut className="h-4 w-4 mr-2" />
      )}
      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
    </Button>
  )

  if (!showConfirmDialog) {
    return LogoutButtonContent
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {LogoutButtonContent}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to sign in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} disabled={logoutMutation.isPending}>
            {logoutMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Logging out...
              </>
            ) : (
              'Logout'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LogoutButton
