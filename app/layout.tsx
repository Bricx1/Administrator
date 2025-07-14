import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { RoleBasedNavigation } from "@/components/role-based-navigation"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "M.A.S.E - Medical Administrative Staffing Excellence",
  description: "Comprehensive healthcare staffing management system with AI-powered OASIS quality assurance",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <RoleBasedNavigation />
          <main className="flex-1 bg-gray-50 lg:ml-64">{children}</main>
        </div>
      </body>
    </html>
  )
}
