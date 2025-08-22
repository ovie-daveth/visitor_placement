"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, User, Clock, CheckCircle, XCircle, LogOut, List, LayoutGrid, Table as TableIcon, Loader2 } from "lucide-react"
import Layout from "../layout"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import type { PaginatedVisits, VisitorDataInterface } from "@/interfaces/visitors"
import apiClient from "@/lib/apiConfig"
import Pagination from '@/components/Pagination';
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

export default function CheckOutVisitors() {
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"grid" | "list" | "table">("grid")
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorDataInterface | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [allVisits, setAllVisits] = useState<VisitorDataInterface[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [totalPages, setTotalPages] = useState(1)

  const GetAllVisits = async () => {
    try {
      setIsLoading(true)
      const fromDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
      const toDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

       var response;
       
      if(fromDate && toDate) {
        response = await apiClient.get(`/visits?page=${pageIndex}&pageSize=${10}&status=CheckedOut&search=${searchTerm}&from=${fromDate}&to=${toDate}`)
      }
      response = await apiClient.get(`/visits?page=${pageIndex}&pageSize=${10}&status=CheckedOut&search=${searchTerm}`)
      if (response.status === 200 || response.status === 201) {
        console.log("Fetched visits:", response.data)
        const paginatedVisits = response.data as PaginatedVisits<VisitorDataInterface[]>
        setTotalPages(paginatedVisits.totalPages)
        setAllVisits(paginatedVisits.data)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        console.error("Failed to fetch visits:", response.statusText)
        toast.error("Failed to fetch visits. Please try again later.")
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching visits:", error)
      toast.error("Failed to fetch visits. Please try again later.")
    }
  }

  useEffect(() => {
    GetAllVisits()
  }, [pageIndex, searchTerm, dateRange.from, dateRange.to])

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

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  const filteredVisitors = allVisits.filter((visitor) => {
    const matchesSearch =
      visitor.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor?.staffName?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[300px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(newDateRange) => {
                  if (newDateRange) {
                    setDateRange({
                      from: newDateRange.from,
                      to: newDateRange.to
                    });
                  } else {
                    setDateRange({ from: undefined, to: undefined });
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
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
                  <DialogTitle>{selectedVisitor.visitorName}</DialogTitle>
                  <DialogDescription>
                    <span className="text-xs text-gray-500">Host: {selectedVisitor.staffName}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 mt-2">
                  <div><b>Purpose:</b> {selectedVisitor.purpose}</div>
                  <div><b>Status:</b> <Badge className={getStatusColor(selectedVisitor.status)}>{getStatusIcon(selectedVisitor.status)} <span className="ml-1 capitalize">{selectedVisitor.status.replace("-", " ")}</span></Badge></div>
                  <div><b>Check-in:</b> {selectedVisitor.checkInTime && new Date(selectedVisitor.checkInTime).toLocaleString()}</div>
                  {selectedVisitor.checkOutTime && <div><b>Check-out:</b> {new Date(selectedVisitor.checkOutTime).toLocaleString()}</div>}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {view === "table" ? (
              <>
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
                          <td className="px-4 py-2 font-medium text-gray-900">{visitor.visitorName}</td>
                          <td className="px-4 py-10">Tag: {visitor.purpose}</td>
                          <td className="px-4 py-10">{visitor.staffName}</td>
                          <td className="px-4 py-10">{visitor.purpose}</td>
                          <td className="px-4 py-10">{visitor.checkInTime && new Date(visitor.checkInTime).toLocaleString()}</td>
                          <td className="px-4 py-10">{visitor.checkOutTime? new Date(visitor.checkOutTime).toLocaleString() : "-"}</td>
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
                <Pagination
                  currentPage={pageIndex}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <>
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
                              <h3 className="text-lg font-semibold text-gray-900">{visitor.visitorName}</h3>
                              <p className="text-sm text-gray-600">{visitor.purpose}</p>
                              <p className="text-xs text-gray-500">Host: {visitor.staffName}</p>
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
                            <span className="font-medium">Tag:</span> {visitor.tagNumber || "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium">Check-in:</span> {visitor.checkInTime &&new Date(visitor.checkInTime).toLocaleString()}
                            {visitor.checkOutTime && (
                              <>
                                <span className="mx-2">|</span>
                                <span className="font-medium">Check-out:</span> {new Date(visitor.checkOutTime).toLocaleString()}
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
                          {searchTerm ||  dateRange.from || dateRange.to
                            ? "No visitors match your search criteria."
                            : "No visitors have been registered yet."}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <Pagination
                  currentPage={pageIndex}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}