import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function ManageEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/events/${id}/registrations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch event information"
          );
        }

        setEvent(data.event);
        setRegistrations(data.registrations);
        setStats(data.stats);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (message || !event || !stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <button
            onClick={() => navigate("/organizer/events")}
            className="mb-6 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to My Events
          </button>

          <div className="rounded-xl bg-red-50 p-5 text-red-700">
            {message || "Event information is unavailable."}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Active Registrations",
      value: stats.totalRegistrations,
      color: "text-blue-600",
    },
    {
      label: "Awaiting Check-in",
      value: stats.registeredCount,
      color: "text-amber-600",
    },
    {
      label: "Attended",
      value: stats.totalAttendees,
      color: "text-green-600",
    },
    {
      label: "Cancelled",
      value: stats.cancelledCount,
      color: "text-red-600",
    },
    {
      label: "Available Seats",
      value: stats.availableSeats,
      color: "text-indigo-600",
    },
    {
      label: "Event Capacity",
      value: stats.capacity,
      color: "text-gray-900",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                onClick={() => navigate("/organizer/events")}
                className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                ← Back to My Events
              </button>

              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Manage Event
              </h1>

              <p className="mt-1 text-gray-600">
                Manage registrations and attendance for your event.
              </p>
            </div>

            <button
              onClick={() => navigate(`/organizer/events/${id}/edit`)}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
            >
              Edit Event
            </button>
<button
  onClick={() => navigate(`/qr-test?eventId=${event._id}`)}
  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
>
  <span>▦</span>
  QR Check-In
</button>
          </div>

          <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-sm">
            {event.image && (
              <img
                src={event.image}
                alt={event.title}
                className="h-56 w-full object-cover sm:h-72"
              />
            )}

            <div className="p-5 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {event.title}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    {event.description}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
                    event.status === "published"
                      ? "bg-green-100 text-green-700"
                      : event.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : event.status === "completed"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {event.location}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Start</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {new Date(event.startDate).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">End</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {new Date(event.endDate).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Registration Deadline</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {new Date(
                      event.registrationDeadline
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p
                  className={`mt-2 text-3xl font-bold ${stat.color}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Participants
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                All registration records for this event, including cancelled registrations.
              </p>
            </div>

            {registrations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No participants have registered yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-5 py-4 font-medium">
                        Participant
                      </th>
                      <th className="px-5 py-4 font-medium">
                        Ticket Code
                      </th>
                      <th className="px-5 py-4 font-medium">
                        Registration
                      </th>
                      <th className="px-5 py-4 font-medium">
                        Attendance
                      </th>
                      <th className="px-5 py-4 font-medium">
                        Registered At
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {registrations.map((registration) => (
                      <tr key={registration._id}>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">
                            {registration.participant?.name ||
                              "Unknown participant"}
                          </p>
                          <p className="text-gray-500">
                            {registration.participant?.email || "-"}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-mono text-xs text-gray-700">
                          {registration.ticketCode}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              registration.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : registration.status === "attended"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {registration.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              registration.checkedIn
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {registration.checkedIn
                              ? "Checked In"
                              : "Not Checked In"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {new Date(
                            registration.createdAt
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManageEvent;
