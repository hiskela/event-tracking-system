import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminOrganizerRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

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
      setError(error.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

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
      setError(error.message || "Failed to update request");
    } finally {
      setUpdatingId("");
    }
  };

  const pendingCount = requests.filter(
    (request) => request.status === "pending"
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "approved"
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "rejected"
  ).length;

  const statusStyle = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          ← Admin Dashboard
        </button>

        <section className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">
            Administration
          </p>

          <h1 className="mt-3 text-2xl font-bold sm:text-3xl lg:text-4xl">
            Organizer Requests
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Review applications from participants who want to organize events.
            Approve qualified requests or reject applications that don't meet
            your requirements.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>{error}</p>
            <button
              onClick={fetchRequests}
              className="self-start font-semibold underline sm:self-auto"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 text-gray-600">Loading organizer requests...</p>
          </div>
        ) : (
          <>
            <section className="mb-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Pending",
                  value: pendingCount,
                  icon: "⏳",
                  color: "bg-amber-50 text-amber-700",
                },
                {
                  label: "Approved",
                  value: approvedCount,
                  icon: "✓",
                  color: "bg-green-50 text-green-700",
                },
                {
                  label: "Rejected",
                  value: rejectedCount,
                  icon: "✕",
                  color: "bg-red-50 text-red-700",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      {item.label} Requests
                    </p>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${item.color}`}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-gray-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </section>

            <section>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                    Applications
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {requests.length} total request
                    {requests.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {requests.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
                  <div className="text-5xl">📋</div>
                  <h3 className="mt-4 text-xl font-bold text-gray-900">
                    No organizer requests yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    New applications will appear here when participants submit
                    their requests.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  {requests.map((request) => (
                    <article
                      key={request._id}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-gray-900">
                            {request.user?.name || "Unknown User"}
                          </h3>
                          <p className="mt-1 break-all text-sm text-gray-500">
                            {request.user?.email || "No email provided"}
                          </p>
                        </div>

                        <span
                          className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyle[request.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className="mt-5 rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Organization
                        </p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {request.organization || "Not provided"}
                        </p>
                      </div>

                      <div className="mt-5 space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Phone
                          </p>
                          <p className="mt-1 break-words text-sm text-gray-900">
                            {request.phone || "Not provided"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Reason for applying
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                            {request.reason || "No reason provided"}
                          </p>
                        </div>

                        {request.additionalInfo && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              Additional information
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                              {request.additionalInfo}
                            </p>
                          </div>
                        )}
                      </div>

                      {request.status === "pending" ? (
                        <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                          <button
                            onClick={() =>
                              updateRequest(request._id, "approved")
                            }
                            disabled={Boolean(updatingId)}
                            className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                          >
                            {updatingId === request._id
                              ? "Updating..."
                              : "✓ Approve Request"}
                          </button>

                          <button
                            onClick={() =>
                              updateRequest(request._id, "rejected")
                            }
                            disabled={Boolean(updatingId)}
                            className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                          >
                            {updatingId === request._id
                              ? "Updating..."
                              : "✕ Reject Request"}
                          </button>
                        </div>
                      ) : (
                        <p className="mt-6 border-t border-gray-100 pt-4 text-sm text-gray-500">
                          This request has already been {request.status}.
                        </p>
                      )}
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

export default AdminOrganizerRequests;