import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { AdminGuard } from "@/components/dashboard/admin-guard"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Shield, Activity, AlertCircle } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getDashboardStats() {
  const [userCount, roleCount, activeUsers] = await Promise.all([
    prisma.user.count(),
    prisma.role.count(),
    prisma.user.count({
      where: {
        status: 'ACTIVE'
      }
    })
  ])

  return {
    userCount,
    roleCount,
    activeUsers,
    inactiveUsers: userCount - activeUsers
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <AdminGuard>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          总用户数
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.userCount}</div>
                        <p className="text-xs text-muted-foreground">
                          系统中注册的用户总数
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          活跃用户
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">
                          当前活跃的用户数量
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          角色数量
                        </CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.roleCount}</div>
                        <p className="text-xs text-muted-foreground">
                          系统中的角色类型数量
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          非活跃用户
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stats.inactiveUsers}</div>
                        <p className="text-xs text-muted-foreground">
                          被禁用或非活跃的用户
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="px-4 lg:px-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>快速操作</CardTitle>
                        <CardDescription>
                          常用的管理操作
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-2">
                        <a 
                          href="/dashboard/users/create"
                          className="flex items-center justify-between p-3 text-sm border rounded-lg hover:bg-muted transition-colors"
                        >
                          <span>添加新用户</span>
                          <Users className="h-4 w-4" />
                        </a>
                        <a 
                          href="/dashboard/roles/create"
                          className="flex items-center justify-between p-3 text-sm border rounded-lg hover:bg-muted transition-colors"
                        >
                          <span>创建新角色</span>
                          <Shield className="h-4 w-4" />
                        </a>
                        <a 
                          href="/dashboard/users"
                          className="flex items-center justify-between p-3 text-sm border rounded-lg hover:bg-muted transition-colors"
                        >
                          <span>管理用户</span>
                          <Users className="h-4 w-4" />
                        </a>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>系统信息</CardTitle>
                        <CardDescription>
                          平台运行状态概览
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>系统状态</span>
                            <span className="text-green-600">正常运行</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>数据库状态</span>
                            <span className="text-green-600">连接正常</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>版本</span>
                            <span className="text-muted-foreground">v1.0.0</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  )
} 