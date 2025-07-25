"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Check, X, Clock, User, Building, Phone, Mail } from "lucide-react"
import CustomHeader from "@/components/custom_header"

export default function PendingVisits() {
  const [searchTerm, setSearchTerm] = useState("")

  const pendingVisits = [
    {
      id: "V001",
      name: "John Smith",
      email: "john.smith@techcorp.com",
      phone: "+1 (555) 123-4567",
      company: "Tech Corp",
      purpose: "Business Meeting",
      hostName: "Sarah Johnson",
      checkInTime: "10:30 AM",
      expectedDuration: "2 hours",
      notes: "Meeting about new project proposal",
    },
    {
      id: "V004",
      name: "Emily Davis",
      email: "emily.davis@consulting.com",
      phone: "+1 (555) 987-6543",
      company: "Consulting LLC",
      purpose: "Consultation",
      hostName: "Mike Wilson",
      checkInTime: "10:45 AM",
      expectedDuration: "1 hour",
      notes: "Strategic planning consultation",
    },
    {
      id: "V007",
      name: "Robert Brown",
      email: "robert.brown@design.com",
      phone: "+1 (555) 456-7890",
      company: "Design Studio",
      purpose: "Job Interview",
      hostName: "Lisa Chen",
      checkInTime: "11:15 AM",
      expectedDuration: "1 hour",
      notes: "Senior Designer position interview",
    },
  ]

  const handleApprove = async (visitId: string) => {
    // Simulate API call to POST /api/visit/approve/{visitId}
    console.log("Approving visit:", visitId)
  }

  const handleReject = async (visitId: string) => {
    // Simulate API call to POST /api/visit/reject/{visitId}
    console.log("Rejecting visit:", visitId)
  }

  const filteredVisits = pendingVisits.filter(
    (visit) =>
      visit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.hostName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen max-w-7xl mx-auto ">
      
    <CustomHeader title="" subTitle="" page="pending" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search visitors, companies, or hosts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredVisits.map((visit) => (
            <Card key={visit.id} className="hover:shadow-md transition-shadow text-left">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{visit.name}</h3>
                        <p className="text-gray-600">{visit.company}</p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {visit.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {visit.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building className="w-4 h-4" />
                        Host: {visit.hostName}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Purpose</p>
                        <p className="text-sm text-gray-600">{visit.purpose}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Check-in Time</p>
                        <p className="text-sm text-gray-600">{visit.checkInTime}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Expected Duration</p>
                        <p className="text-sm text-gray-600">{visit.expectedDuration}</p>
                      </div>
                    </div>

                    {visit.notes && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-1">Notes</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{visit.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                   <div className="flex items-center gap-3">
                     <Button onClick={() => handleApprove(visit.id)} className="bg-green-600 hover:bg-green-700">
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button onClick={() => handleReject(visit.id)} variant="destructive">
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                   </div>
                    <Button onClick={() => handleApprove(visit.id)} className="bg-blue-600 hover:bg-green-700">
                      <Check className="w-4 h-4 mr-2" />
                      Send reminder mail
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredVisits.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending visits</h3>
                <p className="text-gray-600">
                  {searchTerm ? "No visits match your search criteria." : "All visits have been processed."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
