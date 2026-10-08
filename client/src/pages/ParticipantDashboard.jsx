import { useEffect, useState } from "react";

function ParticipantDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/registrations/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load dashboard");
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Participant Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            View your event activity and registrations.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Total Registrations</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {dashboard.totalRegistrations}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Upcoming Events</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {dashboard.upcomingEvents}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Attended Events</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-600">
              {dashboard.attendedEvents}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">Cancelled</p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {dashboard.cancelledRegistrations}
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Recent Registrations
          </h2>

          {dashboard.recentRegistrations.length === 0 ? (
            <p className="text-gray-500">
              You have no registrations yet.
            </p>
          ) : (
            <div className="space-y-4">
              {dashboard.recentRegistrations.map((registration) => (
                <div
                  key={registration._id}
                  className="flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {registration.event?.title || "Event unavailable"}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {registration.event?.location || "Location unavailable"}
                    </p>

                    {registration.event?.startDate && (
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(
                          registration.event.startDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      registration.status === "attended"
                        ? "bg-green-100 text-green-700"
                        : registration.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {registration.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParticipantDashboard;