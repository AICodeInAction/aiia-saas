"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LogOut, User } from "lucide-react"

interface SiteHeaderProps {
  breadcrumbs?: {
    title: string
    href?: string
  }[]
}

export function SiteHeader({ breadcrumbs = [] }: SiteHeaderProps) {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">
                后台管理
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.title} className="flex items-center">
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  {breadcrumb.href && index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink href={breadcrumb.href}>
                      {breadcrumb.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="ml-auto flex items-center gap-2 px-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">
            {session?.user?.name || session?.user?.email}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          <span className="sr-only">退出登录</span>
        </Button>
      </div>
    </header>
  )
} 