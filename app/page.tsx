"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

export default function HomePage() {
  const router = useRouter()
  const { token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (token) {
      router.push("/users")
    } else {
      router.push("/login")
    }
  }, [token, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
}
