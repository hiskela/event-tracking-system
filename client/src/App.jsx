import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import QRScannerTest from "./pages/QRScannerTest";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import MyRegistrations from "./pages/MyRegistrations";
import Ticket from "./pages/Ticket";
import AdminOrganizerRequests from "./pages/AdminOrganizerRequests";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OrganizerRequest from "./pages/OrganizerRequest";
import Home from "./pages/Home";
import OrganizerEvents from "./pages/OrganizerEvents";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import ManageEvent from "./pages/ManageEvent";
import EditEvent from "./pages/EditEvent";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import RegisterEvent from "./pages/RegisterEvent";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/qr-test" element={<QRScannerTest />} />
        <Route
          path="/participant/dashboard"
          element={<ParticipantDashboard />}
        />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route
  path="/events/:id/register"
  element={<RegisterEvent />}
/>
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/organizer/events/create" element={<CreateEvent />} />
        <Route path="/organizer/events" element={<OrganizerEvents />} />
        <Route
          path="/participant/organizer-request"
          element={<OrganizerRequest />}
        />
        <Route
          path="/admin/organizer-requests"
          element={<AdminOrganizerRequests />}
        />
        <Route
          path="/participant/my-registrations"
          element={<MyRegistrations />}
        />
        <Route path="/participant/ticket/:id" element={<Ticket />} />
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/organizer/events/:id" element={<ManageEvent />} />
        <Route path="/organizer/events/:id/edit" element={<EditEvent />} />
      </Routes>
    </>
  );
}

export default App;
