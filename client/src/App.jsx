import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import QRScannerTest from './pages/QRScannerTest'
import ParticipantDashboard from './pages/ParticipantDashboard'
import MyRegistrations from './pages/MyRegistrations'
import Ticket from './pages/Ticket'
import Login from "./pages/Login"
import Register from './pages/Register'
import OrganizerDashboard from './pages/OrganizerDashboard'
function App() {

  return (
    <>

 <Routes>
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
     <Route path="/qr-test" element={<QRScannerTest />} /> 
<Route
        path="/participant/dashboard"
        element={<ParticipantDashboard />}
      />
<Route
  path="/participant/my-registrations"
  element={<MyRegistrations />}
/>
<Route
  path="/participant/ticket/:id"
  element={<Ticket />}
/>
<Route
  path="/organizer/dashboard"
  element={<OrganizerDashboard />}
/>
 </Routes>
    </>
  )
}

export default App
