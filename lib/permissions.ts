import { prisma } from "@/lib/prisma"

// 权限常量定义
export const PERMISSIONS = {
  // 用户管理权限
  USER_READ: 'user:read',
  USER_CREATE: 'user:create', 
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // 角色管理权限
  ROLE_READ: 'role:read',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update', 
  ROLE_DELETE: 'role:delete',
  
  // 系统管理权限
  SYSTEM_ADMIN: 'system:admin',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

// 预定义角色
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const

// 角色权限映射
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.ROLE_READ,
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE,
    PERMISSIONS.SYSTEM_ADMIN,
  ],
  [ROLES.USER]: [
    PERMISSIONS.USER_READ, // 普通用户只能查看用户信息
  ],
}

/**
 * 获取用户的所有权限
 */
export async function getUserPermissions(userId: string): Promise<Permission[]> {
  const userWithRoles = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  })

  if (!userWithRoles) {
    return []
  }

  const permissions = new Set<Permission>()
  
  for (const userRole of userWithRoles.userRoles) {
    const rolePermissions = userRole.role.permissions as Permission[]
    rolePermissions.forEach(permission => permissions.add(permission))
  }

  return Array.from(permissions)
}

/**
 * 检查用户是否有特定权限
 */
export async function hasPermission(userId: string, permission: Permission): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId)
  return userPermissions.includes(permission)
}

/**
 * 检查用户是否是管理员
 */
export async function isAdmin(userId: string): Promise<boolean> {
  return await hasPermission(userId, PERMISSIONS.SYSTEM_ADMIN)
}

/**
 * 检查用户是否有某个角色
 */
export async function hasRole(userId: string, roleName: string): Promise<boolean> {
  const userRole = await prisma.userRole.findFirst({
    where: {
      userId,
      role: {
        name: roleName,
      },
    },
  })

  return !!userRole
}

/**
 * 为用户分配角色
 */
export async function assignRole(userId: string, roleId: string): Promise<void> {
  await prisma.userRole.create({
    data: {
      userId,
      roleId,
    },
  })
}

/**
 * 移除用户角色
 */
export async function removeRole(userId: string, roleId: string): Promise<void> {
  await prisma.userRole.deleteMany({
    where: {
      userId,
      roleId,
    },
  })
} 