"use client"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { AdminGuard } from "@/components/dashboard/admin-guard"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Role {
  id: string
  name: string
  description: string | null
}

export default function CreateUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: 'ACTIVE',
    roleId: '',
  })
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const breadcrumbs = [
    { title: "用户管理", href: "/dashboard/users" },
    { title: "添加用户" }
  ]

  useEffect(() => {
    // 获取角色列表
    fetch('/api/roles')
      .then(res => res.json())
      .then(data => setRoles(data.roles || []))
      .catch(err => console.error('获取角色失败:', err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors({ general: data.error || '创建失败' })
        }
        return
      }

      router.push('/dashboard/users')
    } catch {
      setErrors({ general: '网络错误，请稍后重试' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

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
                  <Card className="max-w-2xl">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Link href="/dashboard/users">
                          <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                        </Link>
                        <div>
                          <CardTitle>添加新用户</CardTitle>
                          <CardDescription>
                            创建新的系统用户账户
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {errors.general && (
                          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            {errors.general}
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="name">姓名</Label>
                          <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="请输入用户姓名"
                          />
                          {errors.name && (
                            <p className="text-sm text-red-600">{errors.name}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">邮箱</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="请输入邮箱地址"
                          />
                          {errors.email && (
                            <p className="text-sm text-red-600">{errors.email}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password">密码</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="请输入密码（至少6位）"
                          />
                          {errors.password && (
                            <p className="text-sm text-red-600">{errors.password}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status">状态</Label>
                          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择用户状态" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">活跃</SelectItem>
                              <SelectItem value="INACTIVE">非活跃</SelectItem>
                              <SelectItem value="BANNED">禁用</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.status && (
                            <p className="text-sm text-red-600">{errors.status}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="roleId">角色</Label>
                          <Select value={formData.roleId} onValueChange={(value) => handleInputChange('roleId', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择用户角色（可选）" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name} {role.description && `- ${role.description}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.roleId && (
                            <p className="text-sm text-red-600">{errors.roleId}</p>
                          )}
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? '创建中...' : '创建用户'}
                          </Button>
                          <Link href="/dashboard/users">
                            <Button type="button" variant="outline">
                              取消
                            </Button>
                          </Link>
                        </div>
                      </form>
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