import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/page'
import Dashboard from './pages/dashboard/page'
import CheckIn from './pages/check-in/page'
import PendingVisits from './pages/pending/page'
import StaffDirectory from './pages/staff/page'
import TagManagement from './pages/tags/page'
import AllVisitors from './pages/visitors/page'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/contact" element={<CheckIn />} />
      <Route path="/pending" element={<PendingVisits />} />
      <Route path="/staff" element={<StaffDirectory />} />
      <Route path="/tags" element={<TagManagement />} />
      <Route path="/check-in" element={<CheckIn />} />
      <Route path="visitors" element={<AllVisitors />} />

    </Routes>
  )
}

export default App
