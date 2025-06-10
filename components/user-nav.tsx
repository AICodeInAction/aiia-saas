'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function UserNav() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex space-x-4">
        <Link 
          href="/auth/login"
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          登录
        </Link>
        <Link 
          href="/auth/register"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          注册
        </Link>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-700">
        欢迎，{session?.user?.name || session?.user?.email}
      </span>
      <Link 
        href="/auth/change-password"
        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      >
        修改密码
      </Link>
      <button
        onClick={handleSignOut}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        退出登录
      </button>
    </div>
  )
} 