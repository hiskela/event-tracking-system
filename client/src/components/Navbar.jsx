
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/notifications";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const navbarRef = useRef(null);
  const notificationDetailRef = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const roleLinks = {
    participant: [
      { label: "Dashboard", path: "/participant/dashboard" },
      {
        label: "My Registrations",
        path: "/participant/my-registrations",
      },
      {
        label: "Become an Organizer",
        path: "/participant/organizer-request",
      },
    ],
    organizer: [
      { label: "Dashboard", path: "/organizer/dashboard" },
      { label: "My Events", path: "/organizer/events" },
    ],
    admin: [
      { label: "Dashboard", path: "/admin/dashboard" },
      { label: "Manage Users", path: "/admin/users" },
      { label: "Manage Events", path: "/admin/events" },
      {
        label: "Organizer Requests",
        path: "/admin/organizer-requests",
      },
    ],
  };

  const menuItems = roleLinks[user?.role] || [];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const clickedInsideNavbar =
        navbarRef.current?.contains(event.target);

      const clickedInsideDetails =
        notificationDetailRef.current?.contains(event.target);

      if (!clickedInsideNavbar && !clickedInsideDetails) {
        setMenuOpen(false);
        setNotificationsOpen(false);
      }

      if (
        notificationDetailRef.current &&
        !clickedInsideDetails
      ) {
        setSelectedNotification(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedNotification(null);
        setNotificationsOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

        const [notificationsResponse, countResponse] =
          await Promise.all([
            fetch(API_URL, { headers }),
            fetch(`${API_URL}/unread-count`, { headers }),
          ]);

        if (!notificationsResponse.ok || !countResponse.ok) {
          return;
        }

        const notificationData =
          await notificationsResponse.json();
        const countData = await countResponse.json();

        setNotifications(notificationData);
        setUnreadCount(countData.count);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    document.body.style.overflow = selectedNotification
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedNotification]);

  const handleNavigate = (path) => {
    setMenuOpen(false);
    setNotificationsOpen(false);
    setSelectedNotification(null);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);
    setNotificationsOpen(false);
    setSelectedNotification(null);
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

      if (!response.ok) return;

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setSelectedNotification((current) =>
        current?._id === notificationId
          ? { ...current, isRead: true }
          : current
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

      if (!response.ok) return;

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setSelectedNotification((current) =>
        current ? { ...current, isRead: true } : current
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const deleteNotification = async (notification) => {
    try {
      const response = await fetch(
        `${API_URL}/${notification._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((current) =>
        current.filter((item) => item._id !== notification._id)
      );

      if (!notification.isRead) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }

      setSelectedNotification(null);
    } catch (error) {
      console.error("Failed to delete notification:", error);
      alert("Could not delete this notification. Please try again.");
    }
  };

  const navLinkClass = (path) =>
    `rounded-xl px-3 py-2 text-sm font-semibold transition duration-200 ${
      location.pathname === path
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-blue-700"
    }`;

  const menuLinkClass = (path) =>
    `flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
      location.pathname === path
        ? "bg-blue-50 text-blue-700"
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-700"
    }`;

  return (
    <>
      <nav
        ref={navbarRef}
        className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
          <button
            type="button"
            onClick={() => handleNavigate("/")}
            className="shrink-0 text-lg font-extrabold tracking-tight text-blue-700 transition hover:text-blue-900 sm:text-2xl"
          >
            Event<span className="text-gray-900">Track</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => handleNavigate("/")}
              className={navLinkClass("/")}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => handleNavigate("/events")}
              className={navLinkClass("/events")}
            >
              Events
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {token && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen((open) => !open);
                    setMenuOpen(false);
                  }}
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                  className="relative rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
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
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white ring-2 ring-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-[min(90vw,390px)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                      <div>
                        <h2 className="font-bold text-gray-900">
                          Notifications
                        </h2>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {unreadCount} unread
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="rounded-lg px-2 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-10 text-center text-sm text-gray-500">
                          You don't have any notifications yet.
                        </p>
                      ) : (
                        notifications.map((notification) => (
                          <button
                            type="button"
                            key={notification._id}
                            onClick={() => {
                              setSelectedNotification(notification);
                              setNotificationsOpen(false);

                              if (!notification.isRead) {
                                markAsRead(notification._id);
                              }
                            }}
                            className={`block w-full border-b border-gray-100 px-4 py-4 text-left transition hover:bg-blue-50 ${
                              notification.isRead
                                ? "bg-white"
                                : "bg-blue-50/70"
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
                                <p className="break-words text-sm font-bold text-gray-900">
                                  {notification.title}
                                </p>

                                <p className="mt-1 line-clamp-2 break-words text-sm leading-5 text-gray-600">
                                  {notification.message}
                                </p>

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

            {token ? (
              <>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700 sm:px-4"
                >
                  Logout
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen((open) => !open);
                    setNotificationsOpen(false);
                  }}
                  aria-expanded={menuOpen}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                    menuOpen
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-gray-200 bg-white text-gray-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {menuOpen ? (
                      <path d="M18 6 6 18M6 6l12 12" />
                    ) : (
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                  <span>{menuOpen ? "Close" : "Menu"}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavigate("/login")}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:px-4"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => handleNavigate("/register")}
                  className="rounded-xl bg-blue-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 sm:px-4"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {token && menuOpen && (
          <div className="border-t border-gray-100 bg-white shadow-lg">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                  {(user?.name || user?.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {user?.name || user?.username || "User"}
                  </p>
                  <p className="mt-0.5 text-xs capitalize text-gray-500">
                    {user?.role || "Participant"}
                  </p>
                </div>
              </div>

              <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                  <button
                    type="button"
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={menuLinkClass(item.path)}
                  >
                    <span className="flex-1">{item.label}</span>
                    <span aria-hidden="true" className="text-gray-400">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {selectedNotification &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-gray-950/60 p-4 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedNotification(null);
              }
            }}
          >
            <div
              ref={notificationDetailRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="notification-detail-title"
              className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-7">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
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
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Notification details
                  </p>
                  <h2
                    id="notification-detail-title"
                    className="mt-1 break-words text-xl font-bold leading-7 text-gray-900 sm:text-2xl"
                  >
                    {selectedNotification.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  aria-label="Close notification details"
                  className="shrink-0 rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m18 6-12 12M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-5 px-5 py-6 sm:px-7">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                    Message
                  </p>
                  <p className="whitespace-pre-wrap break-words text-base leading-7 text-gray-700">
                    {selectedNotification.message}
                  </p>
                </div>

                {selectedNotification.event?.title && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Related event
                    </p>
                    <p className="mt-1 break-words font-semibold text-blue-900">
                      {selectedNotification.event.title}
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-medium text-gray-400">
                    Received
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(
                      selectedNotification.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-7">
                <button
                  type="button"
                  onClick={() => setSelectedNotification(null)}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteNotification(selectedNotification)
                  }
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Delete notification
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Navbar;
