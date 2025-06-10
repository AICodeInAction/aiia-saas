import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { AdminGuard } from "@/components/dashboard/admin-guard"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Mail, Calendar } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

async function getUsers() {
  return await prisma.user.findMany({
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
}

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    ACTIVE: { variant: "default" as const, label: "活跃" },
    INACTIVE: { variant: "secondary" as const, label: "非活跃" },
    BANNED: { variant: "destructive" as const, label: "禁用" },
  }
  
  const config = variants[status as keyof typeof variants] || variants.ACTIVE
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}

export default async function UsersPage() {
  const users = await getUsers()

  const breadcrumbs = [
    { title: "用户管理" }
  ]

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
          <SiteHeader breadcrumbs={breadcrumbs} />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>用户列表</CardTitle>
                          <CardDescription>
                            管理系统中的所有用户
                          </CardDescription>
                        </div>
                        <Link href="/dashboard/users/create">
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            添加用户
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>用户信息</TableHead>
                            <TableHead>角色</TableHead>
                            <TableHead>状态</TableHead>
                            <TableHead>注册时间</TableHead>
                            <TableHead>操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                      <Mail className="h-4 w-4 text-gray-500" />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-medium">{user.name || '未设置'}</div>
                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {user.userRoles.map((userRole) => (
                                    <Badge key={userRole.role.id} variant="outline">
                                      {userRole.role.name}
                                    </Badge>
                                  ))}
                                  {user.userRoles.length === 0 && (
                                    <Badge variant="secondary">无角色</Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={user.status} />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  {format(user.createdAt, "PPP", { locale: zhCN })}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Link href={`/dashboard/users/${user.id}`}>
                                    <Button variant="outline" size="sm">
                                      编辑
                                    </Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {users.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <div className="text-muted-foreground">
                                  暂无用户数据
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  )
} 