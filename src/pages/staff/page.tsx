"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, User, Mail, Phone, Building } from "lucide-react"
import Layout from "../layout"

export default function StaffDirectory() {
  const [searchTerm, setSearchTerm] = useState("")

  const staff = [
    {
      id: "S001",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      department: "Engineering",
      position: "Senior Developer",
      status: "available",
      currentVisitors: 2,
    },
    {
      id: "S002",
      name: "Mike Wilson",
      email: "mike.wilson@company.com",
      phone: "+1 (555) 234-5678",
      department: "Marketing",
      position: "Marketing Manager",
      status: "busy",
      currentVisitors: 1,
    },
    {
      id: "S003",
      name: "Emily Davis",
      email: "emily.davis@company.com",
      phone: "+1 (555) 345-6789",
      department: "HR",
      position: "HR Director",
      status: "available",
      currentVisitors: 0,
    },
    {
      id: "S004",
      name: "Lisa Chen",
      email: "lisa.chen@company.com",
      phone: "+1 (555) 456-7890",
      department: "Design",
      position: "Lead Designer",
      status: "in-meeting",
      currentVisitors: 1,
    },
    {
      id: "S005",
      name: "Robert Brown",
      email: "robert.brown@company.com",
      phone: "+1 (555) 567-8901",
      department: "Sales",
      position: "Sales Director",
      status: "available",
      currentVisitors: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-orange-100 text-orange-800"
      case "in-meeting":
        return "bg-red-100 text-red-800"
      case "away":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSearch = async () => {
    // Simulate API call to GET /api/staff/search
    console.log("Searching staff:", searchTerm)
  }

  return (
    <Layout >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search staff by name, department, position, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.position}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(member.status)}>{member.status.replace("-", " ")}</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    {member.department}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Visitors:</span>
                    <Badge variant="secondary">{member.currentVisitors}</Badge>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredStaff.length === 0 && (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-12 text-center">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? "No staff members match your search criteria." : "No staff members are available."}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
