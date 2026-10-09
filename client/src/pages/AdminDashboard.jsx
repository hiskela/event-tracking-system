import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
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
        setError(error.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const stats = [
    {
      label: "Total Users",
      value: dashboard?.totalUsers ?? 0,
      icon: "👥",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Events",
      value: dashboard?.totalEvents ?? 0,
      icon: "📅",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Published Events",
      value: dashboard?.publishedEvents ?? 0,
      icon: "🌟",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Registrations",
      value: dashboard?.totalRegistrations ?? 0,
      icon: "🎟️",
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "Organizers",
      value: dashboard?.totalOrganizers ?? 0,
      icon: "🧑‍💼",
      color: "bg-orange-50 text-orange-700",
    },
    {
      label: "Pending Requests",
      value: dashboard?.pendingRequests ?? 0,
      icon: "⏳",
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">
            Administration
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Monitor platform activity and manage events, users, and organizer
            requests from one place.
          </p>

          <button
            onClick={() => navigate("/admin/organizer-requests")}
            className="mt-6 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
          >
            Review Organizer Requests →
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-gray-600">
              Loading dashboard statistics...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Platform Overview
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Current totals from your database.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${stat.color}`}
                      >
                        {stat.icon}
                      </span>
                    </div>

                    <p className="mt-4 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Quick Actions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Jump directly to important admin tasks.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  onClick={() => navigate("/admin/organizer-requests")}
                  className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <span className="text-3xl">✅</span>
                  <h3 className="mt-4 font-bold text-gray-900">
                    Organizer Requests
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Review applications and approve or reject pending requests.
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                    Manage requests →
                  </span>
                </button>

                <button
                  onClick={() => navigate("/events")}
                  className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <span className="text-3xl">🗓️</span>
                  <h3 className="mt-4 font-bold text-gray-900">
                    Browse Events
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Explore published events and view their details.
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                    View events →
                  </span>
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <span className="text-3xl">🔄</span>
                  <h3 className="mt-4 font-bold text-gray-900">
                    Refresh Statistics
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Reload the latest totals from your database.
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
                    Refresh dashboard →
                  </span>
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;