import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Ticket() {
  const { id } = useParams();
const navigate=useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem("token");

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
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading ticket...</p>
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
      <div className="mx-auto max-w-md">
 <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow hover:bg-gray-50"
      >
        ← Back
      </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          <div className="bg-blue-600 p-6 text-center text-white">
            <h1 className="text-2xl font-bold">
              Event Ticket
            </h1>
<span></span>
            <p className="mt-1">
              {ticket.event?.title}
            </p>
          </div>

          <div className="p-6">
            <div className="text-center">
              {ticket.qrCode && (
                <img
                  src={ticket.qrCode}
                  alt="Event ticket QR code"
                  className="mx-auto h-64 w-64"
                />
              )}
            </div>

            <div className="mt-6 space-y-3 border-t pt-6">
              <div>
                <p className="text-sm text-gray-500">
                  Participant
                </p>

                <p className="font-semibold text-gray-900">
                  {ticket.participant?.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Ticket Code
                </p>

                <p className="font-semibold text-gray-900">
                  {ticket.ticketCode}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="font-semibold text-gray-900">
                  {ticket.event?.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Event Date
                </p>

                <p className="font-semibold text-gray-900">
                  {new Date(
                    ticket.event?.startDate
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Status
                </p>

                <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  {ticket.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ticket;