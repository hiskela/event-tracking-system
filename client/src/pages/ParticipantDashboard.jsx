import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ParticipantDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

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
        setError(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const stats = [
    {
      label: "Total Registrations",
      value: dashboard?.totalRegistrations ?? 0,
      icon: "🎟️",
      color: "bg-blue-50 text-blue-700",
      description: "All your registrations",
    },
    {
      label: "Upcoming Events",
      value: dashboard?.upcomingEvents ?? 0,
      icon: "📅",
      color: "bg-emerald-50 text-emerald-700",
      description: "Events coming up",
    },
    {
      label: "Attended Events",
      value: dashboard?.attendedEvents ?? 0,
      icon: "✓",
      color: "bg-purple-50 text-purple-700",
      description: "Events you've attended",
    },
    {
      label: "Cancelled",
      value: dashboard?.cancelledRegistrations ?? 0,
      icon: "↩",
      color: "bg-red-50 text-red-700",
      description: "Cancelled registrations",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
          <p className="text-sm font-semibold text-blue-100">
            PARTICIPANT DASHBOARD
          </p>

          <h1 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
            Welcome back{user.name ? `, ${user.name}` : ""}! 👋
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Keep track of your event registrations, access your tickets, and
            discover experiences worth attending.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/events")}
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Explore Events →
            </button>

            <button
              onClick={() => navigate("/participant/my-registrations")}
              className="rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              My Registrations
            </button>
          </div>
        </section>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="text-4xl">⚠️</div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Unable to load your dashboard
            </h2>
            <p className="mt-2 text-sm text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Your Activity
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  A quick overview of your event activity.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-gray-500">
                        {stat.label}
                      </p>
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${stat.color}`}
                      >
                        {stat.icon}
                      </span>
                    </div>

                    <p className="mt-4 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Recent Registrations
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Your five most recent event registrations.
                  </p>
                </div>

                {dashboard.recentRegistrations.length > 0 && (
                  <button
                    onClick={() =>
                      navigate("/participant/my-registrations")
                    }
                    className="self-start text-sm font-semibold text-blue-600 hover:text-blue-800 sm:self-auto"
                  >
                    View all registrations →
                  </button>
                )}
              </div>

              {dashboard.recentRegistrations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
                  <div className="text-5xl">🎫</div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    Your next experience starts here
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    You haven't registered for any events yet. Explore what's
                    happening and reserve your first event ticket.
                  </p>
                  <button
                    onClick={() => navigate("/events")}
                    className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboard.recentRegistrations.map((registration) => (
                    <article
                      key={registration._id}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {registration.event?.image ? (
                          <img
                            src={registration.event.image}
                            alt={registration.event.title || "Event"}
                            className="h-48 w-full object-cover sm:h-auto sm:w-48 lg:w-56"
                          />
                        ) : (
                          <div className="flex h-36 w-full items-center justify-center bg-gray-100 text-4xl sm:h-auto sm:w-48 lg:w-56">
                            🎉
                          </div>
                        )}

                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {registration.event?.title ||
                                  "Event unavailable"}
                              </h3>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

                            <div className="mt-3 space-y-2 text-sm text-gray-500">
                              <p>
                                📍{" "}
                                {registration.event?.location ||
                                  "Location unavailable"}
                              </p>

                              {registration.event?.startDate && (
                                <p>
                                  📅{" "}
                                  {new Date(
                                    registration.event.startDate
                                  ).toLocaleString()}
                                </p>
                              )}

                              <p className="break-all">
                                🎟️ Ticket: {registration.ticketCode}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              navigate(
                                `/participant/ticket/${registration._id}`
                              )
                            }
                            disabled={
                              !registration.event ||
                              registration.status === "cancelled"
                            }
                            className="shrink-0 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                          >
                            {registration.status === "cancelled"
                              ? "Ticket Cancelled"
                              : "View Ticket →"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ParticipantDashboard;