"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tag, Plus, Edit, Trash2, User } from "lucide-react"
import Layout from "../layout"

interface UsedTag {
  id: number;
  visitorId: string;
  visitorName: string;
}

export default function TagManagement() {
  const [assignTag, setAssignTag] = useState({ visitId: "", tagId: "" })
  const [usedTags, setUsedTags] = useState<UsedTag[]>([])
  const [nextAvailableTag, setNextAvailableTag] = useState(1)

  const visitors = [
    { id: "V001", name: "John Smith", company: "Tech Corp", status: "checked-in" },
    { id: "V002", name: "Sarah Johnson", company: "Design Studio", status: "pending" },
    { id: "V003", name: "Mike Wilson", company: "Marketing Inc", status: "checked-in" },
  ]

  useEffect(() => {
    // Update the next available tag whenever usedTags changes
    const usedTagNumbers = usedTags.map(tag => tag.id)
    let nextTag = 1
    while (usedTagNumbers.includes(nextTag)) {
      nextTag++
    }
    setNextAvailableTag(nextTag)
  }, [usedTags])

  const handleAssignTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (assignTag.visitId) {
      const visitor = visitors.find(v => v.id === assignTag.visitId)
      if (visitor) {
        // Add to used tags
        setUsedTags(prev => [...prev, {
          id: nextAvailableTag,
          visitorId: visitor.id,
          visitorName: visitor.name
        }])
        
        setAssignTag({ visitId: "", tagId: "" })
      }
    }
  }

  const handleUnassignTag = (tagId: number) => {
    // Remove from used tags
    setUsedTags(prev => prev.filter(tag => tag.id !== tagId))
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
                <div className="space-y-4">
                  {usedTags.map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Tag className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Tag {tag.id}</Badge>
                            <span className="text-sm text-gray-500">{tag.visitorName}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Visitor ID: {tag.visitorId}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleUnassignTag(tag.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {usedTags.length === 0 && (
                    <p className="text-center text-gray-500">No tags currently assigned.</p>
                  )}
                </div>
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
                <form onSubmit={handleAssignTag} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="visitor">Select Visitor</Label>
                    <Select
                      value={assignTag.visitId}
                      onValueChange={(value) => setAssignTag((prev) => ({ ...prev, visitId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a visitor" />
                      </SelectTrigger>
                      <SelectContent>
                        {visitors.map((visitor) => (
                          <SelectItem key={visitor.id} value={visitor.id}>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {visitor.name} - {visitor.company}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}