import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/events/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch event");
        }

        setEvent(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Event not found
          </h1>

          <p className="mt-2 text-red-600">{error}</p>

          <Link
            to="/events"
            className="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-medium text-white"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-xl font-bold text-gray-900 sm:text-2xl"
          >
            EventTrack
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/events"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:px-4"
            >
              Events
            </Link>

            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:px-4"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:px-4"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link
          to="/events"
          className="mb-6 inline-block text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Events
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="h-64 bg-gray-200 sm:h-80 lg:h-96">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No image
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {event.category?.name || "Other"}
                </span>

                <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                  {event.title}
                </h1>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold text-gray-900">
                  {event.price > 0
                    ? `${event.price} ETB`
                    : "Free"}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">📅 Start</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {new Date(event.startDate).toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">🏁 End</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {new Date(event.endDate).toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">📍 Location</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {event.location}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">👥 Capacity</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {event.capacity} people
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900">
                About this event
              </h2>

              <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
                {event.description}
              </p>
            </div>

            <div className="mt-8 rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500">
                Registration deadline
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {new Date(
                  event.registrationDeadline
                ).toLocaleString()}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate(`/events/${event._id}/register`)}
                className="w-full rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
              >
                Register for Event
              </button>

              <Link
                to="/events"
                className="w-full rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
              >
                Browse More Events
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EventDetails;