
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/notifications";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [notificationsResponse, countResponse] = await Promise.all([
          fetch(API_URL, { headers }),
          fetch(`${API_URL}/unread-count`, { headers }),
        ]);

        if (!notificationsResponse.ok || !countResponse.ok) {
          return;
        }

        const notificationsData = await notificationsResponse.json();
        const countData = await countResponse.json();

        setNotifications(notificationsData);
        setUnreadCount(countData.count);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [token]);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
    setNotificationsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    setNotificationsOpen(false);
    setNotifications([]);
    setUnreadCount(0);
    navigate("/");
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_URL}/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_URL}/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const desktopLink =
    "text-sm font-medium text-gray-700 transition hover:text-blue-600";

  const mobileLink =
    "rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100";

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
          <button onClick={() => handleNavigate("/")} className={desktopLink}>
            Home
          </button>

          <button
            onClick={() => handleNavigate("/events")}
            className={desktopLink}
          >
            Events
          </button>

          {user?.role === "participant" && (
            <>
              <button
                onClick={() => handleNavigate("/participant/dashboard")}
                className={desktopLink}
              >
                Dashboard
              </button>

              <button
                onClick={() => handleNavigate("/participant/my-registrations")}
                className={desktopLink}
              >
                My Registrations
              </button>

              <button
                onClick={() => handleNavigate("/participant/organizer-request")}
                className={desktopLink}
              >
                Become an Organizer
              </button>
            </>
          )}

          {user?.role === "organizer" && (
            <>
              <button
                onClick={() => handleNavigate("/organizer/dashboard")}
                className={desktopLink}
              >
                Dashboard
              </button>

              <button
                onClick={() => handleNavigate("/organizer/events")}
                className={desktopLink}
              >
                My Events
              </button>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <button
                onClick={() => handleNavigate("/admin/dashboard")}
                className={desktopLink}
              >
                Dashboard
              </button>

              <button
                onClick={() => handleNavigate("/admin/users")}
                className={desktopLink}
              >
                Manage Users
              </button>

              <button
                onClick={() => handleNavigate("/admin/events")}
                className={desktopLink}
              >
                Manage Events
              </button>

              <button
                onClick={() => handleNavigate("/admin/organizer-requests")}
                className={desktopLink}
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

        {token && (
          <div className="relative ml-auto mr-3 md:ml-5 md:mr-0">
            <button
              onClick={() => setNotificationsOpen((open) => !open)}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              className="relative rounded-lg border border-gray-200 p-2.5 text-gray-700 transition hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </svg>

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-3 w-[min(90vw,380px)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <h2 className="font-semibold text-gray-900">
                    Notifications
                  </h2>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-gray-500">
                      You don't have any notifications yet.
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification._id}
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsRead(notification._id);
                          }
                        }}
                        className={`block w-full border-b border-gray-100 px-4 py-4 text-left transition hover:bg-gray-50 ${
                          notification.isRead ? "bg-white" : "bg-blue-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                              notification.isRead
                                ? "bg-gray-300"
                                : "bg-blue-600"
                            }`}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {notification.title}
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              {notification.message}
                            </p>

                            {notification.event?.title && (
                              <p className="mt-1 text-xs font-medium text-blue-600">
                                {notification.event.title}
                              </p>
                            )}

                            <p className="mt-2 text-xs text-gray-400">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

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
            <button onClick={() => handleNavigate("/")} className={mobileLink}>
              Home
            </button>

            <button
              onClick={() => handleNavigate("/events")}
              className={mobileLink}
            >
              Events
            </button>

            {user?.role === "participant" && (
              <>
                <button
                  onClick={() => handleNavigate("/participant/dashboard")}
                  className={mobileLink}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => handleNavigate("/participant/my-registrations")}
                  className={mobileLink}
                >
                  My Registrations
                </button>

                <button
                  onClick={() => handleNavigate("/participant/organizer-request")}
                  className={mobileLink}
                >
                  Become an Organizer
                </button>
              </>
            )}

            {user?.role === "organizer" && (
              <>
                <button
                  onClick={() => handleNavigate("/organizer/dashboard")}
                  className={mobileLink}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => handleNavigate("/organizer/events")}
                  className={mobileLink}
                >
                  My Events
                </button>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <button
                  onClick={() => handleNavigate("/admin/dashboard")}
                  className={mobileLink}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => handleNavigate("/admin/users")}
                  className={mobileLink}
                >
                  Manage Users
                </button>

                <button
                  onClick={() => handleNavigate("/admin/events")}
                  className={mobileLink}
                >
                  Manage Events
                </button>

                <button
                  onClick={() => handleNavigate("/admin/organizer-requests")}
                  className={mobileLink}
                >
                  Organizer Requests
                </button>
              </>
            )}

            {!token ? (
              <>
                <button
                  onClick={() => handleNavigate("/login")}
                  className={mobileLink}
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
