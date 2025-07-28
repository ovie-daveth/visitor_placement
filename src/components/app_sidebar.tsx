import type * as React from "react";
import { useState, useEffect } from "react";
import { Users, Clock, UserCheck, UserX, Tags } from "lucide-react";
import logo from "../assets/ptb_black.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import apiClient from "@/lib/apiConfig";
import type { PaginatedVisits, VisitorDataInterface } from "@/interfaces/visitors";

// Define MenuItem interface
interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  count?: number;
}

// Custom hook to fetch visit counts
const useVisitCounts = () => {
  const [counts, setCounts] = useState<Record<string, number>>({
    Pending: 0,
    Approved: 0,
    CheckedOut: 0,
    all: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const statuses = ["Pending", "Approved", "CheckedOut", "all"];
        const promises = statuses.map((status) =>
          status === "all"
            ? apiClient.get<PaginatedVisits<VisitorDataInterface[]>>("/visits")
            : apiClient.get<PaginatedVisits<VisitorDataInterface[]>>(
                `/visits?status=${status}`
              )
        );
        const responses = await Promise.all(promises);
        const newCounts = statuses.reduce((acc, status, index) => {
          acc[status] = responses[index].status === 200 || responses[index].status === 201
            ? (responses[index].data as PaginatedVisits<VisitorDataInterface[]>).total
            : 0;
          return acc;
        }, {} as Record<string, number>);
        console.log("Visit counts fetched:", newCounts);
        setCounts(newCounts);
      } catch (err) {
        setError("Failed to fetch visit counts");
        console.error("Error fetching visits:", err);
        setCounts({});
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return { counts, loading, error };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { counts, loading, error } = useVisitCounts();

  // Define menu items with dynamic counts

  console.log("Counts:", counts.Pending, counts.Approved, counts.CheckedOut, counts.all);
  const menuItems: MenuItem[] = [
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
      count: counts.Pending || 0,
      description: "Visitors awaiting approval",
    },
    {
      title: "Checked in Visits",
      url: "/checked-in/visits",
      icon: Clock,
      count: counts.Approved || 0,
      description: "Visitors currently checked in",
    },
    {
      title: "Checked out Visits",
      url: "/checked-out",
      icon: Clock,
      count: counts.CheckedOut || 0,
      description: "Visitors who have checked out",
    },
    {
      title: "Staff Directory",
      url: "/staff",
      icon: Users,
      count: 43, // Placeholder; consider fetching dynamically
      description: "View staff members",
    },
    {
      title: "Tags",
      url: "/tags",
      icon: Tags,
      count: 100, // Placeholder; consider fetching dynamically
      description: "Manage visitor tags",
    },
    {
      title: "All Visitors",
      url: "/visitors",
      icon: UserX,
      count: counts.all || 0,
      description: "View all visitors",
    },
  ];

  return (
    <Sidebar
      variant="inset"
      className="w-68 min-w-0 px-2 border-r border-gray-100 -mt-2 bg-black"
      {...props}
    >
      <SidebarHeader className="px-2 bg-black h-16 border-b border-gray-800">
        <SidebarMenu className="bg-black">
          <SidebarMenuItem className="bg-black hover:bg-transparent">
            <SidebarMenuButton
              size="sm"
              asChild
              className="h-12 hover:bg-transparent"
            >
              <a href="/" className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="w-8 h-8" />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sm text-white">
                    PremiumTrust Bank
                  </span>
                  <span className="text-xs text-gray-300">
                    Visitor Management
                  </span>
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
                <SidebarMenuItem key={item.title} className="bg-black">
                  <SidebarMenuButton
                    className="hover:bg-gray-800 h-12"
                    asChild
                    tooltip={item.description}
                  >
                    <a
                      href={item.url}
                      className="flex items-center gap-2 text-sm text-white hover:text-white"
                    >
                      <item.icon className="size-4 text-white" />
                      <span className="flex-1 font-semibold">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.count !== undefined && (
                    <SidebarMenuBadge className="bg-blue-500 text-white mt-2.5 hover:text-white">
                      {loading ? "..." : error ? "Error" : item.count}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail className="bg-black" />
    </Sidebar>
  );
}