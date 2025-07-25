import { AppSidebar } from "@/components/app_sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowLeft } from "lucide-react"
import React from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"

const breadcrumbNameMap: Record<string, string> = {
  "/": "Dashboard",
  "/visits": "All Visits",
  "/visits/pending": "Pending Visits",
  "/visits/checked-in": "Checked In",
  "/visits/checked-out": "Checked Out",
  "/tags": "Tags",
  // Add more routes as needed
}

export default function Layout({children}: {children: React.ReactNode}) {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)
     const router = useNavigate()
    const handleBack = () => {
        router(-1) // Navigate back to the previous page or route
    }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="shadow-none border-none rounded-none">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 shadow-none border-none rounded-none">
          <div className="flex items-center justify-between w-full gap-2 px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathnames.map((value, index) => {
                  const to = `/${pathnames.slice(0, index + 1).join("/")}`
                  const isLast = index === pathnames.length - 1
                  return (
                    <React.Fragment key={to}>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>
                            {breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1)}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={to}>
                              {breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1)}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
            </div>
             <div className="flex gap-3">
            {
              !location.pathname.includes("check-in") ? (
                <Link to="/check-in">
                  <Button>New Check-in</Button>
                </Link>
              ) : (
                <Button onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )
            }
            {
              !location.pathname.includes("visitors") ? (
                <Link to="/visitors">
                  <Button variant="outline">View All Visitors</Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )
            }
            </div>
          </div>
        </header>
        { children}
      </SidebarInset>
    </SidebarProvider>
  )
}
