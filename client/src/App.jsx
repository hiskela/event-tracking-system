import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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
import AdminUsers from "./pages/AdminUsers";
import AdminEvents from "./pages/AdminEvents";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/qr-test" element={<QRScannerTest />} />

      {/* Signed-in participants and organizers */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["participant", "organizer"]} />
        }
      >
        <Route path="/my-registrations" element={<MyRegistrations />} />
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="/events/:id/register" element={<RegisterEvent />} />
      </Route>

      {/* Participant pages */}
      <Route
        element={<ProtectedRoute allowedRoles={["participant"]} />}
      >
        <Route
          path="/participant/dashboard"
          element={<ParticipantDashboard />}
        />
        <Route
          path="/participant/organizer-request"
          element={<OrganizerRequest />}
        />
      </Route>

      {/* Organizer pages */}
      <Route
        element={<ProtectedRoute allowedRoles={["organizer"]} />}
      >
        <Route
          path="/organizer/dashboard"
          element={<OrganizerDashboard />}
        />
        <Route path="/organizer/events" element={<OrganizerEvents />} />
        <Route
          path="/organizer/events/create"
          element={<CreateEvent />}
        />
        <Route
          path="/organizer/events/:id"
          element={<ManageEvent />}
        />
        <Route
          path="/organizer/events/:id/edit"
          element={<EditEvent />}
        />
      </Route>

      {/* Admin pages */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route
          path="/admin/organizer-requests"
          element={<AdminOrganizerRequests />}
        />
      </Route>

      {/* Keep the old registrations URL working */}
      <Route
        path="/participant/my-registrations"
        element={<Navigate to="/my-registrations" replace />}
      />


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;