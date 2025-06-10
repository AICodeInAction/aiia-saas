"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPermissions = async () => {
      if (status === "loading") return

      if (!session?.user?.id) {
        router.push('/auth/login?callbackUrl=/dashboard')
        return
      }

      try {
        const response = await fetch('/api/auth/check-admin')
        const data = await response.json()
        
        if (!data.isAdmin) {
          router.push('/?error=unauthorized')
          return
        }
        setIsAuthorized(true)
      } catch (error) {
        console.error('权限检查失败:', error)
        router.push('/?error=permission-check-failed')
      } finally {
        setIsLoading(false)
      }
    }

    checkPermissions()
  }, [session, status, router])

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
} 