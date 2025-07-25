"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tag, Plus, Edit, Trash2, User } from "lucide-react"
import CustomHeader from "@/components/custom_header"

export default function TagManagement() {
  const [newTag, setNewTag] = useState({ name: "", color: "blue", type: "visitor" })
  const [assignTag, setAssignTag] = useState({ visitId: "", tagId: "" })

  const tags = [
    { id: "T001", name: "VIP", color: "purple", type: "visitor", count: 5 },
    { id: "T002", name: "Contractor", color: "orange", type: "visitor", count: 12 },
    { id: "T003", name: "Interview", color: "green", type: "purpose", count: 8 },
    { id: "T004", name: "Delivery", color: "blue", type: "purpose", count: 15 },
    { id: "T005", name: "Maintenance", color: "red", type: "purpose", count: 6 },
  ]

  const visitors = [
    { id: "V001", name: "John Smith", company: "Tech Corp", status: "checked-in" },
    { id: "V002", name: "Sarah Johnson", company: "Design Studio", status: "pending" },
    { id: "V003", name: "Mike Wilson", company: "Marketing Inc", status: "checked-in" },
  ]

  const getColorClass = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
      orange: "bg-orange-100 text-orange-800",
      purple: "bg-purple-100 text-purple-800",
      gray: "bg-gray-100 text-gray-800",
    }
    return colors[color as keyof typeof colors] || colors.gray
  }

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call to create tag
    console.log("Creating tag:", newTag)
    setNewTag({ name: "", color: "blue", type: "visitor" })
  }

  const handleAssignTag = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call to POST /api/visit/assign-tag
    console.log("Assigning tag:", assignTag)
    setAssignTag({ visitId: "", tagId: "" })
  }

  const handleEditTag = async (tagId: string) => {
    // Simulate API call to PUT /api/visit/edit-tag/{visitId}
    console.log("Editing tag:", tagId)
  }

  const handleDeleteTag = async (tagId: string) => {
    console.log("Deleting tag:", tagId)
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto">
     <CustomHeader title={""} subTitle={""} page={"tag"} />

      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Existing Tags</CardTitle>
                <CardDescription>Manage your visitor and purpose tags</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Tag className="w-5 h-5 text-gray-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className={getColorClass(tag.color)}>{tag.name}</Badge>
                            <span className="text-sm text-gray-500 capitalize">({tag.type})</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{tag.count} visitors assigned</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditTag(tag.id)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteTag(tag.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Tag</CardTitle>
                <CardDescription>Add a new tag for visitors</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTag} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tagName">Tag Name</Label>
                    <Input
                      id="tagName"
                      value={newTag.name}
                      onChange={(e) => setNewTag((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter tag name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagColor">Color</Label>
                    <Select
                      value={newTag.color}
                      onValueChange={(value) => setNewTag((prev) => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="gray">Gray</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagType">Type</Label>
                    <Select
                      value={newTag.type}
                      onValueChange={(value) => setNewTag((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visitor">Visitor</SelectItem>
                        <SelectItem value="purpose">Purpose</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Tag
                  </Button>
                </form>
              </CardContent>
            </Card>

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
                    <Label htmlFor="tag">Select Tag</Label>
                    <Select
                      value={assignTag.tagId}
                      onValueChange={(value) => setAssignTag((prev) => ({ ...prev, tagId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {tags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              {tag.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
    </div>
  )
}
