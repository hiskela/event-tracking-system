import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          onClick={() => handleNavigate("/")}
          className="text-xl font-bold text-blue-600 sm:text-2xl"
        >
          EventTrack
        </button>

        <div className="hidden items-center gap-5 md:flex">
          <button
            onClick={() => handleNavigate("/")}
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Home
          </button>

          <button
            onClick={() => handleNavigate("/events")}
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Events
          </button>

          {user?.role === "participant" && (
            <>
              <button
                onClick={() => handleNavigate("/participant/dashboard")}
                className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                Dashboard
              </button>

              <button
                onClick={() =>
                  handleNavigate("/participant/my-registrations")
                }
                className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                My Registrations
              </button>
            </>
          )}

          {user?.role === "organizer" && (
            <>
              <button
                onClick={() => handleNavigate("/organizer/dashboard")}
                className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                Dashboard
              </button>

              <button
                onClick={() => handleNavigate("/organizer/events")}
                className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                My Events
              </button>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <button
                onClick={() => handleNavigate("/admin/dashboard")}
                className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                Dashboard
              </button>

              <button
                onClick={() =>
                  handleNavigate("/admin/organizer-requests")
                }
                className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                Organizer Requests
              </button>
            </>
          )}

          {!token ? (
            <>
              <button
                onClick={() => handleNavigate("/login")}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Login
              </button>

              <button
                onClick={() => handleNavigate("/register")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Logout
            </button>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => handleNavigate("/")}
              className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Home
            </button>

            <button
              onClick={() => handleNavigate("/events")}
              className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Events
            </button>

            {user?.role === "participant" && (
              <>
                <button
                  onClick={() => handleNavigate("/participant/dashboard")}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Dashboard
                </button>

                <button
                  onClick={() =>
                    handleNavigate("/participant/my-registrations")
                  }
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  My Registrations
                </button>
              </>
            )}

            {user?.role === "organizer" && (
              <>
                <button
                  onClick={() => handleNavigate("/organizer/dashboard")}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => handleNavigate("/organizer/events")}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  My Events
                </button>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <button
                  onClick={() => handleNavigate("/admin/dashboard")}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Dashboard
                </button>

                <button
                  onClick={() =>
                    handleNavigate("/admin/organizer-requests")
                  }
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Organizer Requests
                </button>
              </>
            )}

            {!token ? (
              <>
                <button
                  onClick={() => handleNavigate("/login")}
                  className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Login
                </button>

                <button
                  onClick={() => handleNavigate("/register")}
                  className="rounded-lg bg-blue-600 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="rounded-lg bg-gray-900 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;