"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, User, Clock, CheckCircle, XCircle, LogOut, List, LayoutGrid, Table as TableIcon } from "lucide-react"
import Layout from "../layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function AllVisitors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [view, setView] = useState<"grid" | "list" | "table">("grid")
  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

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
    <Layout>
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
          <div className="flex gap-2 items-center">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("list")}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </Button>
            <Button
              variant={view === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("table")}
              aria-label="Table view"
            >
              <TableIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Dialog for visitor details */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            {selectedVisitor && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedVisitor.name}</DialogTitle>
                  <DialogDescription>
                    <span className="text-xs text-gray-500">Host: {selectedVisitor.hostName}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 mt-2">
                  <div><b>Company:</b> {selectedVisitor.company}</div>
                  <div><b>Purpose:</b> {selectedVisitor.purpose}</div>
                  <div><b>Status:</b> <Badge className={getStatusColor(selectedVisitor.status)}>{getStatusIcon(selectedVisitor.status)} <span className="ml-1 capitalize">{selectedVisitor.status.replace("-", " ")}</span></Badge></div>
                  <div><b>Check-in:</b> {selectedVisitor.checkInTime}</div>
                  {selectedVisitor.checkOutTime && <div><b>Check-out:</b> {selectedVisitor.checkOutTime}</div>}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {view === "table" ? (
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Host</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Check-out</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900">{visitor.name}</td>
                    <td className="px-4 py-10">{visitor.company}</td>
                    <td className="px-4 py-10">{visitor.hostName}</td>
                    <td className="px-4 py-10">{visitor.purpose}</td>
                    <td className="px-4 py-10">{visitor.checkInTime}</td>
                    <td className="px-4 py-10">{visitor.checkOutTime || "-"}</td>
                    <td className="px-4 py-10">
                      <Badge className={`w-fit ${getStatusColor(visitor.status)}`}>
                        {getStatusIcon(visitor.status)}
                        <span className="ml-1 capitalize">{visitor.status.replace("-", " ")}</span>
                      </Badge>
                    </td>
                    <td className="px-4 py-10 flex gap-2">
                      {visitor.status === "checked-in" && (
                        <Button onClick={() => handleCheckout(visitor.id)} variant="outline" size="sm">
                          <LogOut className="w-4 h-4 mr-2" />
                          Check Out
                        </Button>
                      )}

                        <Button
                         onClick={() => {
                          setSelectedVisitor(visitor)
                          setDialogOpen(true)
                      }}
                        variant="outline" size="sm">
                          View Details
                        </Button>
                    </td>
                  </tr>
                ))}
                {filteredVisitors.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      No visitors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={
            view === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          }>
            {filteredVisitors.map((visitor) => (
              <Card key={visitor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Top section: Avatar, Name, Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{visitor.name}</h3>
                        <p className="text-sm text-gray-600">{visitor.purpose}</p>
                        <p className="text-xs text-gray-500">Host: {visitor.hostName}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(visitor.status)}>
                      {getStatusIcon(visitor.status)}
                      <span className="ml-1 capitalize">{visitor.status.replace("-", " ")}</span>
                    </Badge>
                  </div>

                  {/* Details section */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Company:</span> {visitor.company}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Check-in:</span> {visitor.checkInTime}
                      {visitor.checkOutTime && (
                        <>
                          <span className="mx-2">|</span>
                          <span className="font-medium">Check-out:</span> {visitor.checkOutTime}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    {visitor.status === "checked-in" && (
                      <Button onClick={() => handleCheckout(visitor.id)} variant="outline" size="sm" className="flex-1 bg-transparent">
                        <LogOut className="w-4 h-4 mr-2" />
                        Check Out
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        setSelectedVisitor(visitor)
                        setDialogOpen(true)
                      }}
                    >
                      View Details
                    </Button>
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
        )}
      </div>
    </Layout>
  )
}
