import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { LayoutWrapper } from "@/components/navigation/layout-wrapper"
import "./globals.css"

export const metadata: Metadata = {
  title: "Loyalty CMS",
  description: "Content Management System for Loyalty Programs",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
