import { PrismaClient } from '@prisma/client'
import { ROLES, ROLE_PERMISSIONS } from '../lib/permissions'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据...')

  // 创建角色
  const adminRole = await prisma.role.upsert({
    where: { name: ROLES.ADMIN },
    update: {},
    create: {
      name: ROLES.ADMIN,
      description: '系统管理员，拥有所有权限',
      permissions: ROLE_PERMISSIONS[ROLES.ADMIN],
    },
  })

  const userRole = await prisma.role.upsert({
    where: { name: ROLES.USER },
    update: {},
    create: {
      name: ROLES.USER,
      description: '普通用户，拥有基础权限',
      permissions: ROLE_PERMISSIONS[ROLES.USER],
    },
  })

  console.log('角色创建完成:', { adminRole, userRole })
}

main()
  .catch((e) => {
    console.error('种子数据初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 