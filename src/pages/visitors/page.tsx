"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {  Search, User, Clock, CheckCircle, XCircle, LogOut } from "lucide-react"
import CustomHeader from "@/components/custom_header"
import { Link } from "react-router"

export default function AllVisitors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const visitors = [
    {
      id: "V001",
      name: "John Smith",
      company: "Tech Corp",
      status: "pending",
      checkInTime: "10:30 AM",
      hostName: "Sarah Johnson",
      purpose: "Business Meeting",
    },
    {
      id: "V002",
      name: "Sarah Johnson",
      company: "Design Studio",
      status: "checked-in",
      checkInTime: "10:15 AM",
      hostName: "Mike Wilson",
      purpose: "Consultation",
    },
    {
      id: "V003",
      name: "Mike Wilson",
      company: "Marketing Inc",
      status: "checked-out",
      checkInTime: "09:45 AM",
      checkOutTime: "11:30 AM",
      hostName: "Emily Davis",
      purpose: "Job Interview",
    },
    {
      id: "V004",
      name: "Emily Davis",
      company: "Consulting LLC",
      status: "rejected",
      checkInTime: "10:45 AM",
      hostName: "John Smith",
      purpose: "Business Meeting",
    },
    {
      id: "V005",
      name: "Robert Brown",
      company: "Tech Solutions",
      status: "checked-in",
      checkInTime: "11:00 AM",
      hostName: "Lisa Chen",
      purpose: "Maintenance",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "checked-in":
        return <CheckCircle className="w-4 h-4" />
      case "checked-out":
        return <LogOut className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "checked-in":
        return "bg-green-100 text-green-800"
      case "checked-out":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCheckout = async (visitId: string) => {
    // Simulate API call to POST /api/visit/checkout
    console.log("Checking out visitor:", visitId)
  }

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.hostName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || visitor.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen max-w-7xl mx-auto ">
      {/* <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/" className="mr-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">All Visitors</h1>
              <p className="text-gray-600">View and manage all visitor records</p>
            </div>
            <Link href="/check-in">
              <Button>New Check-in</Button>
            </Link>
          </div>
        </div>
      </div> */}

      <CustomHeader title={""} subTitle={""} page={"visitor"} />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search visitors, companies, or hosts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="checked-in">Checked In</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredVisitors.map((visitor) => (
            <Card key={visitor.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between w-full">
                   <div className="flex items-start gap-2">
                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex flex-col items-start justify-start">
                        <h3 className="text-lg font-semibold text-gray-900">{visitor.name}</h3>
                        <div>
                          <span className="font-medium">Company:</span> {visitor.company}
                        </div>
                    </div>
                   </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Host:</span> {visitor.hostName}
                        </div>
                        <div>
                          <span className="font-medium">Purpose:</span> {visitor.purpose}
                        </div>
                        <div>
                          <span className="font-medium">Check-in:</span> {visitor.checkInTime}
                          {visitor.checkOutTime && (
                            <span className="block">
                              <span className="font-medium">Check-out:</span> {visitor.checkOutTime}
                            </span>
                          )}
                        </div>
                         <Badge className={`w-fit ${getStatusColor(visitor.status)}`}>
                          {getStatusIcon(visitor.status)}
                          <span className="ml-1 capitalize">{visitor.status.replace("-", " ")}</span>
                        </Badge>
                    </div>
                     <div className="flex gap-2">
                    {visitor.status === "checked-in" && (
                      <Button onClick={() => handleCheckout(visitor.id)} variant="outline" size="sm">
                        <LogOut className="w-4 h-4 mr-2" />
                        Check Out
                      </Button>
                    )}
                    <Link to={`/visitors/${visitor.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    </div>
                  </div>
              </CardContent>
            </Card>
          ))}
          {filteredVisitors.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No visitors found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== "all"
                    ? "No visitors match your search criteria."
                    : "No visitors have been registered yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
