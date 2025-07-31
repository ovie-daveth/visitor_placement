"use client"

import type React from "react"
import { useRef, useState, useCallback } from "react"
import Webcam from "react-webcam"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, X } from "lucide-react"
import {Link} from "react-router-dom"
import apiClient from "@/lib/apiConfig"
import Layout from "../layout"

export default function CheckIn() {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    base64Image: "",
    staffName: "",
    purpose: "",
    status: "",
    belongings: "",
    comments: "",
  })

  const webcamRef = useRef<Webcam>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true)
  try {
     console.log("Checking in visitor:", formData)
    const response = await apiClient.post('/visit/check-in', formData); // Empty string since baseURL is already set
    console.log('Check-in successful:', response.data);
    if (response.status === 201 || response.status === 200) {
      setIsLoading(false)
      alert("Visitor checked-in successfully!")
      // Reset form or redirect
    }
    // Optionally reset form or redirect
  } catch (error: any) {
    console.error('Check-in failed:', error.message);
    setIsLoading(false)
    alert(`Error: ${error.message}`);
  }
};

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }


  const startCamera = () => {
    setIsCameraActive(true)
  }

  const stopCamera = () => {
    setIsCameraActive(false)
  }

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      if (imageSrc) {
        setFormData((prev) => ({ ...prev, base64Image: imageSrc }))
        stopCamera()
      }
    }
  }, [webcamRef])

  return (
    <Layout>
       <div className="text-left">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="lg:text-2xl text-lg font-bold">Visitor Information</CardTitle>
                  <CardDescription className="">Please fill in the visitor details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter address"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose of Visit *</Label>
                    <Select onValueChange={(value) => handleInputChange("purpose", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose of visit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Business Meeting</SelectItem>
                        <SelectItem value="interview">Job Interview</SelectItem>
                        <SelectItem value="delivery">Delivery</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="staffName">Staff Name *</Label>
                      <Input
                        id="staffName"
                        value={formData.staffName}
                        onChange={(e) => handleInputChange("staffName", e.target.value)}
                        placeholder="Enter staff name"
                        required
                      />
                    </div>
                   <div className="space-y-2">
                    <Label htmlFor="belongings">Belongings</Label>
                    <Input
                      id="belongings"
                      value={formData.belongings}
                      onChange={(e) => handleInputChange("belongings", e.target.value)}
                      placeholder="List any belongings"
                    />
                  </div>

                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comments">Additional Comments</Label>
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) => handleInputChange("comments", e.target.value)}
                      placeholder="Any additional information..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="lg:text-2xl text-lg font-bold">Visitor Photo</CardTitle>
                  <CardDescription>Take a photo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    {formData.base64Image && (
                      <div>
                        <img src={formData.base64Image} alt="Visitor" className="mx-auto mb-4 max-w-full h-auto" />
                        <Button type="button" onClick={() => setFormData(prev => ({ ...prev, base64Image: "" }))} variant="outline" className="mt-2">
                          Remove Photo
                        </Button>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 mb-4">
                      {formData.base64Image ? "Photo captured" : "No photo captured"}
                    </p>
                    <div className="space-y-2">
                      <Button type="button" onClick={startCamera} className="w-full">
                        <Camera className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                      {/* <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => document.getElementById('upload-photo')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <input
                        id="upload-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      /> */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isCameraActive && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Capture Photo</h2>
                      <Button type="button" onClick={stopCamera} variant="ghost">
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width="100%"
                      videoConstraints={{
                        facingMode: "user",
                      }}
                      className="mb-4"
                    />
                    <div className="space-y-2">
                      <Button type="button" onClick={capturePhoto} className="w-full">Take Photo</Button>
                      <Button type="button" onClick={stopCamera} variant="outline" className="w-full">Cancel</Button>
                    </div>
                  </div>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Check-in Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="submit" className="w-full bg-red-600" size="lg">
                   {
                    isLoading ? "Checking in..." : "Complete Check-in" 
                   }
                  </Button>
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Save as Draft
                  </Button>
                  <Link to="/" className="block">
                    <Button type="button" variant="ghost" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
       </div>
    </Layout>
  )
}