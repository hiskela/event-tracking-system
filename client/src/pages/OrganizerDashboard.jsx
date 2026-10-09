import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrganizerDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/events/organizer-dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load organizer dashboard"
          );
        }

        setDashboard(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
          <p className="text-lg text-gray-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
          <p className="text-center text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          ← Back
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Organizer Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Manage your events and track your participants.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-gray-500">
              Total Events
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {dashboard.totalEvents}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-gray-500">
              Published Events
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {dashboard.publishedEvents}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-gray-500">
              Registrations
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {dashboard.totalRegistrations}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm text-gray-500">
              Attendees
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-600">
              {dashboard.totalAttendees}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Events
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your recently created events.
            </p>
          </div>

          {dashboard.recentEvents.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
              <p className="text-gray-500">
                You have not created any events yet.
              </p>

              <button
                onClick={() => navigate("/organizer/events/create")}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard.recentEvents.map((event) => (
                <div
                  key={event._id}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-gray-900">
                      {event.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {event.category?.name || "No category"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {event.location}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      event.status === "published"
                        ? "bg-green-100 text-green-700"
                        : event.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : event.status === "completed"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default OrganizerDashboard;