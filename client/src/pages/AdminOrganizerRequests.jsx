import { useEffect, useState } from "react";

function AdminOrganizerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/organizer-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch requests");
      }

      setRequests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateRequest = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/organizer-requests/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update request");
      }

      await fetchRequests();
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <p className="text-lg text-gray-600">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Organizer Requests
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Review and manage participant requests to become organizers.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No organizer requests found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {requests.map((request) => (
              <div
                key={request._id}
                className="rounded-xl bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {request.user?.name || "Unknown User"}
                    </h2>

                    <p className="mt-1 break-all text-sm text-gray-500">
                      {request.user?.email || "No email"}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : request.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Organization
                    </p>
                    <p className="mt-1 text-gray-900">
                      {request.organization}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Phone
                    </p>
                    <p className="mt-1 text-gray-900">
                      {request.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Reason
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-gray-900">
                      {request.reason}
                    </p>
                  </div>

                  {request.additionalInfo && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Additional Information
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-gray-900">
                        {request.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>

                {request.status === "pending" && (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() =>
                        updateRequest(request._id, "approved")
                      }
                      disabled={updatingId === request._id}
                      className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {updatingId === request._id
                        ? "Updating..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        updateRequest(request._id, "rejected")
                      }
                      disabled={updatingId === request._id}
                      className="w-full rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrganizerRequests;