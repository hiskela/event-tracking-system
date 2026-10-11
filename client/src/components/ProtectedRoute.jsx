import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "participant") {
      return <Navigate to="/participant/dashboard" replace />;
    }

    if (user.role === "organizer") {
      return <Navigate to="/organizer/dashboard" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;