import { PrismaClient } from '@prisma/client'
import { ROLES } from '../lib/permissions'

const prisma = new PrismaClient()

async function assignAdminRole(email: string) {
  try {
    console.log(`正在为用户 ${email} 分配管理员角色...`)

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`用户 ${email} 不存在`)
      return
    }

    // 查找管理员角色
    const adminRole = await prisma.role.findUnique({
      where: { name: ROLES.ADMIN },
    })

    if (!adminRole) {
      console.error('管理员角色不存在，请先运行 seed 脚本')
      return
    }

    // 检查是否已经有该角色
    const existingUserRole = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: adminRole.id,
        },
      },
    })

    if (existingUserRole) {
      console.log(`用户 ${email} 已经是管理员`)
      return
    }

    // 分配角色
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: adminRole.id,
      },
    })

    console.log(`成功为用户 ${email} 分配管理员角色`)
  } catch (error) {
    console.error('分配角色失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 从命令行参数获取邮箱
const email = process.argv[2]

if (!email) {
  console.error('请提供用户邮箱: pnpm tsx scripts/assign-admin.ts user@example.com')
  process.exit(1)
}

assignAdminRole(email) 