"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Tag, Inbox } from "lucide-react"
import { Link } from "react-router-dom"
import Layout from "../layout"
import type { PaginatedVisits, VisitorDataInterface } from "@/interfaces/visitors"
import { useEffect, useState } from "react"
import apiClient from "@/lib/apiConfig"

export default function Dashboard() {
  const [allVisits, setAllVisits] = useState<VisitorDataInterface[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const GetAllVisits = async () => {
    try {
      setIsLoading(true)

      const response = await apiClient.get(`/visits`)

      if (response.status === 200 || response.status === 201) {
        const paginatedVisits = response.data as PaginatedVisits<VisitorDataInterface[]>
        setAllVisits(paginatedVisits.data)
      } else {
        console.error("Failed to fetch visits:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching visits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    GetAllVisits()
  }, [])

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
    <Layout>
      <main className="ml-0 transition-all relative">
        <div className="mx-auto px-0 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            <Card>
              <CardHeader>
                <CardTitle>Recent Visits</CardTitle>
                <CardDescription>Latest visitor activity</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : allVisits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Inbox className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recent visits</h3>
                    <p className="text-sm text-gray-500">
                      There are no recent visits to display at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allVisits.map((visit) => (
                      <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{visit.visitorName}</p>
                              <p className="text-sm text-gray-600">TagNumber: {visit.tagNumber}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{visit.updatedAt && new Date(visit.updatedAt).toLocaleString()}</span>
                          <Badge className={getStatusColor(visit.status)}>{visit.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </Layout>
  )
}