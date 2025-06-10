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
import { Plus, Shield, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

async function getRoles() {
  return await prisma.role.findMany({
    include: {
      _count: {
        select: {
          userRoles: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function RolesPage() {
  const roles = await getRoles()

  const breadcrumbs = [
    { title: "角色管理" }
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
                          <CardTitle>角色列表</CardTitle>
                          <CardDescription>
                            管理系统中的所有角色和权限
                          </CardDescription>
                        </div>
                        <Link href="/dashboard/roles/create">
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            添加角色
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>角色名称</TableHead>
                            <TableHead>描述</TableHead>
                            <TableHead>权限</TableHead>
                            <TableHead>用户数量</TableHead>
                            <TableHead>操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {roles.map((role) => (
                            <TableRow key={role.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Shield className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{role.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-muted-foreground">
                                  {role.description || '无描述'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {(role.permissions as string[]).slice(0, 3).map((permission) => (
                                    <Badge key={permission} variant="outline" className="text-xs">
                                      {permission}
                                    </Badge>
                                  ))}
                                  {(role.permissions as string[]).length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{(role.permissions as string[]).length - 3} 更多
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{role._count.userRoles}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Link href={`/dashboard/roles/${role.id}`}>
                                    <Button variant="outline" size="sm">
                                      编辑
                                    </Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {roles.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <div className="text-muted-foreground">
                                  暂无角色数据
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