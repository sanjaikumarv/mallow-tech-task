import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { StoreProvider } from "@/store/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "User Management App",
  description: "A comprehensive user management application with CRUD operations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
