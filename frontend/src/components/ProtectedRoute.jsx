import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function isTokenExpired(token) {
  try {
    const decoded = jwt_decode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!token || token === "undefined" || token === "null" || isTokenExpired(token)) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;