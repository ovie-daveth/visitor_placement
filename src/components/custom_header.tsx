"use client"

import {Link, useNavigate} from 'react-router-dom'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import ptb_logo from '../assets/ptb_logo.png'

const CustomHeader = ({page}: {title: string, subTitle: string, page: string}) => {

    const router = useNavigate()
    const handleBack = () => {
        router(-1) // Navigate back to the previous page or route
    }
  return (
     <div className="px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center py-6  justify-between`}>
            <div className='flex items-start gap-3'>
                    <div className='flex items-center gap-4'>
                        <div className=''>
                            <img src={ptb_logo} alt="ptb_logo" width={50} height={100} className='w-40' />
                        </div>
                    </div>
            </div>
            <div className="flex gap-3">
             {
              page !== "checkin" ?  <Link to="/check-in">
                <Button>New Check-in</Button>
              </Link> : <Button onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
             }
             {
              page !== "visitor" ?  <Link to="/visitors">
                <Button variant="outline">View All Visitors</Button>
              </Link> : <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
             }
            </div>
          </div>
        </div>
  )
}

export default CustomHeader

//    <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Visitor Management</h1>
//               <p className="text-gray-600">Welcome to the visitor management dashboard</p>
//             </div>
            
//           </div>
//         </div>
//       </div>