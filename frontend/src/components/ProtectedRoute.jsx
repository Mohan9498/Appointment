import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly }) {

  const token = localStorage.getItem("access");
  const isAdmin = localStorage.getItem("is_admin");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not admin
  if (adminOnly && isAdmin !== "true") {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}

export default ProtectedRoute;