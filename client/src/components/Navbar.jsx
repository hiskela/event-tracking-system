import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/")}
          className="text-xl font-bold text-blue-600 sm:text-2xl"
        >
          EventTrack
        </button>

        <div className="hidden items-center gap-5 md:flex">
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/events")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Events
          </button>

          {user?.role === "participant" && (
            <>
              <button
                onClick={() => navigate("/participant/dashboard")}
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/participant/my-registrations")}
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                My Registrations
              </button>
            </>
          )}

          {user?.role === "organizer" && (
            <>
              <button
                onClick={() => navigate("/organizer/dashboard")}
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/organizer/events")}
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                My Events
              </button>
            </>
          )}

          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin/organizer-requests")}
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Organizer Requests
            </button>
          )}

          {!token ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Logout
            </button>
          )}
        </div>

        <button
          onClick={() => navigate("/events")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white md:hidden"
        >
          Events
        </button>
      </div>
    </nav>
  );
}

export default Navbar;