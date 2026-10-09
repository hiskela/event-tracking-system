import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function RegisterEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user) {
      navigate("/login");
      return;
    }

   

    try {
      setRegistering(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `http://localhost:5000/api/registrations/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Registration successful!");

      setTimeout(() => {
        navigate(`/participant/ticket/${data.registration._id}`);
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Event not found
          </h1>

          <Link
            to="/events"
            className="mt-4 inline-block rounded-lg bg-black px-5 py-3 text-white"
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

          <Link
            to={`/events/${id}`}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Back to Event
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {event.image && (
            <div className="h-56 sm:h-72">
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-5 sm:p-8">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {event.category?.name || "Other"}
            </span>

            <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              Register for {event.title}
            </h1>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Date</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {new Date(event.startDate).toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Location</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {event.location}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Price</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {event.price > 0
                    ? `${event.price} ETB`
                    : "Free"}
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-600">
                {success}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={registering}
              className="mt-8 w-full rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {registering ? "Registering..." : "Confirm Registration"}
            </button>

            <p className="mt-4 text-center text-sm text-gray-500">
              Your ticket and QR code will be generated after registration.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterEvent;