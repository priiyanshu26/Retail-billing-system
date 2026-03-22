import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  // 1️⃣ Not logged in → Login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Logged in but role not allowed → redirect to own dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "ROLE_ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (role === "ROLE_USER") {
      return <Navigate to="/billing" replace />;
    }

    // fallback (should never happen)
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Authorized → render the page
  return children;
};

export default ProtectedRoute;
