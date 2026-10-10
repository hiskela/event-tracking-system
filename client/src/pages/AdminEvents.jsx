import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:5000/api/admin/events";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [notice, setNotice] = useState("");

  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);

      const response = await fetch(`${API_URL}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load events");
      }

      setEvents(data.events || []);
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [search, status]);

  const updateStatus = async (eventId, newStatus) => {
    try {
      setUpdatingId(eventId);
      setError("");
      setNotice("");

      const response = await fetch(`${API_URL}/${eventId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update event");
      }

      setNotice(`Event status changed to ${newStatus}.`);
      await fetchEvents();
    } catch (err) {
      setError(err.message || "Failed to update event");
    } finally {
      setUpdatingId("");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const statusStyle = (value) => {
    const styles = {
      published: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };

    return styles[value] || "bg-gray-100 text-gray-700";
  };

  const actionOptions = (event) => {
    if (event.status === "published") {
      return [
        { label: "Move to Draft", value: "draft" },
        { label: "Cancel Event", value: "cancelled" },
        { label: "Mark Completed", value: "completed" },
      ];
    }

    if (event.status === "draft") {
      return [
        { label: "Publish Event", value: "published" },
        { label: "Cancel Event", value: "cancelled" },
      ];
    }

    if (event.status === "cancelled") {
      return [
        { label: "Restore as Draft", value: "draft" },
        { label: "Publish Event", value: "published" },
      ];
    }

    return [{ label: "Move to Draft", value: "draft" }];
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
<Navbar/>       
 <div className="mx-auto max-w-7xl">
     
 <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Event Management
          </h1>
          <p className="mt-2 text-gray-600">
            Review events, manage publication status, and monitor event
            organizers.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Events", value: events.length },
            {
              label: "Published",
              value: events.filter((event) => event.status === "published").length,
            },
            {
              label: "Drafts",
              value: events.filter((event) => event.status === "draft").length,
            },
            {
              label: "Cancelled",
              value: events.filter((event) => event.status === "cancelled").length,
            },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2">
          <div>
            <label htmlFor="event-search" className="mb-2 block text-sm font-medium text-gray-700">
              Search events
            </label>
            <input
              id="event-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or location..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="event-status" className="mb-2 block text-sm font-medium text-gray-700">
              Filter by status
            </label>
            <select
              id="event-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {notice && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
            {notice}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              No events found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Try a different search or status filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-40 w-full rounded-lg object-cover sm:w-48"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center rounded-lg bg-indigo-50 text-4xl sm:w-48">
                      🎟️
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {event.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          {event.location}
                        </p>
                      </div>

                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(event.status)}`}>
                        {event.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-gray-500">Organizer</p>
                        <p className="mt-1 font-medium text-gray-800">
                          {event.organizer?.name || "Unknown organizer"}
                        </p>
                        <p className="text-gray-500">
                          {event.organizer?.email || ""}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Category</p>
                        <p className="mt-1 font-medium text-gray-800">
                          {event.category?.name || "Uncategorized"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Starts</p>
                        <p className="mt-1 font-medium text-gray-800">
                          {formatDate(event.startDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Capacity / Price</p>
                        <p className="mt-1 font-medium text-gray-800">
                          {event.capacity} people ·{" "}
                          {event.price === 0 ? "Free" : `${event.price} ETB`}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <label htmlFor={`action-${event._id}`} className="text-sm font-medium text-gray-700">
                        Admin action
                      </label>

                      <select
                        id={`action-${event._id}`}
                        disabled={updatingId === event._id}
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            updateStatus(event._id, e.target.value);
                          }
                        }}
                        className="min-w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-50"
                      >
                        <option value="">Choose action...</option>
                        {actionOptions(event).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      {updatingId === event._id && (
                        <span className="text-sm text-gray-500">
                          Updating...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 text-sm text-gray-500">
          Showing {events.length} event{events.length === 1 ? "" : "s"} matching
          your filters.
        </p>
      </div>
    </div>
  );
}

export default AdminEvents;