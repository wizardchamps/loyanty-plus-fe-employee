"use client"

import * as React from "react"
import { Upload, X, ImageIcon } from 'lucide-react'
import { cn } from "@/lib/utils"

interface FileUploadProps {
  value?: File | null
  onChange: (file: File | null) => void
  accept?: string
  maxSize?: number
  className?: string
  error?: string
}

export function FileUpload({
  value,
  onChange,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  error
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const [preview, setPreview] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (value && value instanceof File) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(value)
    } else {
      setPreview(null)
    }
  }, [value])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.size <= maxSize && file.type.startsWith('image/')) {
        onChange(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      onChange(file)
    }
  }

  const removeFile = () => {
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border",
          error ? "border-destructive" : "",
          "hover:border-primary hover:bg-primary/5"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {preview ? (
          <div className="relative">
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="w-full aspect-square object-cover rounded-md"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
              {dragActive ? (
                <Upload className="h-full w-full" />
              ) : (
                <ImageIcon className="h-full w-full" />
              )}
            </div>
            <div className="text-sm">
              <span className="font-medium text-primary">Click to upload</span>
              <span className="text-muted-foreground"> or drag and drop</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, GIF up to 5MB (Square format recommended)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}
    </div>
  )
}
