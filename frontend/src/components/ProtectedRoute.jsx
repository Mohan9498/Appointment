import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access");

  // ❌ No token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // ❌ Token expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }

    // 🔐 SECURE ADMIN CHECK (from token if available)
    const isAdmin =
      decoded.is_staff || localStorage.getItem("is_admin") === "true";

    // ❌ Not admin → go HOME (not login)
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }

    // ✅ Access granted
    return children;

  } catch (error) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;