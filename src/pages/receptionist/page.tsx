import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { CalendarIcon, Search, Tag } from "lucide-react"
import { toast } from "sonner"
import apiClient from "@/lib/apiConfig"
import { useSearchParams } from 'react-router'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from "date-fns"
import { Calendar } from '@/components/ui/calendar'
import Pagination from '@/components/Pagination'
import { Label } from '@/components/ui/label'
import type { IvisitorWithTag } from '@/interfaces/visitors'

interface Visitor {
    id: string;
    visitorName: string;
    staffName: string;
    staffEmail: string;
    purpose: string;
    status: string;
    faceImageUrl: string;
    barcodeUrl: string;
    checkInTime: string;
    tagNumber: string | null; // Change this to allow both string and null
    phone: string;
    email: string;
    address: string;
    comments: string;
    formattedVisitId: string;
}

const ReceptionistAccept = () => {

    const [searchParams] = useSearchParams();
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
      const [pageIndex, setPageIndex] = useState(0)
      const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
      })
    const [searchTerm, setSearchTerm] = useState("")
    const [totalPages, setTotalPages] = useState(1)
      const [nextAvailableTag, setNextAvailableTag] = useState(1)

useEffect(() => {
  fetchVisitors();
}, [name, email, pageIndex, searchTerm, dateRange.from, dateRange.to]);

 const fetchVisitors = async () => {
  setIsLoading(true);
  try {
    const fromDate = dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
    const toDate = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''

    const url = `/visits?page=${pageIndex}&pageSize=10&status=Approved&search=${searchTerm}${fromDate ? `&from=${fromDate}` : ''}${toDate ? `&to=${toDate}` : ''}`;
    const response = await apiClient.get(url);

    if (response.status === 200) {
      if (Array.isArray(response.data.data)) {
        setVisitors(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      } else {
        console.error("Unexpected response format:", response.data);
        setVisitors([]);
      }
    }
  } catch (error) {
    console.error("Error fetching visitors:", error);
    toast.error("Failed to fetch visitors");
    setVisitors([]);
  } finally {
    setIsLoading(false);
  }
};

  const fetchVisitorsWithTags = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get("/visit/with-tags")
      if (response.status === 200 || response.status === 201) {
        console.log("Visitors with tags fetched successfully:", response.data)
        const visitorsData = response.data as IvisitorWithTag[]
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

    const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

const filteredVisitors = Array.isArray(visitors) ? visitors.filter((visitor) => {
  const matchesSearch =
    visitor.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor?.staffName?.toLowerCase().includes(searchTerm.toLowerCase());
  const hasNoTag = visitor.tagNumber === null || visitor.tagNumber === "";
  return matchesSearch && hasNoTag;
}) : [];

const handleAssignTag = async (visitorId: string, barcodeUrl: string) => {
  if (!barcodeUrl) {
    toast.error("Selected visit does not have a valid barcode.")
    return
  }

  console.log("barcodeUrl", barcodeUrl)

  try {
    setIsLoading(true)
    const response = await apiClient.post(`/visit/assign-tag`, {
      barcode: barcodeUrl,
      tagNumber: nextAvailableTag.toString()
    })

    if (response.status === 200 || response.status === 201) {
      console.log("Tag assigned successfully:", response.data)
      
      // Show success message
      toast.success("Tag assigned successfully")

      // Fetch updated visitors with tags
      await fetchVisitorsWithTags()

      // Remove the visitor from the list
      setVisitors(prev => prev.filter(visit => visit.id !== visitorId))

      // Increment the next available tag
      setNextAvailableTag(prev => prev + 1)

      // Refresh the visitors list
      fetchVisitors()
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
}


  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-[90%] mx-auto">
       <div className='mb-6'>
            <h1 className="text-2xl font-bold ">Hey Receptionist</h1>
            <p>You have {filteredVisitors.length < 2 ? "a" : "some"} visitors that have been approved by staff</p>
       </div>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : filteredVisitors.length === 0 ? (
          <div className="text-center">No pending visitors</div>
        ) : (
          <>
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
        </div>
          <div className="space-y-4">
            {filteredVisitors.map((visitor) => (
              <div key={visitor.id} className="flex overflow-hidden p-5">
                <div className="w-1/4 min-w-[100px] rounded-2xl">
                  <img 
                    src={visitor.faceImageUrl} 
                    alt={visitor.visitorName} 
                    width={200}
                    height={200}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="flex-1 p-4 flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">{visitor.visitorName}</h2>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {visitor.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {visitor.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Check-in:</span> {new Date(visitor.checkInTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Purpose:</span> {visitor.purpose}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Comments:</span> {visitor.comments}
                    </p>
                  </div>
                    <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tag">Add Tag</Label>
                      <Input
                        id="tag"
                        value={nextAvailableTag}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>

                    <Button
                    onClick={() => handleAssignTag(visitor.id, visitor.barcodeUrl)}
                    disabled={visitor.tagNumber !== null || isLoading}
                    className="w-full cursor-pointer"
                     type="submit">
                      <Tag className="w-4 h-4 mr-2" />
                      Assign Tag
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
            <Pagination
                  currentPage={pageIndex}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
          </>
        )}
      </div>
  )
}

export default ReceptionistAccept