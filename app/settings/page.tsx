import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3FF] to-[#EDE9FE] dark:from-background dark:to-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Configure application settings and preferences
          </p>
        </div>
        
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-lg p-8">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Application Settings</h3>
            <p className="text-muted-foreground">
              This feature is coming soon. You'll be able to configure application settings here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
