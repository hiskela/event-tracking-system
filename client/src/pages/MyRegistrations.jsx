
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function MyRegistrations() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/registrations/my-registrations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch registrations"
          );
        }

        setRegistrations(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Registrations
          </h1>

          <p className="mt-2 text-gray-600">
            View your registered events and access your tickets.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading your registrations...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="font-medium text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-gray-900 px-5 py-3 text-white hover:bg-gray-700"
            >
              Try Again
            </button>
          </div>
        ) : registrations.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm sm:px-10">
            <div className="text-5xl">🎟️</div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No registrations yet
            </h2>

            <p className="mt-2 text-gray-600">
              Discover an event and register to get your ticket.
            </p>

            <button
              onClick={() => navigate("/events")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-600">
              {registrations.length} registration
              {registrations.length !== 1 ? "s" : ""}
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {registrations.map((registration) => (
                <div
                  key={registration._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
                >
                  {registration.event?.image ? (
                    <img
                      src={registration.event.image}
                      alt={registration.event.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-500">
                      No image available
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-bold text-gray-900">
                        {registration.event?.title ||
                          "Event unavailable"}
                      </h2>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
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

                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      <p>
                        📍 {registration.event?.location || "Unknown location"}
                      </p>

                      {registration.event?.startDate && (
                        <p>
                          📅{" "}
                          {new Date(
                            registration.event.startDate
                          ).toLocaleString()}
                        </p>
                      )}

                      {registration.event && (
                        <p>
                          💰{" "}
                          {registration.event.price === 0
                            ? "Free"
                            : `${registration.event.price} ETB`}
                        </p>
                      )}

                      <p className="break-all">
                        🎟️ {registration.ticketCode}
                      </p>
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
                      className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      View Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default MyRegistrations;
