import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {

  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ No token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not admin
  if (adminOnly && (!user || user.is_admin !== true)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;