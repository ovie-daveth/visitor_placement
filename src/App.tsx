import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/page'
import Dashboard from './pages/dashboard/page'
import CheckIn from './pages/check-in/page'
import PendingVisits from './pages/pending/page'
import StaffDirectory from './pages/staff/page'
import TagManagement from './pages/tags/page'
import AllVisitors from './pages/visitors/page'
import CheckInVisitors from './pages/check-in-visits/page'
import CheckOutVisitors from './pages/checked-out-visits/page'
import StaffAccept from './pages/staff-accept/page'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/check-in" element={<CheckIn />} />
      <Route path="/pending" element={<PendingVisits />} />
      <Route path="/staff" element={<StaffDirectory />} />
      <Route path="/tags" element={<TagManagement />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/visitors" element={<AllVisitors />} />
      <Route path="/check-in-visits" element={<CheckInVisitors />} />
      <Route path="/check-out-visits" element={<CheckOutVisitors />} />
      <Route path="/staff-accept" element={<StaffAccept />} />

    </Routes>
  )
}

export default App
