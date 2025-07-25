import type * as React from "react"
import { Users, Clock, UserCheck, UserX, Tags } from "lucide-react"
import logo from "../assets/ptb_black.png"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Users,
    description: "Go to dashboard",
  },
  {
    title: "Check In",
    url: "/check-in",
    icon: UserCheck,
    description: "Check in a visitor",
  },
  {
    title: "Pending Visits",
    url: "/pending",
    icon: Clock,
    count: 3,
    description: "Visitors awaiting approval",
  },
  {
    title: "Staff Directory",
    url: "/staff",
    icon: Users,
    count: 43,
    description: "View staff members",
  },
  {
    title: "Tags",
    url: "/tags",
    icon: Tags,
    count: 100,
    description: "Manage visitor tags",
  },
  {
    title: "All Visitors",
    url: "/visitors",
    icon: UserX,
    count: 300,
    description: "View all visitors",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="inset"
      className="w-68 min-w-0 px-2 border-r border-gray-100 -mt-2 bg-black"
      {...props}
    >
      <SidebarHeader className="px-2 bg-black h-16 border-b border-gray-800">
        <SidebarMenu className="bg-black">
          <SidebarMenuItem className="bg-black hover:bg-transparent ">
            <SidebarMenuButton size="sm" asChild className="h-12 hover:bg-transparent">
              <a href="/" className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="w- h-8" />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sm text-white">PremiumTrust Bnak</span>
                  <span className="text-xs text-gray-300">Visitor Management</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-black pt-5">
        <SidebarGroup className="bg-black">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="bg-black ">
                  <SidebarMenuButton className="hover:bg-gray-800 h-12" asChild tooltip={item.description}>
                    <a href={item.url} className="flex items-center gap-2 text-sm text-white hover:text-white ">
                      <item.icon className="size-4 text-white" />
                      <span className="flex-1 font-semibol">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {
                    item.count ? (
                      <SidebarMenuBadge className="bg-blue-500 text-white mt-2.5 hover:text-white">
                        {item.count}
                      </SidebarMenuBadge>
                    ) : null
                  }
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail className="bg-black" />
    </Sidebar>
  )
}
