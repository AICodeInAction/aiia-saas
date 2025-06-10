import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { isAdmin } from '@/lib/permissions'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { isAdmin: false, message: '用户未登录' },
        { status: 401 }
      )
    }

    const hasAdminAccess = await isAdmin(session.user.id)
    
    return NextResponse.json({
      isAdmin: hasAdminAccess,
      userId: session.user.id,
    })
  } catch (error) {
    console.error('检查管理员权限失败:', error)
    return NextResponse.json(
      { isAdmin: false, message: '权限检查失败' },
      { status: 500 }
    )
  }
} 