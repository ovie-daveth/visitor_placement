"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, UserCheck, UserX, Tag } from "lucide-react"
import {Link} from "react-router-dom"
import CustomHeader from "@/components/custom_header"

export default function Dashboard() {
  const stats = [
    { title: "Pending Visits", value: "12", icon: Clock, color: "text-orange-600" },
    { title: "Checked In", value: "8", icon: UserCheck, color: "text-green-600" },
    { title: "Total Today", value: "25", icon: Users, color: "text-blue-600" },
    { title: "Rejected", value: "2", icon: UserX, color: "text-red-600" },
  ]

  const recentVisits = [
    { id: "V001", name: "John Smith", company: "Tech Corp", status: "pending", time: "10:30 AM" },
    { id: "V002", name: "Sarah Johnson", company: "Design Studio", status: "approved", time: "10:15 AM" },
    { id: "V003", name: "Mike Wilson", company: "Marketing Inc", status: "checked-in", time: "09:45 AM" },
    { id: "V004", name: "Emily Davis", company: "Consulting LLC", status: "pending", time: "10:45 AM" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "checked-in":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-7xl mx-auto  min-h-screen ">
      <CustomHeader title="Visitor Management" subTitle="Welcome to your dashboard" page="home" />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          <Card>
            <CardHeader>
              <CardTitle>Recent Visits</CardTitle>
              <CardDescription>Latest visitor activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVisits.map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{visit.name}</p>
                          <p className="text-sm text-gray-600">{visit.company}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{visit.time}</span>
                      <Badge className={getStatusColor(visit.status)}>{visit.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/pending" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Clock className="w-4 h-4 mr-2" />
                  Review Pending Visits
                </Button>
              </Link>
              <Link to="/tags" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Tag className="w-4 h-4 mr-2" />
                  Manage Visitor Tags
                </Button>
              </Link>
              <Link to="/staff" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="w-4 h-4 mr-2" />
                  Staff Directory
                </Button>
              </Link>
              <Link to="/reports" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <UserCheck className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
