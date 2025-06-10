import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BANNED']).default('ACTIVE'),
  roleId: z.string().optional(),
})

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const hasReadPermission = await hasPermission(session.user.id, PERMISSIONS.USER_READ)
    if (!hasReadPermission) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      users,
      count: users.length,
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }

    const hasCreatePermission = await hasPermission(session.user.id, PERMISSIONS.USER_CREATE)
    if (!hasCreatePermission) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, email, password, status, roleId } = createUserSchema.parse(body)

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // 如果指定了角色，验证角色是否存在
    if (roleId) {
      const role = await prisma.role.findUnique({
        where: { id: roleId }
      })

      if (!role) {
        return NextResponse.json(
          { error: '指定的角色不存在' },
          { status: 400 }
        )
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status,
      },
    })

    // 如果指定了角色，分配角色
    if (roleId) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId,
        },
      })
    }

    // 返回用户信息（不包含密码）
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: '用户创建成功',
        user: userWithoutPassword 
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path[0]] = err.message
        }
      })
      return NextResponse.json(
        { error: '表单验证失败', errors },
        { status: 400 }
      )
    }

    console.error('创建用户失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 