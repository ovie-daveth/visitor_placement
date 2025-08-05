"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tag } from "lucide-react"
import Layout from "../layout"
import apiClient from "@/lib/apiConfig"
import type { IPendingVisitors, IvisitorWithTag } from "@/interfaces/visitors"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
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

export default function TagManagement() {
  const [assignTag, setAssignTag] = useState({ visitId: "", tagId: "" })
  const [nextAvailableTag, setNextAvailableTag] = useState(1)
  const [pendingVisits, setPendingVisits] = useState<IPendingVisitors[]>([])
  const [visitorsWithTags, setVisitorsWithTags] = useState<IvisitorWithTag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    const fetchPendingVisits = async () => {
      setIsLoading(true)
      try {
        const response  = await apiClient.get("/reception/pending-visits")
        if(response.status === 200 || response.status === 201) {
          console.log("Pending visits fetched successfully:", response.data)
          setPendingVisits(response.data)
          setIsLoading(false)
        } else {
          console.error("Failed to fetch pending visits:", response.statusText)
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
        console.error("Error fetching pending visits:", error)
      }
    }
    fetchPendingVisits()
  }, [])

  const fetchVisitorsWithTags = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get("/visit/with-tags")
      if (response.status === 200 || response.status === 201) {
        console.log("Visitors with tags fetched successfully:", response.data)
        const visitorsData = response.data as IvisitorWithTag[]
        setVisitorsWithTags(visitorsData)

        // Calculate the next available tag number
        const usedTagNumbers = visitorsData
          .map(visitor => visitor.tagNumber ? parseInt(visitor.tagNumber) : null)
          .filter((num): num is number => num !== null && !isNaN(num))
        const nextAvailable = usedTagNumbers.length > 0 ? Math.max(...usedTagNumbers) + 1 : 1
        setNextAvailableTag(nextAvailable)

        setIsLoading(false)
      } else {
        console.error("Failed to fetch visitors with tags:", response.statusText)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching visitors with tags:", error)
    }
  }

  useEffect(() => {
    fetchVisitorsWithTags()
  }, []) 

  console.log("assign", assignTag)

  const handleAssignTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (assignTag.visitId) {
      const selectedVisit = pendingVisits.find(visit => visit.id === assignTag.visitId)
      if (!selectedVisit || !selectedVisit.barcodeUrl) {
        toast.error("Selected visit does not have a valid barcode.")
        return
      }

      try {
        setIsLoading(true)
        const response = await apiClient.post(`/visit/assign-tag`, {
          barcode: selectedVisit.barcodeUrl,
          tagNumber: nextAvailableTag.toString()
        })

        if (response.status === 200 || response.status === 201) {
          console.log("Tag assigned successfully:", response.data)
          
          // Reset the assignTag state
          setAssignTag({ visitId: "", tagId: "" })

          // Close the popover
          setOpen(false)

          // Show success message
          toast.success("Tag assigned successfully")

          // Fetch updated visitors with tags
          await fetchVisitorsWithTags()

          // Update the pendingVisits state
          setPendingVisits(prev => prev.filter(visit => visit.id !== assignTag.visitId))
        } else {
          console.error("Failed to assign tag:", response.statusText)
          toast.error("Failed to assign tag. Please try again.")
        }
      } catch (error) {
        console.error("Error assigning tag:", error)
        toast.error("An error occurred while assigning the tag. Please try again.")
      } finally {
        setIsLoading(false)
      }
    } else {
      toast.error("Please select a visitor before assigning a tag.")
    }
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Used Tags</CardTitle>
                <CardDescription>Manage your assigned visitor tags</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  // Skeleton loading for Used Tags
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3 w-full">
                          <Skeleton className="w-5 h-5 rounded-full" />
                          <div className="w-full">
                            <div className="flex items-center gap-2">
                              <Skeleton className="w-16 h-6" />
                              <Skeleton className="w-24 h-4" />
                            </div>
                            <Skeleton className="w-32 h-4 mt-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Existing content for Used Tags
                  <div className="space-y-4">
                    {visitorsWithTags.map((tag) => (
                      <div key={tag.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Tag className="w-5 h-5 text-gray-500" />
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Tag {tag.id}</Badge>
                              <span className="text-sm text-gray-500">{tag.visitorName}</span>
                            </div>
                            <p className="text-sm mt-1">
                              Status: <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tag.status)}`}>{tag.status}</span>
                            </p>
                          </div>
                        </div>
                        {/* <Button variant="outline" size="sm" onClick={() => handleUnassignTag(tag.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button> */}
                      </div>
                    ))}
                    {visitorsWithTags.length === 0 && (
                      <p className="text-center text-gray-500">No tags currently assigned.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assign Tag</CardTitle>
                <CardDescription>Assign a tag to a visitor</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  // Skeleton loading for Assign Tag form
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="w-20 h-4" />
                      <Skeleton className="w-full h-10" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-full h-10" />
                    </div>
                    <Skeleton className="w-full h-10" />
                  </div>
                ) : (
                  // Existing form for assigning tags
                  <form onSubmit={handleAssignTag} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="visitor">Select Visitor</Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                          >
                            {assignTag.visitId
                              ? pendingVisits.find((visit) => visit.id === assignTag.visitId)?.visitorName
                              : "Select visitor..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search visitor..."
                              value={searchValue}
                              onValueChange={setSearchValue}
                            />
                            <CommandEmpty>No visitor found.</CommandEmpty>
                            <CommandGroup>
                              {pendingVisits
                                .filter((visit) =>
                                  visit.visitorName?.toLowerCase().includes(searchValue.toLowerCase())
                                )
                                .map((visit) => (
                                  <CommandItem
                                    key={visit.id}
                                    value={visit.id}
                                    onSelect={(currentValue) => {
                                      setAssignTag((prev) => ({ ...prev, visitId: currentValue }))
                                      setOpen(false)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        assignTag.visitId === visit.id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={visit.faceImageUrl}
                                        alt={visit.visitorName}
                                        className="w-5 h-5 rounded-full"
                                      />
                                      {visit.visitorName}
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tag">Next Available Tag</Label>
                      <Input
                        id="tag"
                        value={nextAvailableTag}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Tag className="w-4 h-4 mr-2" />
                      Assign Tag
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}