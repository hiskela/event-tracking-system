import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const navigate=useNavigate();
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");

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
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">
          Loading your registrations...
        </p>
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
            My Registrations
          </h1>

          <p className="mt-2 text-gray-600">
            View the events you have registered for.
          </p>
        </div>

        {registrations.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-800">
              No registrations yet
            </h2>

            <p className="mt-2 text-gray-500">
              You have not registered for any events.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {registrations.map((registration) => (
              <div
                key={registration._id}
                className="overflow-hidden rounded-xl bg-white shadow"
              >
                {registration.event?.image ? (
                  <img
                    src={registration.event.image}
                    alt={registration.event.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gray-200">
                    <p className="text-gray-500">No image</p>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-bold text-gray-900">
                      {registration.event?.title || "Event unavailable"}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
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

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>
                      📍 {registration.event?.location || "Unknown location"}
                    </p>

                    {registration.event?.startDate && (
                      <p>
                        📅{" "}
                        {new Date(
                          registration.event.startDate
                        ).toLocaleDateString()}
                      </p>
                    )}

                    {registration.event?.price !== undefined && (
                      <p>
                        💰{" "}
                        {registration.event.price === 0
                          ? "Free"
                          : `${registration.event.price} ETB`}
                      </p>
                    )}

                    <p>
                      🎟️ Ticket: {registration.ticketCode}
                    </p>
                  </div>

                  <button
  onClick={() =>
    navigate(`/participant/ticket/${registration._id}`)
  }
  className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
>
  View Ticket
</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRegistrations;