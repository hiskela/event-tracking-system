import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrganizerEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/events/my-events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch events");
      }

      setEvents(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete event");
      }

      setEvents((currentEvents) =>
        currentEvents.filter((event) => event._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
          <p className="text-lg text-gray-600">
            Loading your events...
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

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Events
            </h1>

            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Manage the events you have created.
            </p>
          </div>

          <button
            onClick={() => navigate("/organizer/events/create")}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 sm:w-auto"
          >
            + Create Event
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm sm:p-12">
            <h2 className="text-xl font-semibold text-gray-900">
              No events yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You have not created any events.
            </p>

            <button
              onClick={() => navigate("/organizer/events/create")}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gray-200 text-gray-500">
                    No image
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 break-words text-lg font-bold text-gray-900">
                      {event.title}
                    </h2>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
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

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-800">
                        Category:
                      </span>{" "}
                      {event.category?.name || "No category"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Location:
                      </span>{" "}
                      {event.location}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Starts:
                      </span>{" "}
                      {formatDate(event.startDate)}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Ends:
                      </span>{" "}
                      {formatDate(event.endDate)}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Capacity:
                      </span>{" "}
                      {event.capacity}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Price:
                      </span>{" "}
                      {event.price === 0
                        ? "Free"
                        : `${event.price} ETB`}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      onClick={() =>
                        navigate(`/organizer/events/${event._id}`)
                      }
                      className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Manage Event
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/organizer/events/${event._id}/edit`)
                      }
                      className="rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(event._id)}
                      className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 sm:col-span-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default OrganizerEvents;