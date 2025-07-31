import { useState, useEffect } from 'react'
import Layout from "../layout"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { toast } from "sonner"
import apiClient from "@/lib/apiConfig"
import { useSearchParams } from 'react-router'

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
    tagNumber: null;
    phone: string;
    email: string;
    address: string;
    comments: string;
    formattedVisitId: string;
}

const StaffAccept = () => {

    const [searchParams] = useSearchParams();
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, [name, email]);

  const fetchVisitors = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/staff/pending-visits?name=${name}&email=${email}`);
      if (response.status === 200) {
        setVisitors(response.data);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
      toast.error("Failed to fetch visitors");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (visitorId: string) => {
    try {
      await apiClient.post(`/staff/approve-visitor/${visitorId}`);
      toast.success("Visitor approved successfully");
      setVisitors(visitors.filter(visitor => visitor.id !== visitorId));
    } catch (error) {
      console.error("Error approving visitor:", error);
      toast.error("Failed to approve visitor");
    }
  };

  const handleReject = async (visitorId: string) => {
    try {
      await apiClient.post(`/staff/reject-visitor/${visitorId}`);
      toast.success("Visitor rejected successfully");
      setVisitors(visitors.filter(visitor => visitor.id !== visitorId));
    } catch (error) {
      console.error("Error rejecting visitor:", error);
      toast.error("Failed to reject visitor");
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
       <div className='mb-6'>
            <h1 className="text-2xl font-bold ">Hey {visitors[0]?.staffName}</h1>
            <p>You have {visitors.length < 2 ? "a" : "some"} visitors</p>
       </div>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : visitors.length === 0 ? (
          <div className="text-center">No pending visitors</div>
        ) : (
          <div className="space-y-4">
            {visitors.map((visitor) => (
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
                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={() => handleApprove(visitor.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleReject(visitor.id)}
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default StaffAccept