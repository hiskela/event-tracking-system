import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (role) params.set("role", role);

      const response = await fetch(
        `http://localhost:5000/api/admin/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [navigate, search, role]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const roleStyle = (userRole) => {
    if (userRole === "admin") {
      return "bg-purple-100 text-purple-700";
    }

    if (userRole === "organizer") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mb-6 text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                Administration
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                User Management 👥
              </h1>
              <p className="mt-2 text-gray-600">
                View and search everyone registered on EventTrack.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
              <p className="text-sm text-gray-500">Matching users</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {loading ? "..." : users.length}
              </p>
            </div>
          </div>

          <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <div>
                <label
                  htmlFor="user-search"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Search users
                </label>
                <input
                  id="user-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="user-role"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Filter by role
                </label>
                <select
                  id="user-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">All roles</option>
                  <option value="participant">Participants</option>
                  <option value="organizer">Organizers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </section>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              <p className="font-semibold">Unable to load users</p>
              <p className="mt-1 text-sm">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
              <p className="font-medium text-gray-600">
                Loading users... please wait! ☕
              </p>
            </div>
          ) : !error && users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <div className="mb-3 text-5xl">🕵️</div>
              <h2 className="text-xl font-bold text-gray-900">
                No users found!
              </h2>
              <p className="mt-2 text-gray-500">
                Try another search or select a different role.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setRole("");
                }}
                className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Clear filters
              </button>
            </div>
          ) : !error ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-5 py-4">
                <h2 className="font-bold text-gray-900">
                  Registered Users
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {users.length} matching{" "}
                  {users.length === 1 ? "account" : "accounts"}
                </p>
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.email}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleStyle(item.role)}`}
                          >
                            {item.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "Not available"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-gray-100 md:hidden">
                {users.map((item) => (
                  <article key={item._id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                        {(item.name || item.email || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 break-all text-sm text-gray-500">
                          {item.email}
                        </p>
                        <span
                          className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleStyle(item.role)}`}
                        >
                          {item.role}
                        </span>
                        <p className="mt-3 text-xs text-gray-500">
                          Joined:{" "}
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "Not available"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}

export default AdminUsers;