"use client"

import { useState } from "react"
import { Scanner } from "@yudiel/react-qr-scanner" // Changed from QrScanner to Scanner (default import)
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"

interface QrScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScan: (result: string) => void
}

export function QrScannerModal({ isOpen, onClose, onScan }: QrScannerModalProps) {
  const [isScanning, setIsScanning] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleScan = (result: any) => {
    if (result && result.length > 0) {
      // The result is typically an array, get the first result
      const scannedText = result[0]?.rawValue || result[0]?.text || result[0] || result
      if (scannedText) {
        onScan(scannedText)
        onClose()
        setIsScanning(false)
      }
    }
  }

  const handleError = (error: any) => {
    console.error("QR Scanner Error:", error)
    setError("Failed to access camera. Please check permissions.")
  }

  const handleClose = () => {
    setIsScanning(false)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Scan QR Code
          </DialogTitle>
          <DialogDescription>Position the QR code within the camera view to scan the customer code.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <div className="text-center py-8">
              <div className="text-destructive text-sm mb-4">{error}</div>
              <Button
                onClick={() => {
                  setError(null)
                  setIsScanning(true)
                }}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg border">
              {isScanning && (
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: "environment",
                  }}
                  styles={{
                    container: {
                      width: "100%",
                      height: "100%",
                    },
                    video: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  }}
                />
              )}
            </div>
          )}

          <div className="flex justify-center">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
