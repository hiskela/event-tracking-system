
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function Ticket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/registrations/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch ticket");
        }

        setTicket(data.ticket);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
        >
          ← Back
        </button>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">Loading ticket...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => navigate("/events")}
              className="mt-5 rounded-lg bg-gray-900 px-5 py-3 text-white hover:bg-gray-700"
            >
              Browse Events
            </button>
          </div>
        ) : ticket ? (
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="bg-blue-600 px-5 py-7 text-center text-white sm:px-8">
              <p className="text-sm font-medium uppercase tracking-widest text-blue-100">
                EventTrack
              </p>

              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                Event Ticket
              </h1>

              <p className="mt-2 text-lg">
                {ticket.event?.title}
              </p>
            </div>

            <div className="p-5 sm:p-8">
              {ticket.status === "cancelled" ? (
                <div className="rounded-lg bg-red-50 p-4 text-center text-red-700">
                  This registration has been cancelled. This ticket is no longer valid.
                </div>
              ) : (
                <div className="text-center">
                  {ticket.qrCode ? (
                    <img
                      src={ticket.qrCode}
                      alt="Event ticket QR code"
                      className="mx-auto h-56 w-56 max-w-full object-contain sm:h-64 sm:w-64"
                    />
                  ) : (
                    <p className="text-gray-500">
                      QR code is not available.
                    </p>
                  )}

                  <p className="mt-3 break-all font-mono text-sm font-semibold text-gray-700">
                    {ticket.ticketCode}
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-4 border-t pt-6">
                <div>
                  <p className="text-sm text-gray-500">Participant</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {ticket.participant?.name || "Unknown participant"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {ticket.event?.location || "Unknown location"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Event Date</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {ticket.event?.startDate
                      ? new Date(
                          ticket.event.startDate
                        ).toLocaleString()
                      : "Date unavailable"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Ticket Status</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                      ticket.status === "attended"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/events")}
                className="mt-7 w-full rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Browse More Events
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default Ticket;
